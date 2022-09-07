"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceStatusBarEntry = void 0;
const vscode = require("vscode");
//import * as nls from 'vscode-nls';
const ownedStatusBarEntry_1 = require("./ownedStatusBarEntry");
//const localize = nls.loadMessageBundle();

const selectSliceCommandId = '_preview-mrc.selectSlice';

class SliceStatusBarEntry extends ownedStatusBarEntry_1.PreviewStatusBarEntry {
    constructor() {
        super({
            id: 'preview-mrc.sliceNumber',
            name: "Slice number",
            alignment: vscode.StatusBarAlignment.Right,
            priority: 102,
        });
        this.maxSlice = 1;
        this.maxSliceString = "1-" + this.maxSlice.toString()
        function isInt(value) {
            var x = parseFloat(value);
            return !isNaN(value) && (x | 0) === x;
          }
        this._onDidChangeSlice = this._register(new vscode.EventEmitter());
        this.onDidChangeSlice = this._onDidChangeSlice.event;
        this._register(vscode.commands.registerCommand(selectSliceCommandId, () => __awaiter(this, void 0, void 0, function* () {
            
            
            
            var pick = yield vscode.window.showInputBox({ignoreFocusOut:false,
                placeHolder: this.maxSliceString,
                title:"Input slice to display",
                value:1,
                
                validateInput: text => {
                    if (isNaN(text)) {
                        return "No Integer";
                    }
                    var x = parseFloat(text);

                    return (x | 0) === x && x <= this.maxSlice && x > 0 ? null : 'Invalid Integer';  // return null if validates
                }})
            
            if (pick) {
                
                this._onDidChangeSlice.fire({ slice: pick-1 });
            }
        })));
        this.entry.command = selectSliceCommandId;
    }

    updateOptions(maxSlice){
        this.maxSlice = maxSlice;
        this.maxSliceString = "1-" + this.maxSlice.toString()
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