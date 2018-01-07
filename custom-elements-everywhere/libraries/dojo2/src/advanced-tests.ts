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

import * as expect from "expect";
import {
  ComponentWithoutChildren,
  ComponentWithChildren,
  ComponentWithChildrenRerender,
  ComponentWithDifferentViews,
  ComponentWithProperties,
  ComponentWithImperativeEvent,
  ComponentWithDeclarativeEvent
} from "./components";

import { ProjectorMixin } from "@dojo/widget-core/mixins/Projector";

// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch: any; // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  app.appendChild(scratch);
});

afterEach(function() {
  app.innerHTML = "";
  scratch = null;
});

describe("advanced support", function() {

  describe("attributes and properties", function() {
    it("will pass array data as a property", function() {
      this.weight = 2;
      const Component = ProjectorMixin(ComponentWithProperties);
      const component = new Component();
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-properties");
      const data = wc.arr;
      expect(data).toEqual(["d", "o", "j", "o", "2"]);
    });

    it("will pass object data as a property", function() {
      this.weight = 2;
      const Component = ProjectorMixin(ComponentWithProperties);
      const component = new Component();
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-properties");
      const data = wc.obj;
      expect(data).toEqual({ org: "dojo", repo: "dojo2" });
    });
  });

  describe("events", function() {
    it("can declaratively listen to a lowercase DOM event dispatched by a Custom Element", function() {
      this.weight = 2;
      const Component = ProjectorMixin(ComponentWithDeclarativeEvent);
      const component = new Component();
      component.async = false;
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-event");
      expect(component.lowerCaseHandled).toEqual(false);
      wc.click();
      expect(component.lowerCaseHandled).toEqual(true);
    });

    it("can declaratively listen to a kebab-case DOM event dispatched by a Custom Element", function() {
      this.weight = 1;
      const Component = ProjectorMixin(ComponentWithDeclarativeEvent);
      const component = new Component();
      component.async = false;
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-event");
      expect(component.kebabHandled).toEqual(false);
      wc.click();
      expect(component.kebabHandled).toEqual(true);
    });

    it("can declaratively listen to a camelCase DOM event dispatched by a Custom Element", function() {
      this.weight = 1;
      const Component = ProjectorMixin(ComponentWithDeclarativeEvent);
      const component = new Component();
      component.async = false;
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-event");
      expect(component.camelHandled).toEqual(false);
      wc.click();
      expect(component.camelHandled).toEqual(true);
    });

    it("can declaratively listen to a CAPScase DOM event dispatched by a Custom Element", function() {
      this.weight = 1;
      const Component = ProjectorMixin(ComponentWithDeclarativeEvent);
      const component = new Component();
      component.async = false;
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-event");
      expect(component.capsHandled).toEqual(false);
      wc.click();
      expect(component.capsHandled).toEqual(true);
    });

    it("can declaratively listen to a PascalCase DOM event dispatched by a Custom Element", function() {
      this.weight = 1;
      const Component = ProjectorMixin(ComponentWithDeclarativeEvent);
      const component = new Component();
      component.async = false;
      component.append(scratch);
      const wc: any = document.querySelector("ce-with-event");
      expect(component.pascalHandled).toEqual(false);
      wc.click();
      expect(component.pascalHandled).toEqual(true);
    });
  });

});
