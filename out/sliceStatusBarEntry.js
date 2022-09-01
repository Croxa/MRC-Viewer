"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceStatusBarEntry = void 0;
const vscode = require("vscode");
//import * as nls from 'vscode-nls';
const ownedStatusBarEntry_1 = require("./ownedStatusBarEntry");
//const localize = nls.loadMessageBundle();


class SliceStatusBarEntry extends ownedStatusBarEntry_1.PreviewStatusBarEntry {
    constructor() {
        super({
            id: 'preview-mrc.sliceNumber',
            name: "Slice number",
            alignment: vscode.StatusBarAlignment.Right,
            priority: 100,
        });
    }
    show(owner, slice) {

        super.showItem(owner, slice);
        // if (typeof size === 'number') {
        //     super.showItem(owner, BinarySize.formatSize(size));
        // }
        // else {
        //     this.hide(owner);
        // }
    }
}
exports.SliceStatusBarEntry = SliceStatusBarEntry;
//# sourceMappingURL=binarySizeStatusBarEntry.js.map