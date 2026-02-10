// === Smart filters, transforms, artboards, ICC, spots, etc. ===
function savePsd(doc, path) {
    var f = new File(path);
    var o = new PhotoshopSaveOptions(); o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
function fillLayer(doc, name, r, g, b, region) {
    var layer = doc.artLayers.add(); layer.name = name; doc.activeLayer = layer;
    if (region) doc.selection.select(region); else doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=r; c.rgb.green=g; c.rgb.blue=b;
    doc.selection.fill(c); doc.selection.deselect();
    return layer;
}
function makeTextLayer(doc, name, text, x, y, size, r, g, b) {
    var l = doc.artLayers.add(); l.kind = LayerKind.TEXT; l.name = name;
    var ti = l.textItem; ti.contents = text; ti.font = "Roboto-Regular";
    ti.size = new UnitValue(size,"pt");
    ti.position = [new UnitValue(x,"px"), new UnitValue(y,"px")];
    var c = new SolidColor(); c.rgb.red=r; c.rgb.green=g; c.rgb.blue=b; ti.color = c;
    return l;
}
var B = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";
var ok=0, fail=0;

// --- smart_filter_blur ---
try { (function() {
    var d = app.documents.add(200,200,72,"smart_filter_blur",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "SmartLayer", 255, 0, 0);
    // Convert to smart object
    executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    // Apply Gaussian Blur
    var gbd = new ActionDescriptor();
    gbd.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 5.0);
    executeAction(charIDToTypeID("GsnB"), gbd, DialogModes.NO);
    savePsd(d, B+"smart_filter_blur.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_rotated ---
try { (function() {
    var d = app.documents.add(300,300,72,"layer_rotated",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[75,75],[225,75],[225,225],[75,225]];
    var layer = fillLayer(d, "Rotated", 0, 128, 255, region);
    // Rotate 45 degrees
    layer.rotate(45, AnchorPosition.MIDDLECENTER);
    savePsd(d, B+"layer_rotated.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_scaled ---
try { (function() {
    var d = app.documents.add(300,300,72,"layer_scaled",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[50,50],[250,50],[250,250],[50,250]];
    var layer = fillLayer(d, "Scaled", 255, 128, 0, region);
    layer.resize(50, 50, AnchorPosition.MIDDLECENTER);
    savePsd(d, B+"layer_scaled.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_moved ---
try { (function() {
    var d = app.documents.add(300,300,72,"layer_moved",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[0,0],[100,0],[100,100],[0,100]];
    var layer = fillLayer(d, "Moved", 0, 200, 0, region);
    layer.translate(new UnitValue(100,"px"), new UnitValue(150,"px"));
    savePsd(d, B+"layer_moved.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_flipped_horizontal ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_flipped_horizontal",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[20,20],[100,20],[100,180],[20,180]];
    var layer = fillLayer(d, "Flipped H", 200, 0, 100, region);
    layer.resize(-100, 100, AnchorPosition.MIDDLECENTER);
    savePsd(d, B+"layer_flipped_horizontal.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_flipped_vertical ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_flipped_vertical",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[20,20],[180,20],[180,100],[20,100]];
    var layer = fillLayer(d, "Flipped V", 100, 0, 200, region);
    layer.resize(100, -100, AnchorPosition.MIDDLECENTER);
    savePsd(d, B+"layer_flipped_vertical.psd"); ok++;
})(); } catch(e) { fail++; }

// --- icc_srgb ---
try { (function() {
    var d = app.documents.add(200,200,72,"icc_srgb",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "sRGB", 128, 64, 200);
    d.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, true);
    savePsd(d, B+"icc_srgb.psd"); ok++;
})(); } catch(e) { fail++; }

// --- icc_adobe_rgb ---
try { (function() {
    var d = app.documents.add(200,200,72,"icc_adobe_rgb",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "AdobeRGB", 200, 128, 64);
    d.convertProfile("Adobe RGB (1998)", Intent.RELATIVECOLORIMETRIC, true, true);
    savePsd(d, B+"icc_adobe_rgb.psd"); ok++;
})(); } catch(e) { fail++; }

// --- spot_color_channel ---
try { (function() {
    var d = app.documents.add(200,200,72,"spot_color_channel",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "Base", 255, 255, 255);
    // Add spot color channel
    var sc = new SolidColor(); sc.rgb.red=255; sc.rgb.green=0; sc.rgb.blue=0;
    var ch = d.channels.add(); ch.name = "Spot Red"; ch.kind = ChannelType.SPOTCOLOR; ch.color = sc;
    // Fill part of spot channel
    d.activeChannels = [ch];
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region);
    var white = new SolidColor(); white.rgb.red=0; white.rgb.green=0; white.rgb.blue=0;
    d.selection.fill(white);
    d.selection.deselect();
    d.activeChannels = [d.channels[0], d.channels[1], d.channels[2]];
    savePsd(d, B+"spot_color_channel.psd"); ok++;
})(); } catch(e) { fail++; }

// --- artboard ---
try { (function() {
    var d = app.documents.add(400,400,72,"artboard",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Create artboard via action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("artboardSection"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lDesc = new ActionDescriptor();
    lDesc.putString(charIDToTypeID("Nm  "), "Artboard 1");
    var bounds = new ActionDescriptor();
    bounds.putDouble(charIDToTypeID("Top "), 0);
    bounds.putDouble(charIDToTypeID("Left"), 0);
    bounds.putDouble(charIDToTypeID("Btom"), 200);
    bounds.putDouble(charIDToTypeID("Rght"), 200);
    lDesc.putObject(stringIDToTypeID("artboardRect"), stringIDToTypeID("classFloatRect"), bounds);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("artboardSection"), lDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, B+"artboard.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_style_copy (effect scale != 100%) ---
try { (function() {
    var d = app.documents.add(300,200,72,"effect_scaled",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[50,50],[250,50],[250,150],[50,150]];
    var layer = fillLayer(d, "ScaledFX", 100, 150, 200, region);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 200);
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var dsClr = new ActionDescriptor(); dsClr.putDouble(charIDToTypeID("Rd  "),0); dsClr.putDouble(charIDToTypeID("Grn "),0); dsClr.putDouble(charIDToTypeID("Bl  "),0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), dsClr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putBoolean(charIDToTypeID("uglg"), true);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    lfx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, B+"effect_scaled.psd"); ok++;
})(); } catch(e) { fail++; }

// --- knockout_shallow ---
try { (function() {
    var d = app.documents.add(200,200,72,"knockout_shallow",NewDocumentMode.RGB,DocumentFill.WHITE);
    var group = d.layerSets.add(); group.name = "KO Group";
    fillLayer(d, "BGColor", 0, 128, 0);
    var child1 = group.artLayers.add(); child1.name = "Bottom"; d.activeLayer = child1;
    d.selection.selectAll(); var c1 = new SolidColor(); c1.rgb.red=0; c1.rgb.green=0; c1.rgb.blue=255;
    d.selection.fill(c1); d.selection.deselect();
    var child2 = group.artLayers.add(); child2.name = "KO Layer"; d.activeLayer = child2;
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region); var c2 = new SolidColor(); c2.rgb.red=255; c2.rgb.green=0; c2.rgb.blue=0;
    d.selection.fill(c2); d.selection.deselect();
    child2.knockoutType = LayerKnockout.SHALLOW;
    savePsd(d, B+"knockout_shallow.psd"); ok++;
})(); } catch(e) { fail++; }

// --- knockout_deep ---
try { (function() {
    var d = app.documents.add(200,200,72,"knockout_deep",NewDocumentMode.RGB,DocumentFill.WHITE);
    var group = d.layerSets.add(); group.name = "KO Group";
    fillLayer(d, "BGColor", 0, 128, 0);
    var child1 = group.artLayers.add(); child1.name = "Bottom"; d.activeLayer = child1;
    d.selection.selectAll(); var c1 = new SolidColor(); c1.rgb.red=0; c1.rgb.green=0; c1.rgb.blue=255;
    d.selection.fill(c1); d.selection.deselect();
    var child2 = group.artLayers.add(); child2.name = "KO Layer"; d.activeLayer = child2;
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region); var c2 = new SolidColor(); c2.rgb.red=255; c2.rgb.green=0; c2.rgb.blue=0;
    d.selection.fill(c2); d.selection.deselect();
    child2.knockoutType = LayerKnockout.DEEP;
    savePsd(d, B+"knockout_deep.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_group_closed ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_group_closed",NewDocumentMode.RGB,DocumentFill.WHITE);
    var group = d.layerSets.add(); group.name = "Closed Group";
    var child = group.artLayers.add(); child.name = "Child"; d.activeLayer = child;
    d.selection.selectAll(); var c = new SolidColor(); c.rgb.red=255; c.rgb.green=128; c.rgb.blue=0;
    d.selection.fill(c); d.selection.deselect();
    // Close group via collapsed state - not directly available, save as-is
    savePsd(d, B+"layer_group_closed.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_blend_mode_passthrough_vs_normal (group comparison) ---
// Already covered

// --- raster_layer_with_transparency ---
try { (function() {
    var d = app.documents.add(200,200,72,"raster_transparency",NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    var layer = d.artLayers.add(); layer.name = "Partial"; d.activeLayer = layer;
    var region = [[25,25],[175,25],[175,175],[25,175]];
    d.selection.select(region);
    var c = new SolidColor(); c.rgb.red=128; c.rgb.green=0; c.rgb.blue=255;
    d.selection.fill(c); d.selection.deselect();
    // Remove background layer if exists
    try { d.backgroundLayer.remove(); } catch(e2) {}
    savePsd(d, B+"raster_transparency.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_negative_bounds (layer extending beyond canvas) ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_negative_bounds",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add(); layer.name = "Oversized"; d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=128;
    d.selection.fill(c); d.selection.deselect();
    // Move layer so it extends beyond canvas
    layer.translate(new UnitValue(-50,"px"), new UnitValue(-50,"px"));
    // Resize to be larger than canvas
    d.resizeCanvas(new UnitValue(200,"px"), new UnitValue(200,"px"), AnchorPosition.MIDDLECENTER);
    savePsd(d, B+"layer_negative_bounds.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_empty ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_empty",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add(); layer.name = "Empty Layer";
    // Don't draw anything on it
    savePsd(d, B+"layer_empty.psd"); ok++;
})(); } catch(e) { fail++; }

// --- resolution_150dpi ---
try { (function() {
    var d = app.documents.add(200,200,150,"resolution_150dpi",NewDocumentMode.RGB,DocumentFill.WHITE);
    makeTextLayer(d, "150 DPI", "150 DPI", 30, 100, 24, 0, 0, 0);
    savePsd(d, B+"resolution_150dpi.psd"); ok++;
})(); } catch(e) { fail++; }

// --- resolution_600dpi ---
try { (function() {
    var d = app.documents.add(200,200,600,"resolution_600dpi",NewDocumentMode.RGB,DocumentFill.WHITE);
    makeTextLayer(d, "600 DPI", "600 DPI", 30, 100, 24, 0, 0, 0);
    savePsd(d, B+"resolution_600dpi.psd"); ok++;
})(); } catch(e) { fail++; }

// --- gradient_fill_layer_with_dither ---
try { (function() {
    var d = app.documents.add(200,200,72,"fill_gradient_dither",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("linear"));
    gDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    gDesc.putBoolean(charIDToTypeID("Dthr"), true); // Dither
    gDesc.putBoolean(charIDToTypeID("Rvrs"), true); // Reverse
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Dithered");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1d = new ActionDescriptor(); c1d.putDouble(charIDToTypeID("Rd  "), 0); c1d.putDouble(charIDToTypeID("Grn "), 0); c1d.putDouble(charIDToTypeID("Bl  "), 128);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1d);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2d = new ActionDescriptor(); c2d.putDouble(charIDToTypeID("Rd  "), 128); c2d.putDouble(charIDToTypeID("Grn "), 0); c2d.putDouble(charIDToTypeID("Bl  "), 0);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2d);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Dithered Gradient";
    savePsd(d, B+"fill_gradient_dither.psd"); ok++;
})(); } catch(e) { fail++; }

// --- linked_layers ---
try { (function() {
    var d = app.documents.add(200,200,72,"linked_layers",NewDocumentMode.RGB,DocumentFill.WHITE);
    var l1 = fillLayer(d, "Linked A", 255, 0, 0, [[0,0],[100,0],[100,200],[0,200]]);
    var l2 = fillLayer(d, "Linked B", 0, 0, 255, [[100,0],[200,0],[200,200],[100,200]]);
    l1.link(l2);
    savePsd(d, B+"linked_layers.psd"); ok++;
})(); } catch(e) { fail++; }

// --- background_layer ---
try { (function() {
    var d = app.documents.add(200,200,72,"background_layer",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Background is created by default, just add a regular layer on top
    var l = fillLayer(d, "Regular", 255, 0, 0, [[50,50],[150,50],[150,150],[50,150]]);
    savePsd(d, B+"background_layer.psd"); ok++;
})(); } catch(e) { fail++; }

// --- no_background (converted from background) ---
try { (function() {
    var d = app.documents.add(200,200,72,"no_background",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Convert background to regular layer
    d.activeLayer = d.backgroundLayer;
    d.activeLayer.isBackgroundLayer = false;
    d.activeLayer.name = "Layer 0";
    savePsd(d, B+"no_background.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_mask_disabled ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_mask_disabled",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "Masked Disabled", 255, 0, 0);
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region);
    var mkDesc = new ActionDescriptor();
    mkDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mkRef = new ActionReference(); mkRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mkDesc.putReference(charIDToTypeID("At  "), mkRef);
    mkDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Disable the mask
    var disDesc = new ActionDescriptor();
    var disRef = new ActionReference();
    disRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    disDesc.putReference(charIDToTypeID("null"), disRef);
    var setDesc = new ActionDescriptor();
    setDesc.putBoolean(charIDToTypeID("UsrM"), false);
    disDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), setDesc);
    executeAction(charIDToTypeID("setd"), disDesc, DialogModes.NO);
    savePsd(d, B+"layer_mask_disabled.psd"); ok++;
})(); } catch(e) { fail++; }

// --- vector_mask_disabled ---
try { (function() {
    var d = app.documents.add(200,200,72,"vector_mask_disabled",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "), 0); cd.putDouble(charIDToTypeID("Grn "), 200); cd.putDouble(charIDToTypeID("Bl  "), 0);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    r.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    r.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    r.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    sd.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Disabled VMask";
    // Disable vector mask
    var disDesc = new ActionDescriptor();
    var disRef = new ActionReference();
    disRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    disDesc.putReference(charIDToTypeID("null"), disRef);
    var setDesc = new ActionDescriptor();
    setDesc.putBoolean(stringIDToTypeID("vectorMaskEnabled"), false);
    disDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), setDesc);
    executeAction(charIDToTypeID("setd"), disDesc, DialogModes.NO);
    savePsd(d, B+"vector_mask_disabled.psd"); ok++;
})(); } catch(e) { fail++; }

// --- layer_mask_inverted ---
try { (function() {
    var d = app.documents.add(200,200,72,"layer_mask_inverted",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "MaskInverted", 0, 128, 255);
    // Add mask that hides all (reveal none = inverted)
    var mkDesc = new ActionDescriptor();
    mkDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mkRef = new ActionReference(); mkRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mkDesc.putReference(charIDToTypeID("At  "), mkRef);
    mkDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("HdAl"));
    executeAction(charIDToTypeID("Mk  "), mkDesc, DialogModes.NO);
    savePsd(d, B+"layer_mask_inverted.psd"); ok++;
})(); } catch(e) { fail++; }

// --- text_color_multiple (different colors in single text) ---
// Hard to do without full Action Manager text manipulation, skip for now

// --- group_opacity ---
try { (function() {
    var d = app.documents.add(200,200,72,"group_opacity",NewDocumentMode.RGB,DocumentFill.WHITE);
    var group = d.layerSets.add(); group.name = "Opacity Group"; group.opacity = 50;
    var child = group.artLayers.add(); child.name = "Child"; d.activeLayer = child;
    d.selection.selectAll(); var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c); d.selection.deselect();
    savePsd(d, B+"group_opacity.psd"); ok++;
})(); } catch(e) { fail++; }

// --- many_groups (5 sibling groups) ---
try { (function() {
    var d = app.documents.add(300,200,72,"many_groups",NewDocumentMode.RGB,DocumentFill.WHITE);
    var colors = [[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255]];
    for (var i = 0; i < 5; i++) {
        var g = d.layerSets.add(); g.name = "Group " + (i+1);
        var child = g.artLayers.add(); child.name = "Layer " + (i+1); d.activeLayer = child;
        var region = [[i*60, 0], [(i+1)*60, 0], [(i+1)*60, 200], [i*60, 200]];
        d.selection.select(region);
        var c = new SolidColor(); c.rgb.red=colors[i][0]; c.rgb.green=colors[i][1]; c.rgb.blue=colors[i][2];
        d.selection.fill(c); d.selection.deselect();
    }
    savePsd(d, B+"many_groups.psd"); ok++;
})(); } catch(e) { fail++; }

alert("Extra1: ok=" + ok + " fail=" + fail);
