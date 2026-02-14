function savePsd(doc, path) {
    var file = new File(path);
    var opts = new PhotoshopSaveOptions();
    opts.alphaChannels = true;
    opts.layers = true;
    doc.saveAs(file, opts, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";

// --- adjustment_hue_saturation.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_hue_saturation", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Base";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 200;
    fillColor.rgb.green = 100;
    fillColor.rgb.blue = 50;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    // Add Hue/Saturation adjustment layer via simpler approach
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hueDesc = new ActionDescriptor();
    hueDesc.putInteger(charIDToTypeID("H   "), 30);
    hueDesc.putInteger(charIDToTypeID("Strt"), -20);
    hueDesc.putInteger(charIDToTypeID("Lght"), 10);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("HStr"), hueDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_hue_saturation.psd");
})();

// --- adjustment_levels.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_levels", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Base";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 100;
    fillColor.rgb.green = 150;
    fillColor.rgb.blue = 200;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var levlDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Lvls"), levlDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_levels.psd");
})();

// --- adjustment_curves.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_curves", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Base";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 150;
    fillColor.rgb.green = 100;
    fillColor.rgb.blue = 180;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var curvDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Crvs"), curvDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_curves.psd");
})();

// --- high_resolution.psd ---
(function() {
    var doc = app.documents.add(200, 200, 300, "high_resolution", NewDocumentMode.RGB, DocumentFill.WHITE);
    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    textLayer.name = "300 DPI Text";
    var textItem = textLayer.textItem;
    textItem.contents = "300 DPI";
    textItem.size = new UnitValue(24, "pt");
    textItem.position = [new UnitValue(30, "px"), new UnitValue(100, "px")];
    var textColor = new SolidColor();
    textColor.rgb.red = 0;
    textColor.rgb.green = 0;
    textColor.rgb.blue = 0;
    textItem.color = textColor;
    savePsd(doc, basePath + "high_resolution.psd");
})();

// --- locked_layer.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "locked_layer", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Locked Layer";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 200;
    fillColor.rgb.blue = 0;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.transparentPixelsLocked = true;
    layer.allLocked = true;
    savePsd(doc, basePath + "locked_layer.psd");
})();

// --- layer_name_unicode.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "layer_name_unicode", NewDocumentMode.RGB, DocumentFill.WHITE);
    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    textLayer.name = "\u65E5\u672C\u8A9E\u30EC\u30A4\u30E4\u30FC";
    var textItem = textLayer.textItem;
    textItem.contents = "\u3053\u3093\u306B\u3061\u306F";
    textItem.size = new UnitValue(24, "pt");
    textItem.position = [new UnitValue(50, "px"), new UnitValue(100, "px")];
    var textColor = new SolidColor();
    textColor.rgb.red = 0;
    textColor.rgb.green = 0;
    textColor.rgb.blue = 0;
    textItem.color = textColor;
    savePsd(doc, basePath + "layer_name_unicode.psd");
})();

alert("Remaining PSD test files created successfully!");
