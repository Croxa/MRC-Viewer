self.onmessage = function(event) {  
    var buffer = event.data[0];
    
    importScripts('./UTIF.js');
    var ifds = UTIF.decode(buffer);
    var page = ifds[0];
    UTIF.decodeImage(buffer, page);

    var rgba = UTIF.toRGBA8(page);  // Uint8Array with RGBA pixels

    self.postMessage([rgba,page.width,page.height]);
  };