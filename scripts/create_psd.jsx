// Helper: save PSD to path
function savePsd(doc, path) {
    var file = new File(path);
    var opts = new PhotoshopSaveOptions();
    opts.alphaChannels = true;
    opts.layers = true;
    doc.saveAs(file, opts, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

var basePath = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";

// --- depth_16bit.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "depth_16bit", NewDocumentMode.RGB, DocumentFill.WHITE, 1, BitsPerChannelType.SIXTEEN);
    var layer = doc.artLayers.add();
    layer.name = "16bit Layer";
    savePsd(doc, basePath + "depth_16bit.psd");
})();

// --- depth_32bit.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "depth_32bit", NewDocumentMode.RGB, DocumentFill.WHITE, 1, BitsPerChannelType.THIRTYTWO);
    savePsd(doc, basePath + "depth_32bit.psd");
})();

// --- layer_opacity.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "layer_opacity", NewDocumentMode.RGB, DocumentFill.WHITE);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 0;
    var layer = doc.artLayers.add();
    layer.name = "50% Opacity";
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.opacity = 50;
    savePsd(doc, basePath + "layer_opacity.psd");
})();

// --- layer_hidden.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "layer_hidden", NewDocumentMode.RGB, DocumentFill.WHITE);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 255;
    var layer = doc.artLayers.add();
    layer.name = "Hidden Layer";
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.visible = false;
    savePsd(doc, basePath + "layer_hidden.psd");
})();

// --- blend_mode_multiply.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_multiply", NewDocumentMode.RGB, DocumentFill.WHITE);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 0;
    var layer = doc.artLayers.add();
    layer.name = "Multiply Layer";
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.blendMode = BlendMode.MULTIPLY;
    savePsd(doc, basePath + "blend_mode_multiply.psd");
})();

// --- blend_mode_screen.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_screen", NewDocumentMode.RGB, DocumentFill.WHITE);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 255;
    var layer = doc.artLayers.add();
    layer.name = "Screen Layer";
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.blendMode = BlendMode.SCREEN;
    savePsd(doc, basePath + "blend_mode_screen.psd");
})();

// --- blend_mode_overlay.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_overlay", NewDocumentMode.RGB, DocumentFill.WHITE);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 128;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 0;
    var layer = doc.artLayers.add();
    layer.name = "Overlay Layer";
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    layer.blendMode = BlendMode.OVERLAY;
    savePsd(doc, basePath + "blend_mode_overlay.psd");
})();

// --- layer_group.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "layer_group", NewDocumentMode.RGB, DocumentFill.WHITE);
    var group = doc.layerSets.add();
    group.name = "Group 1";
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 0;
    var layer1 = group.artLayers.add();
    layer1.name = "Child Layer 1";
    doc.activeLayer = layer1;
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 255;
    var layer2 = group.artLayers.add();
    layer2.name = "Child Layer 2";
    doc.activeLayer = layer2;
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    savePsd(doc, basePath + "layer_group.psd");
})();

// --- nested_groups.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "nested_groups", NewDocumentMode.RGB, DocumentFill.WHITE);
    var g1 = doc.layerSets.add();
    g1.name = "Level 1";
    var g2 = g1.layerSets.add();
    g2.name = "Level 2";
    var g3 = g2.layerSets.add();
    g3.name = "Level 3";
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 0;
    var leaf = g3.artLayers.add();
    leaf.name = "Deep Layer";
    doc.activeLayer = leaf;
    doc.selection.selectAll();
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    savePsd(doc, basePath + "nested_groups.psd");
})();

// --- empty_group.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "empty_group", NewDocumentMode.RGB, DocumentFill.WHITE);
    var group = doc.layerSets.add();
    group.name = "Empty Group";
    savePsd(doc, basePath + "empty_group.psd");
})();

// --- clipping_mask.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "clipping_mask", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    // Base layer (circle shape area)
    var baseLayer = doc.artLayers.add();
    baseLayer.name = "Base Layer";
    doc.activeLayer = baseLayer;
    var selRegion = [[50, 50], [150, 50], [150, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 255;
    fillColor.rgb.blue = 0;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    // Clipped layer
    var clippedLayer = doc.artLayers.add();
    clippedLayer.name = "Clipped Layer";
    doc.activeLayer = clippedLayer;
    doc.selection.selectAll();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 0;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    clippedLayer.grouped = true;
    // Move clipped above base
    clippedLayer.move(baseLayer, ElementPlacement.PLACEBEFORE);
    savePsd(doc, basePath + "clipping_mask.psd");
})();

// --- drop_shadow.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "drop_shadow", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Drop Shadow Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 50], [250, 50], [250, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 255;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    // Apply drop shadow via Action Manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Drop Shadow
    var dsDesc = new ActionDescriptor();
    dsDesc.putBoolean(charIDToTypeID("enab"), true);
    dsDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0);
    colorDesc.putDouble(charIDToTypeID("Grn "), 0);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    dsDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    dsDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    dsDesc.putBoolean(charIDToTypeID("uglg"), true);
    dsDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    dsDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    dsDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    dsDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    dsDesc.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    dsDesc.putBoolean(stringIDToTypeID("antiAlias"), false);
    lfxDesc.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), dsDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "drop_shadow.psd");
})();

// --- inner_shadow.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "inner_shadow", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Inner Shadow Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 50], [250, 50], [250, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 100;
    fillColor.rgb.green = 200;
    fillColor.rgb.blue = 100;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var isDesc = new ActionDescriptor();
    isDesc.putBoolean(charIDToTypeID("enab"), true);
    isDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0);
    colorDesc.putDouble(charIDToTypeID("Grn "), 0);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    isDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    isDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    isDesc.putBoolean(charIDToTypeID("uglg"), true);
    isDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    isDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    isDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    isDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    isDesc.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    lfxDesc.putObject(charIDToTypeID("IrSh"), charIDToTypeID("IrSh"), isDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "inner_shadow.psd");
})();

// --- outer_glow.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "outer_glow", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Outer Glow Layer";
    doc.activeLayer = layer;
    var selRegion = [[75, 50], [225, 50], [225, 150], [75, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 50;
    fillColor.rgb.green = 50;
    fillColor.rgb.blue = 200;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ogDesc = new ActionDescriptor();
    ogDesc.putBoolean(charIDToTypeID("enab"), true);
    ogDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    colorDesc.putDouble(charIDToTypeID("Grn "), 255);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    ogDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    ogDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ogDesc.putEnumerated(stringIDToTypeID("glowTechnique"), stringIDToTypeID("matteTechnique"), stringIDToTypeID("softMatte"));
    ogDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ogDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    ogDesc.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    ogDesc.putUnitDouble(charIDToTypeID("ShdN"), charIDToTypeID("#Prc"), 0);
    ogDesc.putBoolean(stringIDToTypeID("antiAlias"), false);
    ogDesc.putUnitDouble(charIDToTypeID("Inpr"), charIDToTypeID("#Prc"), 50);
    lfxDesc.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), ogDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "outer_glow.psd");
})();

// --- inner_glow.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "inner_glow", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Inner Glow Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 25], [250, 25], [250, 175], [50, 175]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 0;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 128;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var igDesc = new ActionDescriptor();
    igDesc.putBoolean(charIDToTypeID("enab"), true);
    igDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    colorDesc.putDouble(charIDToTypeID("Grn "), 255);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 255);
    igDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    igDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    igDesc.putEnumerated(stringIDToTypeID("glowTechnique"), stringIDToTypeID("matteTechnique"), stringIDToTypeID("softMatte"));
    igDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    igDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    igDesc.putUnitDouble(charIDToTypeID("ShdN"), charIDToTypeID("#Prc"), 0);
    igDesc.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    igDesc.putBoolean(stringIDToTypeID("antiAlias"), false);
    igDesc.putUnitDouble(charIDToTypeID("Inpr"), charIDToTypeID("#Prc"), 50);
    igDesc.putEnumerated(stringIDToTypeID("innerGlowSource"), stringIDToTypeID("innerGlowSourceType"), stringIDToTypeID("edgeGlow"));
    lfxDesc.putObject(charIDToTypeID("IrGl"), charIDToTypeID("IrGl"), igDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "inner_glow.psd");
})();

// --- bevel_emboss.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "bevel_emboss", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Bevel Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 50], [250, 50], [250, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 128;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 128;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var bevlDesc = new ActionDescriptor();
    bevlDesc.putBoolean(charIDToTypeID("enab"), true);
    bevlDesc.putEnumerated(stringIDToTypeID("bevelStyle"), stringIDToTypeID("bevelEmbossStyle"), stringIDToTypeID("innerBevel"));
    bevlDesc.putEnumerated(stringIDToTypeID("bevelTechnique"), stringIDToTypeID("bevelTechnique"), stringIDToTypeID("softMatte"));
    bevlDesc.putUnitDouble(stringIDToTypeID("strengthRatio"), charIDToTypeID("#Prc"), 100);
    bevlDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bevlDesc.putEnumerated(stringIDToTypeID("bevelDirection"), stringIDToTypeID("bevelEmbossStampStyle"), stringIDToTypeID("stampIn"));
    bevlDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bevlDesc.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    // Highlight
    bevlDesc.putEnumerated(stringIDToTypeID("highlightMode"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var hlColor = new ActionDescriptor();
    hlColor.putDouble(charIDToTypeID("Rd  "), 255);
    hlColor.putDouble(charIDToTypeID("Grn "), 255);
    hlColor.putDouble(charIDToTypeID("Bl  "), 255);
    bevlDesc.putObject(stringIDToTypeID("highlightColor"), charIDToTypeID("RGBC"), hlColor);
    bevlDesc.putUnitDouble(stringIDToTypeID("highlightOpacity"), charIDToTypeID("#Prc"), 75);
    // Shadow
    bevlDesc.putEnumerated(stringIDToTypeID("shadowMode"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var shColor = new ActionDescriptor();
    shColor.putDouble(charIDToTypeID("Rd  "), 0);
    shColor.putDouble(charIDToTypeID("Grn "), 0);
    shColor.putDouble(charIDToTypeID("Bl  "), 0);
    bevlDesc.putObject(stringIDToTypeID("shadowColor"), charIDToTypeID("RGBC"), shColor);
    bevlDesc.putUnitDouble(stringIDToTypeID("shadowOpacity"), charIDToTypeID("#Prc"), 75);
    lfxDesc.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bevlDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "bevel_emboss.psd");
})();

// --- stroke_effect.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "stroke_effect", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Stroke Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 50], [250, 50], [250, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 200;
    fillColor.rgb.green = 200;
    fillColor.rgb.blue = 200;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var frDesc = new ActionDescriptor();
    frDesc.putBoolean(charIDToTypeID("enab"), true);
    frDesc.putEnumerated(stringIDToTypeID("style"), stringIDToTypeID("frameStyle"), stringIDToTypeID("outsetFrame"));
    frDesc.putEnumerated(stringIDToTypeID("paintType"), stringIDToTypeID("frameFill"), stringIDToTypeID("solidColor"));
    frDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    frDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    frDesc.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 3);
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    colorDesc.putDouble(charIDToTypeID("Grn "), 0);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    frDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    lfxDesc.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), frDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "stroke_effect.psd");
})();

// --- color_overlay.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "color_overlay", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Color Overlay Layer";
    doc.activeLayer = layer;
    var selRegion = [[50, 50], [250, 50], [250, 150], [50, 150]];
    doc.selection.select(selRegion);
    var fillColor = new SolidColor();
    fillColor.rgb.red = 128;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 128;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var sofiDesc = new ActionDescriptor();
    sofiDesc.putBoolean(charIDToTypeID("enab"), true);
    sofiDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    sofiDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    colorDesc.putDouble(charIDToTypeID("Grn "), 0);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 128);
    sofiDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    lfxDesc.putObject(charIDToTypeID("SoFi"), charIDToTypeID("SoFi"), sofiDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, basePath + "color_overlay.psd");
})();

// --- layer_mask.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "layer_mask", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Masked Layer";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 255;
    fillColor.rgb.green = 0;
    fillColor.rgb.blue = 0;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    // Select center region for mask
    var selRegion = [[50, 50], [150, 50], [150, 150], [50, 150]];
    doc.selection.select(selRegion);
    // Add layer mask from selection
    var desc = new ActionDescriptor();
    desc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    desc.putReference(charIDToTypeID("At  "), ref);
    desc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, basePath + "layer_mask.psd");
})();

// --- vector_mask_rectangle.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "vector_mask_rectangle", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Create a rectangle shape layer
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0);
    colorDesc.putDouble(charIDToTypeID("Grn "), 128);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 255);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    var rectDesc = new ActionDescriptor();
    rectDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    rectDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    rectDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    rectDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), rectDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Rectangle Shape";
    savePsd(doc, basePath + "vector_mask_rectangle.psd");
})();

// --- vector_mask_ellipse.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "vector_mask_ellipse", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255);
    colorDesc.putDouble(charIDToTypeID("Grn "), 128);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    var ellipseDesc = new ActionDescriptor();
    ellipseDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 20);
    ellipseDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 20);
    ellipseDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 180);
    ellipseDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 180);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Elps"), ellipseDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Ellipse Shape";
    savePsd(doc, basePath + "vector_mask_ellipse.psd");
})();

// --- adjustment_brightness.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_brightness", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Add a colored base layer
    var layer = doc.artLayers.add();
    layer.name = "Base";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var fillColor = new SolidColor();
    fillColor.rgb.red = 128;
    fillColor.rgb.green = 128;
    fillColor.rgb.blue = 128;
    doc.selection.fill(fillColor);
    doc.selection.deselect();
    // Add Brightness/Contrast adjustment layer
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var britDesc = new ActionDescriptor();
    britDesc.putInteger(charIDToTypeID("Brgh"), 50);
    britDesc.putInteger(charIDToTypeID("Cntr"), 25);
    britDesc.putBoolean(stringIDToTypeID("useLegacy"), false);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), britDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_brightness.psd");
})();

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
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hueDesc = new ActionDescriptor();
    hueDesc.putEnumerated(charIDToTypeID("Clrz"), charIDToTypeID("bool"), charIDToTypeID("bool"));
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

alert("All PSD test files created successfully!");
