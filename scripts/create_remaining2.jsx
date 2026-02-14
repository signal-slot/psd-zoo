function savePsd(doc, path) {
    var file = new File(path);
    var opts = new PhotoshopSaveOptions();
    opts.alphaChannels = true;
    opts.layers = true;
    doc.saveAs(file, opts, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

function fillLayer(doc, name, r, g, b, region) {
    var layer = doc.artLayers.add();
    layer.name = name;
    doc.activeLayer = layer;
    if (region) {
        doc.selection.select(region);
    } else {
        doc.selection.selectAll();
    }
    var c = new SolidColor();
    c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c);
    doc.selection.deselect();
    return layer;
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

// --- indexed_mode.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "indexed_mode", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Color", 255, 128, 0);
    doc.flatten();
    var opts = new IndexedConversionOptions();
    opts.colors = 256;
    opts.dither = Dither.DIFFUSION;
    opts.palette = Palette.LOCALADAPTIVE;
    doc.changeMode(ChangeMode.INDEXEDCOLOR, opts);
    savePsd(doc, basePath + "indexed_mode.psd");
})();

// --- multichannel_mode.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "multichannel_mode", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Color", 0, 128, 255);
    doc.flatten();
    doc.changeMode(ChangeMode.MULTICHANNEL);
    savePsd(doc, basePath + "multichannel_mode.psd");
})();

// --- text_small_font.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "text_small_font", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Tiny", "Tiny text at 8pt", 10, 50, 8, 0, 0, 0);
    savePsd(doc, basePath + "text_small_font.psd");
})();

// --- transparent_background.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "transparent_background", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var region = [[50, 50], [150, 50], [150, 150], [50, 150]];
    fillLayer(doc, "Floating Square", 255, 0, 0, region);
    savePsd(doc, basePath + "transparent_background.psd");
})();

// --- vector_stroke.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "vector_stroke", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 100);
    colorDesc.putDouble(charIDToTypeID("Grn "), 150);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 200);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    var rectDesc = new ActionDescriptor();
    rectDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    rectDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    rectDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    rectDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), rectDesc);
    var strokeDesc = new ActionDescriptor();
    strokeDesc.putBoolean(stringIDToTypeID("fillEnabled"), true);
    strokeDesc.putBoolean(stringIDToTypeID("strokeEnabled"), true);
    var strokeColorDesc = new ActionDescriptor();
    strokeColorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    strokeColorDesc.putDouble(charIDToTypeID("Grn "), 0);
    strokeColorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    var strokeContentDesc = new ActionDescriptor();
    strokeContentDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), strokeColorDesc);
    strokeDesc.putObject(stringIDToTypeID("strokeStyleContent"), stringIDToTypeID("solidColorLayer"), strokeContentDesc);
    strokeDesc.putUnitDouble(stringIDToTypeID("strokeStyleLineWidth"), charIDToTypeID("#Pxl"), 3);
    strokeDesc.putUnitDouble(stringIDToTypeID("strokeStyleOpacity"), charIDToTypeID("#Prc"), 100);
    shapeDesc.putObject(stringIDToTypeID("strokeStyle"), stringIDToTypeID("strokeStyle"), strokeDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Stroked Rectangle";
    savePsd(doc, basePath + "vector_stroke.psd");
})();

// --- rounded_rectangle.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "rounded_rectangle", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0);
    colorDesc.putDouble(charIDToTypeID("Grn "), 200);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 100);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    var rrDesc = new ActionDescriptor();
    rrDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    rrDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    rrDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    rrDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    rrDesc.putUnitDouble(stringIDToTypeID("topLeft"), charIDToTypeID("#Pxl"), 20);
    rrDesc.putUnitDouble(stringIDToTypeID("topRight"), charIDToTypeID("#Pxl"), 20);
    rrDesc.putUnitDouble(stringIDToTypeID("bottomLeft"), charIDToTypeID("#Pxl"), 20);
    rrDesc.putUnitDouble(stringIDToTypeID("bottomRight"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("roundedRect"), rrDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Rounded Rectangle";
    savePsd(doc, basePath + "rounded_rectangle.psd");
})();

alert("Remaining PSD files created!");
