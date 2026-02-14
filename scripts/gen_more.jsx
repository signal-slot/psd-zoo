// gen_more.jsx - Additional PSD features
var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

function addColorLayer(doc, r, g, b, name) {
    var layer = doc.artLayers.add();
    layer.name = name || "Color";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c);
    doc.selection.deselect();
    return layer;
}

// 1. Smart filter - Gaussian Blur with different radius
try {
    var d = app.documents.add(200,200,72,"smart_filter_gaussian_20",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 200, 100, 50, "Content");
    // Make paint strokes first
    d.activeLayer = layer;
    var r = [[30,30],[80,30],[80,80],[30,80]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    // Convert to smart object
    var soDesc = new ActionDescriptor();
    executeAction(stringIDToTypeID("newPlacedLayer"), soDesc, DialogModes.NO);
    // Apply gaussian blur
    var gbDesc = new ActionDescriptor();
    gbDesc.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 20);
    executeAction(charIDToTypeID("GsnB"), gbDesc, DialogModes.NO);
    savePsd(d, "smart_filter_gaussian_20"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 2. Smart filter - Motion Blur
try {
    var d = app.documents.add(200,200,72,"smart_filter_motion_blur",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 200, 100, "Content");
    d.activeLayer = layer;
    var r = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    var soDesc = new ActionDescriptor();
    executeAction(stringIDToTypeID("newPlacedLayer"), soDesc, DialogModes.NO);
    var mbDesc = new ActionDescriptor();
    mbDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 45);
    mbDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 20);
    executeAction(charIDToTypeID("MtnB"), mbDesc, DialogModes.NO);
    savePsd(d, "smart_filter_motion_blur"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 3. Smart filter - Noise
try {
    var d = app.documents.add(200,200,72,"smart_filter_noise",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 100, 200, "Content");
    var soDesc = new ActionDescriptor();
    executeAction(stringIDToTypeID("newPlacedLayer"), soDesc, DialogModes.NO);
    var nDesc = new ActionDescriptor();
    nDesc.putEnumerated(charIDToTypeID("Dstr"), charIDToTypeID("Dstr"), charIDToTypeID("Gssn"));
    nDesc.putUnitDouble(charIDToTypeID("Amnt"), charIDToTypeID("#Prc"), 25);
    nDesc.putBoolean(charIDToTypeID("Mnch"), false);
    executeAction(stringIDToTypeID("addNoise"), nDesc, DialogModes.NO);
    savePsd(d, "smart_filter_noise"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 4. Layer with specific pixel aspect ratio (non-square pixels)
try {
    var d = app.documents.add(200,200,72,"pixel_aspect_nonsquare",NewDocumentMode.RGB,DocumentFill.WHITE);
    d.pixelAspectRatio = 2.0;
    addColorLayer(d, 150, 150, 50, "Content");
    savePsd(d, "pixel_aspect_nonsquare"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 5. Layer with custom color space (ProPhoto RGB)
try {
    var d = app.documents.add(200,200,72,"icc_prophoto_rgb",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Convert to ProPhoto RGB
    d.convertProfile("ProPhoto RGB", Intent.RELATIVECOLORIMETRIC, true, false);
    addColorLayer(d, 200, 100, 50, "Content");
    savePsd(d, "icc_prophoto_rgb"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 6. 32-bit with layers
try {
    var d = app.documents.add(200,200,72,"depth_32bit_layers",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 50, "Red");
    addColorLayer(d, 50, 100, 200, "Blue");
    d.bitsPerChannel = BitsPerChannelType.THIRTYTWO;
    savePsd(d, "depth_32bit_layers"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 7. Layer with blend clipped layers as group
try {
    var d = app.documents.add(200,200,72,"group_blend_clipped",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 100, 100, "Base");
    var grp = d.layerSets.add();
    grp.name = "BlendClipped";
    // Set blend clipped layers as group via action manager
    d.activeLayer = grp;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lDesc = new ActionDescriptor();
    lDesc.putBoolean(stringIDToTypeID("blendClipped"), true);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    var l1 = grp.artLayers.add();
    l1.name = "Child";
    d.activeLayer = l1;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "group_blend_clipped"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 8. Shape with rounded corners (rounded rectangle)
try {
    var d = app.documents.add(200,200,72,"shape_rounded_rect",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 100);
    clr.putDouble(charIDToTypeID("Grn "), 150);
    clr.putDouble(charIDToTypeID("Bl  "), 200);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(stringIDToTypeID("topLeft"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("topRight"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("bottomLeft"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("bottomRight"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("roundedRect"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_rounded_rect"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 9. Gradient map with custom gradient
try {
    var d = app.documents.add(200,200,72,"adjustment_gradient_map_custom",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 50, "Content");
    // gradient map adj layer
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var gmDesc = new ActionDescriptor();
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Custom");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    var clrs = new ActionList();
    var c1 = new ActionDescriptor();
    var clr1 = new ActionDescriptor();
    clr1.putDouble(charIDToTypeID("Rd  "), 0);
    clr1.putDouble(charIDToTypeID("Grn "), 0);
    clr1.putDouble(charIDToTypeID("Bl  "), 128);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0);
    c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var clr2 = new ActionDescriptor();
    clr2.putDouble(charIDToTypeID("Rd  "), 255);
    clr2.putDouble(charIDToTypeID("Grn "), 200);
    clr2.putDouble(charIDToTypeID("Bl  "), 0);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096);
    c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c2);
    grad.putList(charIDToTypeID("Clrs"), clrs);
    var trns = new ActionList();
    var t1 = new ActionDescriptor();
    t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0);
    t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor();
    t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t2.putInteger(charIDToTypeID("Lctn"), 4096);
    t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t2);
    grad.putList(charIDToTypeID("Trns"), trns);
    gmDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("GdMp"), gmDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_gradient_map_custom"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 10. Lab color mode with layers
try {
    var d = app.documents.add(200,200,72,"lab_with_layers",NewDocumentMode.LAB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "Colored";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.lab.l = 50; c.lab.a = 30; c.lab.b = -40;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "lab_with_layers"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 11. Layer with very low opacity (1%)
try {
    var d = app.documents.add(200,200,72,"layer_opacity_1",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 255, 0, 0, "Opacity1");
    layer.opacity = 1;
    savePsd(d, "layer_opacity_1"); ok++;
} catch(e) { fail++; }

// 12. Layer with 99% opacity
try {
    var d = app.documents.add(200,200,72,"layer_opacity_99",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 0, 0, 255, "Opacity99");
    layer.opacity = 99;
    savePsd(d, "layer_opacity_99"); ok++;
} catch(e) { fail++; }

// 13. Layer with fill opacity 1%
try {
    var d = app.documents.add(200,200,72,"fill_opacity_1",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 0, 255, 0, "FillOpacity1");
    layer.fillOpacity = 1;
    savePsd(d, "fill_opacity_1"); ok++;
} catch(e) { fail++; }

// 14. Flattened PSD (no layers)
try {
    var d = app.documents.add(200,200,72,"flattened",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 150, 200, "Content");
    d.flatten();
    savePsd(d, "flattened"); ok++;
} catch(e) { fail++; }

// 15. PSD with single pixel (stress test)
try {
    var d = app.documents.add(1,1,72,"canvas_1x1_rgb",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "Pixel";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "canvas_1x1_rgb"); ok++;
} catch(e) { fail++; }

// 16. Very wide canvas (panorama-like)
try {
    var d = app.documents.add(2000,200,72,"canvas_wide",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 200, 150, "Content");
    savePsd(d, "canvas_wide"); ok++;
} catch(e) { fail++; }

// 17. Very tall canvas
try {
    var d = app.documents.add(200,2000,72,"canvas_tall",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 150, "Content");
    savePsd(d, "canvas_tall"); ok++;
} catch(e) { fail++; }

// 18. Square canvas common sizes
try {
    var d = app.documents.add(512,512,72,"canvas_512",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 150, 150, "Content");
    savePsd(d, "canvas_512"); ok++;
} catch(e) { fail++; }

try {
    var d = app.documents.add(1024,1024,72,"canvas_1024",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 150, 150, "Content");
    savePsd(d, "canvas_1024"); ok++;
} catch(e) { fail++; }

// 19. Multiple layer groups at same level
try {
    var d = app.documents.add(200,200,72,"groups_siblings",NewDocumentMode.RGB,DocumentFill.WHITE);
    for(var i = 0; i < 5; i++) {
        var grp = d.layerSets.add();
        grp.name = "Group " + (i+1);
        var layer = grp.artLayers.add();
        layer.name = "Layer " + (i+1);
        d.activeLayer = layer;
        var r = [[i*30, i*30], [i*30+40, i*30], [i*30+40, i*30+40], [i*30, i*30+40]];
        d.selection.select(r);
        var c = new SolidColor();
        c.rgb.red = (i * 50) % 256;
        c.rgb.green = (i * 80 + 50) % 256;
        c.rgb.blue = (i * 120 + 100) % 256;
        d.selection.fill(c);
        d.selection.deselect();
    }
    savePsd(d, "groups_siblings"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 20. Layer ordering (specific z-order)
try {
    var d = app.documents.add(200,200,72,"layer_order",NewDocumentMode.RGB,DocumentFill.WHITE);
    var l1 = addColorLayer(d, 255, 0, 0, "Bottom-Red");
    var l2 = addColorLayer(d, 0, 255, 0, "Middle-Green");
    var l3 = addColorLayer(d, 0, 0, 255, "Top-Blue");
    // Each overlapping slightly
    d.activeLayer = l2;
    l2.translate(new UnitValue(20,"px"), new UnitValue(20,"px"));
    d.activeLayer = l3;
    l3.translate(new UnitValue(40,"px"), new UnitValue(40,"px"));
    savePsd(d, "layer_order"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 21. Blend mode Darker Color
try {
    var d = app.documents.add(200,200,72,"blend_mode_darkercolor",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 50, "Base");
    var layer = addColorLayer(d, 50, 100, 200, "Darker Color");
    layer.blendMode = BlendMode.DARKERCOLOR;
    savePsd(d, "blend_mode_darkercolor"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 22. Blend mode Lighter Color
try {
    var d = app.documents.add(200,200,72,"blend_mode_lightercolor",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 50, "Base");
    var layer = addColorLayer(d, 50, 100, 200, "Lighter Color");
    layer.blendMode = BlendMode.LIGHTERCOLOR;
    savePsd(d, "blend_mode_lightercolor"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 23. Background + Foreground colors saved in PSD
try {
    var d = app.documents.add(200,200,72,"foreground_background_color",NewDocumentMode.RGB,DocumentFill.WHITE);
    var fg = new SolidColor(); fg.rgb.red=255; fg.rgb.green=128; fg.rgb.blue=0;
    var bg = new SolidColor(); bg.rgb.red=0; bg.rgb.green=128; bg.rgb.blue=255;
    app.foregroundColor = fg;
    app.backgroundColor = bg;
    addColorLayer(d, 200, 200, 200, "Content");
    savePsd(d, "foreground_background_color"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 24. Mask with gradient (gradient mask)
try {
    var d = app.documents.add(200,200,72,"mask_gradient",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 255, 0, 0, "Masked");
    d.activeLayer = layer;
    // Add layer mask
    var maskDesc = new ActionDescriptor();
    maskDesc.putEnumerated(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    maskDesc.putEnumerated(charIDToTypeID("At  "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    maskDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlA"));
    executeAction(charIDToTypeID("Mk  "), maskDesc, DialogModes.NO);
    // Select mask channel and paint gradient
    // Select the mask
    var selMask = new ActionDescriptor();
    var selRef = new ActionReference();
    selRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    selMask.putReference(charIDToTypeID("null"), selRef);
    selMask.putBoolean(charIDToTypeID("MkVs"), false);
    executeAction(charIDToTypeID("slct"), selMask, DialogModes.NO);
    // Draw gradient on mask using gradient tool
    var gradDesc = new ActionDescriptor();
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Foreground to Background");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    var clrs = new ActionList();
    var c1 = new ActionDescriptor();
    var bk = new ActionDescriptor();
    bk.putDouble(charIDToTypeID("Rd  "), 255);
    bk.putDouble(charIDToTypeID("Grn "), 255);
    bk.putDouble(charIDToTypeID("Bl  "), 255);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), bk);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0);
    c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var wh = new ActionDescriptor();
    wh.putDouble(charIDToTypeID("Rd  "), 0);
    wh.putDouble(charIDToTypeID("Grn "), 0);
    wh.putDouble(charIDToTypeID("Bl  "), 0);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), wh);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096);
    c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c2);
    grad.putList(charIDToTypeID("Clrs"), clrs);
    var trns = new ActionList();
    var t1 = new ActionDescriptor();
    t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0);
    t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor();
    t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t2.putInteger(charIDToTypeID("Lctn"), 4096);
    t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t2);
    grad.putList(charIDToTypeID("Trns"), trns);
    gradDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    gradDesc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    var from = new ActionDescriptor();
    from.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), 0);
    from.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), 0);
    gradDesc.putObject(charIDToTypeID("From"), charIDToTypeID("Pnt "), from);
    var to = new ActionDescriptor();
    to.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), 200);
    to.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), 200);
    gradDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Pnt "), to);
    executeAction(charIDToTypeID("Grdn"), gradDesc, DialogModes.NO);
    savePsd(d, "mask_gradient"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 25. Vector mask - custom path (triangle)
try {
    var d = app.documents.add(200,200,72,"vector_mask_triangle",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 0, 200, 100, "Triangle");
    d.activeLayer = layer;
    // Create vector mask with triangle path
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("Path"));
    desc.putReference(charIDToTypeID("null"), ref);
    var pathDesc = new ActionDescriptor();
    var subPathList = new ActionList();
    var subPath = new ActionDescriptor();
    subPath.putBoolean(charIDToTypeID("Clsp"), true);
    var points = new ActionList();
    // Triangle: 3 anchor points
    var pts = [[100,20],[180,180],[20,180]];
    for(var i = 0; i < 3; i++) {
        var pt = new ActionDescriptor();
        var anc = new ActionDescriptor();
        anc.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), pts[i][0]);
        anc.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), pts[i][1]);
        pt.putObject(charIDToTypeID("Anch"), charIDToTypeID("Pnt "), anc);
        pt.putObject(charIDToTypeID("Fwd "), charIDToTypeID("Pnt "), anc);
        pt.putObject(charIDToTypeID("Bwd "), charIDToTypeID("Pnt "), anc);
        pt.putBoolean(charIDToTypeID("Smoo"), false);
        points.putObject(charIDToTypeID("Pthp"), pt);
    }
    subPath.putList(charIDToTypeID("Pts "), points);
    subPathList.putObject(charIDToTypeID("Sbpl"), subPath);
    pathDesc.putList(charIDToTypeID("SbpL"), subPathList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Path"), pathDesc);
    desc.putEnumerated(charIDToTypeID("At  "), charIDToTypeID("Path"), stringIDToTypeID("vectorMask"));
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "vector_mask_triangle"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

"gen_more done: " + ok + " ok, " + fail + " fail";
