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
exports.ZoomStatusBarEntry = void 0;
const vscode = require("vscode");
//import * as nls from 'vscode-nls';
const ownedStatusBarEntry_1 = require("./ownedStatusBarEntry");
//const localize = nls.loadMessageBundle();
const selectZoomLevelCommandId = '_preview-mrc.selectZoomLevel';
class ZoomStatusBarEntry extends ownedStatusBarEntry_1.PreviewStatusBarEntry {
    constructor() {
        super({
            id: 'preview-mrc.zoom',
            name: "Image Zoom",
            alignment: vscode.StatusBarAlignment.Right,
            priority: 103 /* to the left of editor size entry (101) */,
        });
        this._onDidChangeScale = this._register(new vscode.EventEmitter());
        this.onDidChangeScale = this._onDidChangeScale.event;
        this._register(vscode.commands.registerCommand(selectZoomLevelCommandId, () => __awaiter(this, void 0, void 0, function* () {
            const scales = [10, 5, 2, 1, 0.5, 0.2, 0.1, 'fit'];
            const options = scales.map((scale) => ({
                label: this.zoomLabel(scale),
                scale
            }));
            const pick = yield vscode.window.showQuickPick(options, {
                placeHolder: "Select zoom level"
            });
            if (pick) {
                this._onDidChangeScale.fire({ scale: pick.scale });
            }
        })));
        this.entry.command = selectZoomLevelCommandId;
    }
    show(owner, scale) {

        this.showItem(owner, this.zoomLabel(scale));
    }
    zoomLabel(scale) {
        return scale === 'fit'
            ? "Whole Image"
            : `${Math.round(scale * 100)}%`;
    }
}
exports.ZoomStatusBarEntry = ZoomStatusBarEntry;
//# sourceMappingURL=zoomStatusBarEntry.js.map