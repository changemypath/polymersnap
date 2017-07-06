/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/// <reference path="../custom_typings/main.d.ts" />

import './all-passes';

import * as clone from 'clone';
import {Analyzer} from 'polymer-analyzer';
import {ParsedDocument} from 'polymer-analyzer/lib/parser/document';

import {registry} from './registry';
import {UpgradePass} from './upgrade-pass';

export interface Options { upgradePasses: string[]; }

/**
 * Runs upgrade passes to transform your code.
 */
export class Upgrader {
  upgradePasses: UpgradePass<any>[];

  constructor(options: Options) {
    this.upgradePasses = Array.from(registry.getPasses(options.upgradePasses));
  }

  /**
   * Upgrades the given file and returns its new contents as a string.
   */
  async upgrade(rootFile: string, analyzer: Analyzer) {
    const rootDoc = await analyzer.analyze(rootFile);

    const parsed = clone(rootDoc.parsedDocument);
    this._upgradeDoc(parsed);
    return parsed.stringify({indent: 0});
  }

  /**
   * Mutates the given parsed document to upgrade it.
   */
  private _upgradeDoc(parsed: ParsedDocument<any, any>) {
    for (const pass of this.upgradePasses.filter(p => p.canUpgrade(parsed))) {
      pass.upgrade(parsed);
    }
  }
}
