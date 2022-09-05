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
exports.PreviewManager = void 0;
const vscode = require("vscode");
const dispose_1 = require("./dispose");
class PreviewManager {
    constructor(extensionRoot, sizeStatusBarEntry, binarySizeStatusBarEntry, zoomStatusBarEntry, sliceStatusBarEntry) {
        this.extensionRoot = extensionRoot;
        this.sizeStatusBarEntry = sizeStatusBarEntry;
        this.binarySizeStatusBarEntry = binarySizeStatusBarEntry;
        this.zoomStatusBarEntry = zoomStatusBarEntry;
        this.sliceStatusBarEntry = sliceStatusBarEntry;
        this._previews = new Set();
    }
    openCustomDocument(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return { uri, dispose: () => { } };
        });
    }
    resolveCustomEditor(document, webviewEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            const preview = new Preview(this.extensionRoot, document.uri, webviewEditor, this.sizeStatusBarEntry, this.binarySizeStatusBarEntry, this.zoomStatusBarEntry, this.sliceStatusBarEntry);
            this._previews.add(preview);
            this.setActivePreview(preview);
            webviewEditor.onDidDispose(() => { this._previews.delete(preview); });
            webviewEditor.onDidChangeViewState(() => {
                if (webviewEditor.active) {
                    this.setActivePreview(preview);
                }
                else if (this._activePreview === preview && !webviewEditor.active) {
                    this.setActivePreview(undefined);
                }
            });
        });
    }
    get activePreview() { return this._activePreview; }
    setActivePreview(value) {
        this._activePreview = value;
        this.setPreviewActiveContext(!!value);
    }
    setPreviewActiveContext(value) {
        vscode.commands.executeCommand('setContext', 'preview-mrcFocus', value);
    }
}
exports.PreviewManager = PreviewManager;
PreviewManager.viewType = 'philippschoennenbeck.preview-mrc';
class Preview extends dispose_1.Disposable {
    constructor(extensionRoot, resource, webviewEditor, sizeStatusBarEntry, binarySizeStatusBarEntry, zoomStatusBarEntry, sliceStatusBarEntry) {
        super();
        this.extensionRoot = extensionRoot;
        this.resource = resource;
        this.webviewEditor = webviewEditor;
        this.sizeStatusBarEntry = sizeStatusBarEntry;
        this.binarySizeStatusBarEntry = binarySizeStatusBarEntry;
        this.zoomStatusBarEntry = zoomStatusBarEntry;
        this.sliceStatusBarEntry = sliceStatusBarEntry;
        this.id = `${Date.now()}-${Math.random().toString()}`;
        this._previewState = 1 /* Visible */;
        this.emptyPngDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42gEFAPr/AP///wAI/AL+Sr4t6gAAAABJRU5ErkJggg==';
        const resourceRoot = resource.with({
            path: resource.path.replace(/\/[^\/]+?\.\w+$/, '/'),
        });
        webviewEditor.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                resourceRoot,
                extensionRoot,
            ]
        };
        this._register(webviewEditor.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'size':
                    {
                        this._imageSize = message.value;
                        this.update();
                        break;
                    }
                case 'zoom':
                    {
                        this._imageZoom = message.value;
                        this.update();
                        break;
                    }
                case 'reopen-as-text':
                    {
                        vscode.commands.executeCommand('vscode.openWith', resource, 'default', webviewEditor.viewColumn);
                        break;
                    }
                case 'slice':
                    {
                        this._sliceString = message.value;
                        this.update();
                        break;
                    }
                case 'message':
                    {
                        vscode.window.showInformationMessage(message.value);
                        
                    }
                case "updateSlicing":
                    {
                        this.sliceStatusBarEntry.updateOptions(message.value);
                    }
            }
        }));
        this._register(zoomStatusBarEntry.onDidChangeScale(e => {
            if (this._previewState === 2 /* Active */) {
                this.webviewEditor.webview.postMessage({ type: 'setScale', scale: e.scale });
            }
        }));

        this._register(sliceStatusBarEntry.onDidChangeSlice(e => {
            if (this._previewState === 2 /* Active */) {
                this.webviewEditor.webview.postMessage({ type: 'setSlice', slice: e.slice });
            }
        }));



        this._register(webviewEditor.onDidChangeViewState(() => {
            this.update();
            this.webviewEditor.webview.postMessage({ type: 'setActive', value: this.webviewEditor.active });
        }));
        this._register(webviewEditor.onDidDispose(() => {
            if (this._previewState === 2 /* Active */) {
                this.sizeStatusBarEntry.hide(this.id);
                this.binarySizeStatusBarEntry.hide(this.id);
                this.zoomStatusBarEntry.hide(this.id);
                this.sliceStatusBarEntry.hide(this.id);
            }
            this._previewState = 0 /* Disposed */;
        }));
        const watcher = this._register(vscode.workspace.createFileSystemWatcher(resource.fsPath));
        this._register(watcher.onDidChange(e => {
            if (e.toString() === this.resource.toString()) {
                this.render();
            }
        }));
        this._register(watcher.onDidDelete(e => {
            if (e.toString() === this.resource.toString()) {
                this.webviewEditor.dispose();
            }
        }));
        vscode.workspace.fs.stat(resource).then(({ size }) => {
            this._imageBinarySize = size;
            this.update();
        });
        this.render();
        this.update();
        this.webviewEditor.webview.postMessage({ type: 'setActive', value: this.webviewEditor.active });
    }
    zoomIn() {
        if (this._previewState === 2 /* Active */) {
            this.webviewEditor.webview.postMessage({ type: 'zoomIn' });
        }
    }
    zoomOut() {
        if (this._previewState === 2 /* Active */) {
            this.webviewEditor.webview.postMessage({ type: 'zoomOut' });
        }
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._previewState !== 0 /* Disposed */) {
                this.webviewEditor.webview.html = yield this.getWebviewContents();
            }
        });
    }
    update() {
        if (this._previewState === 0 /* Disposed */) {
            return;
        }
        if (this.webviewEditor.active) {
            this._previewState = 2 /* Active */;
            this.sizeStatusBarEntry.show(this.id, this._imageSize || '');
            this.binarySizeStatusBarEntry.show(this.id, this._imageBinarySize);
            this.zoomStatusBarEntry.show(this.id, this._imageZoom || 'fit');
            this.sliceStatusBarEntry.show(this.id, this._sliceString || '');
        }
        else {
            if (this._previewState === 2 /* Active */) {
                this.sizeStatusBarEntry.hide(this.id);
                this.binarySizeStatusBarEntry.hide(this.id);
                this.zoomStatusBarEntry.hide(this.id);
                this.sliceStatusBarEntry.hide(this.id);
            }
            this._previewState = 1 /* Visible */;
        }
    }
    getWebviewContents() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = Date.now().toString();

            const settings = {
                isMac: process.platform === 'darwin',
                src: yield this.getResourcePath(this.webviewEditor, this.resource, version),
                worker: escapeAttribute(this.extensionResource('/media/worker.js')),
            };
            const cspSource = this.webviewEditor.webview.cspSource;
            const nonce = Date.now().toString();
            return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<!-- Disable pinch zooming -->
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">

	<title>MRC Preview</title>

	<link rel="stylesheet" href="${escapeAttribute(this.extensionResource('/media/main.css'))}" type="text/css" media="screen" nonce="${nonce}">

	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self' ${cspSource}; img-src data: ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}';">
	<meta id="preview-mrc-settings" data-settings="${escapeAttribute(JSON.stringify(settings))}">

	<!-- add script resources for UTIF.js -->
	<script src="${escapeAttribute(this.extensionResource('/media/UTIF.js'))}" nonce="${nonce}"></script>
</head>
<body class="container image scale-to-fit loading">
    

	<div class="loading-indicator"></div>
	<div class="image-load-error">
		<p>An error occurred while loading the image.</p>
		<a href="#" class="open-file-link">Open file using VS Code's standard text/binary editor?</a>
	</div>

	<script src="${escapeAttribute(this.extensionResource('/media/main.js'))}" nonce="${nonce}"></script>
</body>
</html>`;
        });
    }
    getResourcePath(webviewEditor, resource, version) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resource.scheme === 'git') {
                const stat = yield vscode.workspace.fs.stat(resource);
                if (stat.size === 0) {
                    return this.emptyPngDataUri;
                }
            }
            // Avoid adding cache busting if there is already a query string
            if (resource.query) {
                return webviewEditor.webview.asWebviewUri(resource).toString();
            }
            return webviewEditor.webview.asWebviewUri(resource).with({ query: `version=${version}` }).toString();
        });
    }
    extensionResource(path) {
        return this.webviewEditor.webview.asWebviewUri(this.extensionRoot.with({
            path: this.extensionRoot.path + path
        }));
    }
}
function escapeAttribute(value) {
    return value.toString().replace(/"/g, '&quot;');
}
//# sourceMappingURL=preview.js.map