// === PSD Test Case Generator ===
// All text uses open fonts: Roboto (English), Noto Sans JP (Japanese)

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

var basePath = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";

// ============================================================
// GROUP 1: Text layer tests (recreate with Roboto font)
// ============================================================

// --- single_text_layer.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "single_text_layer", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Hello", "Hello", 50, 100, 24, 0, 0, 0);
    savePsd(doc, basePath + "single_text_layer.psd");
})();

// --- text_with_color.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "text_with_color", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Red Text", "Red Text", 50, 100, 24, 255, 0, 0);
    savePsd(doc, basePath + "text_with_color.psd");
})();

// --- text_large_font.psd ---
(function() {
    var doc = app.documents.add(400, 200, 72, "text_large_font", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Big", "Big", 50, 150, 72, 0, 0, 0);
    savePsd(doc, basePath + "text_large_font.psd");
})();

// --- text_positioned.psd ---
(function() {
    var doc = app.documents.add(500, 500, 72, "text_positioned", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Offset", "Offset", 300, 400, 24, 0, 0, 0);
    savePsd(doc, basePath + "text_positioned.psd");
})();

// --- text_multiline.psd ---
(function() {
    var doc = app.documents.add(300, 300, 72, "text_multiline", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Multiline", "Line One\rLine Two\rLine Three", 50, 80, 24, 0, 0, 0);
    savePsd(doc, basePath + "text_multiline.psd");
})();

// --- multiple_text_layers.psd ---
(function() {
    var doc = app.documents.add(300, 300, 72, "multiple_text_layers", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Top", "Top", 100, 50, 24, 0, 0, 0);
    makeTextLayer(doc, "Middle", "Middle", 100, 150, 24, 0, 0, 0);
    makeTextLayer(doc, "Bottom", "Bottom", 100, 250, 24, 0, 0, 0);
    savePsd(doc, basePath + "multiple_text_layers.psd");
})();

// --- mixed_layers.psd ---
(function() {
    var doc = app.documents.add(300, 300, 72, "mixed_layers", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    // Solid color fill layer via content layer
    var descFill = new ActionDescriptor();
    var refFill = new ActionReference();
    refFill.putClass(stringIDToTypeID("contentLayer"));
    descFill.putReference(charIDToTypeID("null"), refFill);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 200);
    colorDesc.putDouble(charIDToTypeID("Grn "), 200);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 200);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    descFill.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), descFill, DialogModes.NO);
    doc.activeLayer.name = "Background Fill";
    makeTextLayer(doc, "Foreground Text", "Foreground Text", 50, 150, 24, 0, 0, 128);
    savePsd(doc, basePath + "mixed_layers.psd");
})();

// --- canvas_landscape.psd ---
(function() {
    var doc = app.documents.add(1920, 1080, 72, "canvas_landscape", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Landscape", "Landscape", 800, 540, 48, 0, 0, 0);
    savePsd(doc, basePath + "canvas_landscape.psd");
})();

// --- canvas_portrait.psd ---
(function() {
    var doc = app.documents.add(1080, 1920, 72, "canvas_portrait", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Portrait", "Portrait", 400, 960, 48, 0, 0, 0);
    savePsd(doc, basePath + "canvas_portrait.psd");
})();

// --- canvas_large.psd ---
(function() {
    var doc = app.documents.add(4000, 4000, 72, "canvas_large", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "Large Canvas", "Large Canvas", 1800, 2000, 72, 0, 0, 0);
    savePsd(doc, basePath + "canvas_large.psd");
})();

// --- many_layers.psd ---
(function() {
    var doc = app.documents.add(300, 300, 72, "many_layers", NewDocumentMode.RGB, DocumentFill.WHITE);
    var colors = [
        [255,0,0], [0,255,0], [0,0,255], [255,128,0], [128,0,255],
        [0,128,128], [128,128,0], [64,64,64], [192,0,192], [0,192,0]
    ];
    for (var i = 0; i < 10; i++) {
        makeTextLayer(doc, "Layer " + (i+1), "Layer " + (i+1), 10, 20 + i*25, 14, colors[i][0], colors[i][1], colors[i][2]);
    }
    savePsd(doc, basePath + "many_layers.psd");
})();

// --- text_white_on_black.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "text_white_on_black", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var descFill = new ActionDescriptor();
    var refFill = new ActionReference();
    refFill.putClass(stringIDToTypeID("contentLayer"));
    descFill.putReference(charIDToTypeID("null"), refFill);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0);
    colorDesc.putDouble(charIDToTypeID("Grn "), 0);
    colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    descFill.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), descFill, DialogModes.NO);
    doc.activeLayer.name = "Black Background";
    makeTextLayer(doc, "White Text", "White Text", 50, 120, 36, 255, 255, 255);
    savePsd(doc, basePath + "text_white_on_black.psd");
})();

// ============================================================
// GROUP 2: Remaining advanced files
// ============================================================

// --- adjustment_hue_saturation.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_hue_saturation", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Base", 200, 100, 50);
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
    fillLayer(doc, "Base", 100, 150, 200);
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
    fillLayer(doc, "Base", 150, 100, 180);
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
    makeTextLayer(doc, "300 DPI Text", "300 DPI", 30, 100, 24, 0, 0, 0);
    savePsd(doc, basePath + "high_resolution.psd");
})();

// --- locked_layer.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "locked_layer", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Locked Layer", 0, 200, 0);
    layer.transparentPixelsLocked = true;
    layer.allLocked = true;
    savePsd(doc, basePath + "locked_layer.psd");
})();

// --- layer_name_unicode.psd ---
(function() {
    var doc = app.documents.add(300, 200, 72, "layer_name_unicode", NewDocumentMode.RGB, DocumentFill.WHITE);
    makeTextLayer(doc, "\u65E5\u672C\u8A9E\u30EC\u30A4\u30E4\u30FC", "\u3053\u3093\u306B\u3061\u306F", 50, 100, 24, 0, 0, 0, "NotoSansJP-Regular");
    savePsd(doc, basePath + "layer_name_unicode.psd");
})();

// ============================================================
// GROUP 3: Additional blend mode tests
// ============================================================

// --- blend_mode_dissolve.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_dissolve", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Dissolve Layer", 255, 0, 128);
    layer.blendMode = BlendMode.DISSOLVE;
    layer.opacity = 50;
    savePsd(doc, basePath + "blend_mode_dissolve.psd");
})();

// --- blend_mode_darken.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_darken", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Darken Layer", 128, 0, 0);
    layer.blendMode = BlendMode.DARKEN;
    savePsd(doc, basePath + "blend_mode_darken.psd");
})();

// --- blend_mode_colorburn.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_colorburn", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Color Burn Layer", 200, 100, 50);
    layer.blendMode = BlendMode.COLORBURN;
    savePsd(doc, basePath + "blend_mode_colorburn.psd");
})();

// --- blend_mode_linearburn.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_linearburn", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Linear Burn Layer", 100, 100, 200);
    layer.blendMode = BlendMode.LINEARBURN;
    savePsd(doc, basePath + "blend_mode_linearburn.psd");
})();

// --- blend_mode_lighten.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_lighten", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Lighten Layer", 128, 128, 255);
    layer.blendMode = BlendMode.LIGHTEN;
    savePsd(doc, basePath + "blend_mode_lighten.psd");
})();

// --- blend_mode_colordodge.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_colordodge", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Color Dodge Layer", 128, 200, 128);
    layer.blendMode = BlendMode.COLORDODGE;
    savePsd(doc, basePath + "blend_mode_colordodge.psd");
})();

// --- blend_mode_lineardodge.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_lineardodge", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Linear Dodge Layer", 50, 100, 200);
    layer.blendMode = BlendMode.LINEARDODGE;
    savePsd(doc, basePath + "blend_mode_lineardodge.psd");
})();

// --- blend_mode_softlight.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_softlight", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Soft Light Layer", 200, 150, 100);
    layer.blendMode = BlendMode.SOFTLIGHT;
    savePsd(doc, basePath + "blend_mode_softlight.psd");
})();

// --- blend_mode_hardlight.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_hardlight", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Hard Light Layer", 128, 0, 128);
    layer.blendMode = BlendMode.HARDLIGHT;
    savePsd(doc, basePath + "blend_mode_hardlight.psd");
})();

// --- blend_mode_vividlight.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_vividlight", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Vivid Light Layer", 200, 100, 100);
    layer.blendMode = BlendMode.VIVIDLIGHT;
    savePsd(doc, basePath + "blend_mode_vividlight.psd");
})();

// --- blend_mode_linearlight.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_linearlight", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Linear Light Layer", 100, 200, 100);
    layer.blendMode = BlendMode.LINEARLIGHT;
    savePsd(doc, basePath + "blend_mode_linearlight.psd");
})();

// --- blend_mode_pinlight.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_pinlight", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Pin Light Layer", 100, 100, 200);
    layer.blendMode = BlendMode.PINLIGHT;
    savePsd(doc, basePath + "blend_mode_pinlight.psd");
})();

// --- blend_mode_hardmix.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_hardmix", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Hard Mix Layer", 128, 128, 128);
    layer.blendMode = BlendMode.HARDMIX;
    savePsd(doc, basePath + "blend_mode_hardmix.psd");
})();

// --- blend_mode_difference.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_difference", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Difference Layer", 255, 128, 0);
    layer.blendMode = BlendMode.DIFFERENCE;
    savePsd(doc, basePath + "blend_mode_difference.psd");
})();

// --- blend_mode_exclusion.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_exclusion", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Exclusion Layer", 0, 255, 128);
    layer.blendMode = BlendMode.EXCLUSION;
    savePsd(doc, basePath + "blend_mode_exclusion.psd");
})();

// --- blend_mode_subtract.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_subtract", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Subtract Layer", 128, 128, 255);
    layer.blendMode = BlendMode.SUBTRACT;
    savePsd(doc, basePath + "blend_mode_subtract.psd");
})();

// --- blend_mode_divide.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_divide", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Divide Layer", 200, 200, 200);
    layer.blendMode = BlendMode.DIVIDE;
    savePsd(doc, basePath + "blend_mode_divide.psd");
})();

// --- blend_mode_hue.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_hue", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Hue Layer", 255, 0, 0);
    layer.blendMode = BlendMode.HUE;
    savePsd(doc, basePath + "blend_mode_hue.psd");
})();

// --- blend_mode_saturation.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_saturation", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Saturation Layer", 255, 0, 128);
    layer.blendMode = BlendMode.SATURATION;
    savePsd(doc, basePath + "blend_mode_saturation.psd");
})();

// --- blend_mode_color.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_color", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Color Layer", 0, 128, 255);
    layer.blendMode = BlendMode.COLORBLEND;
    savePsd(doc, basePath + "blend_mode_color.psd");
})();

// --- blend_mode_luminosity.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "blend_mode_luminosity", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(doc, "Luminosity Layer", 128, 128, 0);
    layer.blendMode = BlendMode.LUMINOSITY;
    savePsd(doc, basePath + "blend_mode_luminosity.psd");
})();

// ============================================================
// GROUP 4: Additional feature tests
// ============================================================

// --- layer_opacity_gradient.psd (multiple opacity values) ---
(function() {
    var doc = app.documents.add(300, 200, 72, "layer_opacity_gradient", NewDocumentMode.RGB, DocumentFill.WHITE);
    var opacities = [100, 75, 50, 25, 10];
    for (var i = 0; i < opacities.length; i++) {
        var region = [[i*60, 0], [(i+1)*60, 0], [(i+1)*60, 200], [i*60, 200]];
        var layer = fillLayer(doc, "Opacity " + opacities[i] + "%", 255, 0, 0, region);
        layer.opacity = opacities[i];
    }
    savePsd(doc, basePath + "layer_opacity_gradient.psd");
})();

// --- pass_through_group.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "pass_through_group", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Background Color", 128, 128, 128);
    var group = doc.layerSets.add();
    group.name = "PassThrough Group";
    group.blendMode = BlendMode.PASSTHROUGH;
    var child = group.artLayers.add();
    child.name = "Child";
    doc.activeLayer = child;
    doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    doc.selection.fill(c);
    doc.selection.deselect();
    savePsd(doc, basePath + "pass_through_group.psd");
})();

// --- adjustment_color_balance.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_color_balance", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Base", 128, 128, 128);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cbDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("ClrB"), cbDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_color_balance.psd");
})();

// --- adjustment_photo_filter.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_photo_filter", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Base", 150, 180, 200);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var pfDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("photoFilter"), pfDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_photo_filter.psd");
})();

// --- adjustment_gradient_map.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "adjustment_gradient_map", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Base", 128, 128, 128);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var gmDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("GdMp"), gmDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, basePath + "adjustment_gradient_map.psd");
})();

// --- indexed_mode.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "indexed_mode", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Color", 255, 128, 0);
    doc.flatten();
    doc.changeMode(ChangeMode.INDEXEDCOLOR);
    savePsd(doc, basePath + "indexed_mode.psd");
})();

// --- duotone_mode.psd ---
// Note: Duotone requires flattened grayscale first
// Skipping duotone as it requires complex setup

// --- multichannel_mode.psd ---
(function() {
    var doc = app.documents.add(200, 200, 72, "multichannel_mode", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(doc, "Color", 0, 128, 255);
    doc.flatten();
    doc.changeMode(ChangeMode.MULTICHANNEL);
    savePsd(doc, basePath + "multichannel_mode.psd");
})();

// --- rle_compression.psd (default - RLE is standard for PSD) ---
// Already covered by other files as PSD default is RLE

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
    // Create rectangle shape with stroke
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
    // Add stroke style
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

alert("All PSD test files created!");
