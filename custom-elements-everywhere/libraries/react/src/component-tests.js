/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import expect from 'expect';
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithUnregistered,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from './components';

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);
let scratch; // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement('div');
  scratch.id = 'scratch';
  app.appendChild(scratch);
});

afterEach(function() {
  app.innerHTML = '';
  scratch = null;
});

describe('no children', function() {
  it('can display a Custom Element with no children', function() {
    let root = ReactDOM.render(<ComponentWithoutChildren />, scratch);
    let wc = root.wc;
    expect(wc).toExist();
  });
});

describe('with children', function() {
  function expectHasChildren(wc) {
    expect(wc).toExist();
    let shadowRoot = wc.shadowRoot;
    let heading = shadowRoot.querySelector('h1');
    expect(heading).toExist();
    expect(heading.textContent).toEqual('Test h1');
    let paragraph = shadowRoot.querySelector('p');
    expect(paragraph).toExist();
    expect(paragraph.textContent).toEqual('Test p');
  }

  it('can display a Custom Element with children in a Shadow Root', function() {
    let root = ReactDOM.render(<ComponentWithChildren />, scratch);
    let wc = root.wc;
    expectHasChildren(wc);
  });

  it('can display a Custom Element with children in a Shadow Root and pass in Light DOM children', async function() {
    let root = ReactDOM.render(<ComponentWithChildrenRerender />, scratch);
    let wc = root.wc;
    await Promise.resolve();
    expectHasChildren(wc);
    expect(wc.textContent.includes('2')).toEqual(true);
  });

  it('can display a Custom Element with children in the Shadow DOM and handle hiding and showing the element', function() {
    let root = ReactDOM.render(<ComponentWithDifferentViews />, scratch);
    let wc = root.wc;
    expectHasChildren(wc);
    root.toggle();
    let dummy = ReactDOM.findDOMNode(root.refs.dummy);
    expect(dummy).toExist();
    expect(dummy.textContent).toEqual('Dummy view');
    root.toggle();
    wc = root.wc;
    expectHasChildren(wc);
  });
});

describe('attributes and properties', function() {
  it('will pass boolean data as either an attribute or a property', function() {
    let root = ReactDOM.render(<ComponentWithProperties />, scratch);
    let wc = root.wc;
    let data = wc.bool || wc.hasAttribute('bool');
    expect(data).toBe(true);
  });

  it('will pass numeric data as either an attribute or a property', function() {
    let root = ReactDOM.render(<ComponentWithProperties />, scratch);
    let wc = root.wc;
    let data = wc.num || wc.getAttribute('num');
    expect(data).toEqual(42);
  });

  it('will pass string data as either an attribute or a property', function() {
    let root = ReactDOM.render(<ComponentWithProperties />, scratch);
    let wc = root.wc;
    let data = wc.str || wc.getAttribute('str');
    expect(data).toEqual('React');
  });

  it('will pass array data as a property', function() {
    let root = ReactDOM.render(<ComponentWithProperties />, scratch);
    let wc = root.wc;
    let data = wc.arr;
    expect(data).toEqual(['R', 'e', 'a', 'c', 't']);
  });

  it('will pass object data as a property', function() {
    let root = ReactDOM.render(<ComponentWithProperties />, scratch);
    let wc = root.wc;
    let data = wc.obj;
    expect(data).toEqual({ org: 'facebook', repo: 'react' });
  });

  // TODO: Is it the framework's responsibility to check if the underlying
  // property is defined? Or should it just always assume it is and do its
  // usual default behavior? Preact will actually check if it's defined and
  // use an attribute if it is not, otherwise it prefers properties for
  // everything. Is there a "right" answer in this situation?
  
  // it('will set boolean attributes on a Custom Element that has not already been defined and upgraded', function() {
  //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
  //   let wc = ReactDOM.findDOMNode(root.refs.wc);
  //   expect(wc.hasAttribute('bool')).toBe(true);
  // });

  // it('will set numeric attributes on a Custom Element that has not already been defined and upgraded', function() {
  //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
  //   let wc = ReactDOM.findDOMNode(root.refs.wc);
  //   expect(wc.getAttribute('num')).toEqual('42');
  // });

  // it('will set string attributes on a Custom Element that has not already been defined and upgraded', function() {
  //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
  //   let wc = ReactDOM.findDOMNode(root.refs.wc);
  //   expect(wc.getAttribute('str')).toEqual('React');
  // });

  // it('will set array attributes on a Custom Element that has not already been defined and upgraded', function() {
  //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
  //   let wc = ReactDOM.findDOMNode(root.refs.wc);
  //   expect(wc.getAttribute('arr')).toEqual(JSON.stringify(['R', 'e', 'a', 'c', 't']));
  // });

  // it('will set object attributes on a Custom Element that has not already been defined and upgraded', function() {
  //   let root = ReactDOM.render(<ComponentWithUnregistered />, scratch);
  //   let wc = ReactDOM.findDOMNode(root.refs.wc);
  //   expect(wc.getAttribute('obj')).toEqual(JSON.stringify({ org: 'facebook', repo: 'react' }));
  // });
});

describe('events', function() {
  it('can imperatively listen to a DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithImperativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.handled;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });

  it('can declaratively listen to a lowercase DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithDeclarativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.lowercase;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });

  it('can declaratively listen to a kebab-case DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithDeclarativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.kebab;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });

  it('can declaratively listen to a camelCase DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithDeclarativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.camel;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });

  it('can declaratively listen to a CAPScase DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithDeclarativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.caps;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });

  it('can declaratively listen to a PascalCase DOM event dispatched by a Custom Element', function() {
    let root = ReactDOM.render(<ComponentWithDeclarativeEvent />, scratch);
    let wc = root.wc;
    let handled = root.pascal;
    expect(handled.textContent).toEqual('false');
    wc.click();
    root.forceUpdate();
    expect(handled.textContent).toEqual('true');
  });
});
