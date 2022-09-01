"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinarySizeStatusBarEntry = void 0;
const vscode = require("vscode");
//import * as nls from 'vscode-nls';
const ownedStatusBarEntry_1 = require("./ownedStatusBarEntry");
//const localize = nls.loadMessageBundle();
class BinarySize {
    static formatSize(size) {
        if (size < BinarySize.KB) {
            return size.toString() + 'B';
        }
        if (size < BinarySize.MB) {
            return (size / BinarySize.KB).toFixed(2).toString() + 'KB';
        }
        if (size < BinarySize.GB) {
            return (size / BinarySize.MB).toFixed(2).toString() + 'MB';
        }
        if (size < BinarySize.TB) {
            return (size / BinarySize.GB).toFixed(2).toString() + 'GB';
        }
        return (size / BinarySize.TB).toFixed(2).toString() + 'TB';
    }
}
BinarySize.KB = 1024;
BinarySize.MB = BinarySize.KB * BinarySize.KB;
BinarySize.GB = BinarySize.MB * BinarySize.KB;
BinarySize.TB = BinarySize.GB * BinarySize.KB;
class BinarySizeStatusBarEntry extends ownedStatusBarEntry_1.PreviewStatusBarEntry {
    constructor() {
        super({
            id: 'preview-mrc.binarySize',
            name: "Image Binary Size",
            alignment: vscode.StatusBarAlignment.Right,
            priority: 100,
        });
    }
    show(owner, size) {
        if (typeof size === 'number') {
            super.showItem(owner, BinarySize.formatSize(size));
        }
        else {
            this.hide(owner);
        }
    }
}
exports.BinarySizeStatusBarEntry = BinarySizeStatusBarEntry;
//# sourceMappingURL=binarySizeStatusBarEntry.js.map