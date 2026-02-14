function savePsd(doc, path) {
    var file = new File(path);
    var opts = new PhotoshopSaveOptions();
    opts.alphaChannels = true;
    opts.layers = true;
    doc.saveAs(file, opts, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

function makeTextLayer(doc, name, text, x, y, size, r, g, b, fontPS) {
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.name = name;
    var ti = layer.textItem;
    ti.contents = text;
    ti.font = fontPS || "Roboto-Regular";
    ti.size = new UnitValue(size, "pt");
    ti.position = [new UnitValue(x, "px"), new UnitValue(y, "px")];
    var c = new SolidColor();
    c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    ti.color = c;
    return layer;
}

var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";

// --- text_emoji.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "text_emoji", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "\uD83D\uDE00\uD83D\uDE80\u2764", "\uD83D\uDE00 \uD83D\uDE80 \u2764 \uD83C\uDF1F", 30, 100, 36, 0, 0, 0, "NotoSansJP-Regular");
    savePsd(doc, basePath + "text_emoji.psd");
})();

alert("Done");
