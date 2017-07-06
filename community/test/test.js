'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let mock = require('mock-fs');
let mockRequire = require('mock-require');

mockRequire('../content-gen.js', '../mock-gen.js');

let server = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('api/content', function() {
  before(function() {
    mock({
      'documents/articles/test-article.md': 'test-article',
      'documents/articles/valid-author.md': 'valid-author',
      'documents/articles/has-excerpt.html.md': `
metadata
excerpt
<!-- Excerpt -->
markdown`,
    });
  });

  after(mock.restore);

  it('should return something', function(done) {
    chai.request(server)
      .get('/content/articles/test-article')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        response.should.be.json;
        const result = JSON.parse(response.text);
        result.should.have.property('metadata');
        result.should.have.property('content', 'test-article');
        done();
      });
  });

  it('should strip excerpt from response', function(done) {
    chai.request(server)
      .get('/content/articles/has-excerpt')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        const result = JSON.parse(response.text);
        result.should.have.property('metadata');
        result.should.have.property('content', 'markdown');
        done();
      });
  });

  it('should contain author object', function(done) {
    chai.request(server)
      .get('/content/articles/valid-author')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        const result = JSON.parse(response.text);
        result.should.have.property('metadata');
        result.metadata.should.have.property('authors');
        result.metadata.authors.should.have.length(1);
        result.metadata.authors[0].should.have.property('bio');
        done();
      });
  });

  it('should not allow relative path urls', function(done) {
    chai.request(server)
      .get('/content/..%2F/app.js')
      .end(function(err, response) {
        response.should.have.status(404);
        done();
      });
  });
});

describe('api/authors', function() {
  it('should 404 on unknown author', function(done) {
    chai.request(server)
      .get('/author/fake-author')
      .end(function(err, response) {
        response.should.have.status(404);
        done();
      });
  });

  it('should return author object', function(done) {
    chai.request(server)
      .get('/author/aaron_frost')
      .end(function(err, response) {
        response.should.have.status(200);
        response.should.be.json;
        done();
      });
  });
});

describe('api/resources', function() {
  it('should have results', function(done) {
    chai.request(server)
      .get('/resources')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        response.should.be.json;
        JSON.parse(response.text).should.have.property('count');
        JSON.parse(response.text).should.have.property('results');
        done();
      });
  });

  it('should respect limit', function(done) {
    chai.request(server)
      .get('/resources?limit=5')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        response.should.be.json;
        JSON.parse(response.text).should.have.property('count');
        done();
      });
  });

  it('should return articles', function(done) {
    chai.request(server)
      .get('/resources/articles')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        response.should.be.json;
        JSON.parse(response.text).should.have.property('count');
        done();
      });
  });

  it('should return filtered list by author', function(done) {
    chai.request(server)
      .get('/resources/author/aaron_frost')
      .end(function(err, response) {
        const header = response.header;
        header.should.have.property('access-control-allow-origin', '*');
        response.should.have.status(200);
        response.should.be.json;
        JSON.parse(response.text).should.have.property('count', 1);
        done();
      });
  });
});
