// === Remaining adjustment layers + layer effects + misc ===
function savePsd(doc, path) {
    var f = new File(path);
    var o = new PhotoshopSaveOptions(); o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
function fillLayer(doc, name, r, g, b) {
    var layer = doc.artLayers.add(); layer.name = name; doc.activeLayer = layer;
    doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c); doc.selection.deselect();
    return layer;
}
function mkAdj(typeID) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var tDesc = new ActionDescriptor();
    adjDesc.putObject(charIDToTypeID("Type"), typeID, tDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}
var B = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";
var ok = 0, fail = 0;

// adjustment_exposure
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_exposure", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 128, 128, 128);
    mkAdj(stringIDToTypeID("exposure"));
    savePsd(d, B+"adjustment_exposure.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_vibrance
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_vibrance", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 200, 100, 50);
    mkAdj(stringIDToTypeID("vibrance"));
    savePsd(d, B+"adjustment_vibrance.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_black_white
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_black_white", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 200, 100, 50);
    mkAdj(stringIDToTypeID("blackAndWhite"));
    savePsd(d, B+"adjustment_black_white.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_channel_mixer
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_channel_mixer", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 150, 100, 200);
    mkAdj(charIDToTypeID("MxCh"));
    savePsd(d, B+"adjustment_channel_mixer.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_invert
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_invert", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 200, 100, 50);
    mkAdj(charIDToTypeID("Invr"));
    savePsd(d, B+"adjustment_invert.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_posterize
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_posterize", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 150, 180, 200);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var pDesc = new ActionDescriptor();
    pDesc.putInteger(charIDToTypeID("Lvls"), 4);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Pstr"), pDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, B+"adjustment_posterize.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_threshold
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_threshold", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 128, 128, 128);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var tDesc = new ActionDescriptor();
    tDesc.putInteger(charIDToTypeID("Lvl "), 128);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Thrs"), tDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, B+"adjustment_threshold.psd"); ok++;
})(); } catch(e) { fail++; }

// adjustment_selective_color
try { (function() {
    var d = app.documents.add(200, 200, 72, "adjustment_selective_color", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 200, 50, 50);
    mkAdj(stringIDToTypeID("selectiveColor"));
    savePsd(d, B+"adjustment_selective_color.psd"); ok++;
})(); } catch(e) { fail++; }

// === Layer effects (continued) ===

// effect_satin
try { (function() {
    var d = app.documents.add(300, 200, 72, "effect_satin", NewDocumentMode.RGB, DocumentFill.WHITE);
    var region = [[50,50],[250,50],[250,150],[50,150]];
    var layer = d.artLayers.add(); layer.name = "Satin Layer"; d.activeLayer = layer;
    doc.selection.select(region);
    var c = new SolidColor(); c.rgb.red=100; c.rgb.green=150; c.rgb.blue=200;
    d.selection.fill(c); d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var st = new ActionDescriptor();
    st.putBoolean(charIDToTypeID("enab"), true);
    st.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor(); clr.putDouble(charIDToTypeID("Rd  "), 0); clr.putDouble(charIDToTypeID("Grn "), 0); clr.putDouble(charIDToTypeID("Bl  "), 0);
    st.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    st.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    st.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 19);
    st.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 11);
    st.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 14);
    st.putBoolean(charIDToTypeID("AntA"), true);
    st.putBoolean(charIDToTypeID("Invr"), true);
    lfx.putObject(charIDToTypeID("ChFX"), charIDToTypeID("ChFX"), st);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, B+"effect_satin.psd"); ok++;
})(); } catch(e) { fail++; }

// effect_gradient_overlay
try { (function() {
    var d = app.documents.add(300, 200, 72, "effect_gradient_overlay", NewDocumentMode.RGB, DocumentFill.WHITE);
    var region = [[50,50],[250,50],[250,150],[50,150]];
    var layer = d.artLayers.add(); layer.name = "GradOverlay"; d.activeLayer = layer;
    d.selection.select(region);
    var c = new SolidColor(); c.rgb.red=128; c.rgb.green=128; c.rgb.blue=128;
    d.selection.fill(c); d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(charIDToTypeID("enab"), true);
    go.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    go.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    go.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    go.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    go.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    go.putBoolean(charIDToTypeID("Rvrs"), false);
    go.putBoolean(charIDToTypeID("Algn"), true);
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 255); c1.putDouble(charIDToTypeID("Grn "), 0); c1.putDouble(charIDToTypeID("Bl  "), 0);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 0); c2.putDouble(charIDToTypeID("Grn "), 0); c2.putDouble(charIDToTypeID("Bl  "), 255);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
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
    go.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    lfx.putObject(charIDToTypeID("GrFl"), charIDToTypeID("GrFl"), go);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, B+"effect_gradient_overlay.psd"); ok++;
})(); } catch(e) { fail++; }

// effect_multiple_effects (drop shadow + stroke + color overlay combined)
try { (function() {
    var d = app.documents.add(300, 200, 72, "effect_multiple_effects", NewDocumentMode.RGB, DocumentFill.WHITE);
    var region = [[50,50],[250,50],[250,150],[50,150]];
    var layer = d.artLayers.add(); layer.name = "MultiEffect"; d.activeLayer = layer;
    d.selection.select(region);
    var c = new SolidColor(); c.rgb.red=100; c.rgb.green=100; c.rgb.blue=200;
    d.selection.fill(c); d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Drop Shadow
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
    // Stroke
    var fr = new ActionDescriptor();
    fr.putBoolean(charIDToTypeID("enab"), true);
    fr.putEnumerated(stringIDToTypeID("style"), stringIDToTypeID("frameStyle"), stringIDToTypeID("outsetFrame"));
    fr.putEnumerated(stringIDToTypeID("paintType"), stringIDToTypeID("frameFill"), stringIDToTypeID("solidColor"));
    fr.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    fr.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    fr.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 2);
    var frClr = new ActionDescriptor(); frClr.putDouble(charIDToTypeID("Rd  "),255); frClr.putDouble(charIDToTypeID("Grn "),255); frClr.putDouble(charIDToTypeID("Bl  "),0);
    fr.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), frClr);
    lfx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), fr);
    // Color Overlay
    var sofi = new ActionDescriptor();
    sofi.putBoolean(charIDToTypeID("enab"), true);
    sofi.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    sofi.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    var sofiClr = new ActionDescriptor(); sofiClr.putDouble(charIDToTypeID("Rd  "),255); sofiClr.putDouble(charIDToTypeID("Grn "),128); sofiClr.putDouble(charIDToTypeID("Bl  "),0);
    sofi.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), sofiClr);
    lfx.putObject(charIDToTypeID("SoFi"), charIDToTypeID("SoFi"), sofi);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, B+"effect_multiple_effects.psd"); ok++;
})(); } catch(e) { fail++; }

// === Misc features ===

// fill_opacity (different from layer opacity)
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_opacity", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(d, "Fill 50%", 255, 0, 0);
    layer.fillOpacity = 50;
    layer.opacity = 100;
    savePsd(d, B+"fill_opacity.psd"); ok++;
})(); } catch(e) { fail++; }

// layer_color_tag
try { (function() {
    var d = app.documents.add(200, 200, 72, "layer_color_tag", NewDocumentMode.RGB, DocumentFill.WHITE);
    var l1 = fillLayer(d, "Red Tag", 255, 200, 200);
    var l2 = fillLayer(d, "Blue Tag", 200, 200, 255);
    // Set color tag via Action Manager
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putName(charIDToTypeID("Lyr "), "Red Tag");
    desc1.putReference(charIDToTypeID("null"), ref1);
    var ldesc1 = new ActionDescriptor();
    ldesc1.putEnumerated(stringIDToTypeID("color"), stringIDToTypeID("color"), stringIDToTypeID("red"));
    desc1.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), ldesc1);
    executeAction(charIDToTypeID("setd"), desc1, DialogModes.NO);
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference(); ref2.putName(charIDToTypeID("Lyr "), "Blue Tag");
    desc2.putReference(charIDToTypeID("null"), ref2);
    var ldesc2 = new ActionDescriptor();
    ldesc2.putEnumerated(stringIDToTypeID("color"), stringIDToTypeID("color"), stringIDToTypeID("blue"));
    desc2.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), ldesc2);
    executeAction(charIDToTypeID("setd"), desc2, DialogModes.NO);
    savePsd(d, B+"layer_color_tag.psd"); ok++;
})(); } catch(e) { fail++; }

// alpha_channel
try { (function() {
    var d = app.documents.add(200, 200, 72, "alpha_channel", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 255, 0, 0);
    // Add alpha channel
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region);
    d.channels.add();
    d.activeChannels = [d.channels[3]];
    var white = new SolidColor(); white.rgb.red=255; white.rgb.green=255; white.rgb.blue=255;
    d.selection.fill(white);
    d.selection.deselect();
    d.activeChannels = [d.channels[0], d.channels[1], d.channels[2]];
    savePsd(d, B+"alpha_channel.psd"); ok++;
})(); } catch(e) { fail++; }

// smart_object_embedded
try { (function() {
    var d = app.documents.add(200, 200, 72, "smart_object_embedded", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(d, "To Convert", 0, 128, 255);
    // Convert to smart object
    var desc = new ActionDescriptor();
    executeAction(stringIDToTypeID("newPlacedLayer"), desc, DialogModes.NO);
    savePsd(d, B+"smart_object_embedded.psd"); ok++;
})(); } catch(e) { fail++; }

// shape_polygon (triangle via pen path)
try { (function() {
    var d = app.documents.add(200, 200, 72, "shape_polygon", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 255); colorDesc.putDouble(charIDToTypeID("Grn "), 200); colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    // Polygon: 6 sides
    var polyDesc = new ActionDescriptor();
    polyDesc.putUnitDouble(stringIDToTypeID("x"), charIDToTypeID("#Pxl"), 100);
    polyDesc.putUnitDouble(stringIDToTypeID("y"), charIDToTypeID("#Pxl"), 100);
    polyDesc.putUnitDouble(stringIDToTypeID("radius"), charIDToTypeID("#Pxl"), 80);
    polyDesc.putInteger(stringIDToTypeID("sides"), 6);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("polygon"), polyDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Hexagon";
    savePsd(d, B+"shape_polygon.psd"); ok++;
})(); } catch(e) { fail++; }

// shape_line
try { (function() {
    var d = app.documents.add(200, 200, 72, "shape_line", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), 0); colorDesc.putDouble(charIDToTypeID("Grn "), 0); colorDesc.putDouble(charIDToTypeID("Bl  "), 0);
    var solidDesc = new ActionDescriptor();
    solidDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), solidDesc);
    var lineDesc = new ActionDescriptor();
    lineDesc.putUnitDouble(stringIDToTypeID("x1"), charIDToTypeID("#Pxl"), 20);
    lineDesc.putUnitDouble(stringIDToTypeID("y1"), charIDToTypeID("#Pxl"), 180);
    lineDesc.putUnitDouble(stringIDToTypeID("x2"), charIDToTypeID("#Pxl"), 180);
    lineDesc.putUnitDouble(stringIDToTypeID("y2"), charIDToTypeID("#Pxl"), 20);
    lineDesc.putUnitDouble(stringIDToTypeID("width"), charIDToTypeID("#Pxl"), 3);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("line"), lineDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Line Shape";
    savePsd(d, B+"shape_line.psd"); ok++;
})(); } catch(e) { fail++; }

// layer_comp
try { (function() {
    var d = app.documents.add(200, 200, 72, "layer_comp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var l1 = fillLayer(d, "State A", 255, 0, 0);
    var l2 = fillLayer(d, "State B", 0, 0, 255);
    l2.visible = false;
    d.layerComps.add("Comp A", "Red visible", true, true, true);
    l1.visible = false; l2.visible = true;
    d.layerComps.add("Comp B", "Blue visible", true, true, true);
    savePsd(d, B+"layer_comp.psd"); ok++;
})(); } catch(e) { fail++; }

// guides
try { (function() {
    var d = app.documents.add(200, 200, 72, "guides", NewDocumentMode.RGB, DocumentFill.WHITE);
    d.guides.add(Direction.VERTICAL, new UnitValue(100, "px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(100, "px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(50, "px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(150, "px"));
    savePsd(d, B+"guides.psd"); ok++;
})(); } catch(e) { fail++; }

// vector_mask_subtract (two shapes with path operation)
try { (function() {
    var d = app.documents.add(200, 200, 72, "vector_mask_combined", NewDocumentMode.RGB, DocumentFill.WHITE);
    // First shape
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(stringIDToTypeID("contentLayer"));
    desc1.putReference(charIDToTypeID("null"), ref1);
    var sd1 = new ActionDescriptor();
    var cd1 = new ActionDescriptor(); cd1.putDouble(charIDToTypeID("Rd  "), 255); cd1.putDouble(charIDToTypeID("Grn "), 0); cd1.putDouble(charIDToTypeID("Bl  "), 0);
    var sol1 = new ActionDescriptor(); sol1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cd1);
    sd1.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol1);
    var r1 = new ActionDescriptor();
    r1.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 20);
    r1.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 20);
    r1.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 180);
    r1.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 180);
    sd1.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), r1);
    desc1.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd1);
    executeAction(charIDToTypeID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Combined Paths";
    savePsd(d, B+"vector_mask_combined.psd"); ok++;
})(); } catch(e) { fail++; }

// layer_locked_position
try { (function() {
    var d = app.documents.add(200, 200, 72, "layer_locked_position", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(d, "Position Locked", 200, 100, 50);
    layer.positionLocked = true;
    savePsd(d, B+"layer_locked_position.psd"); ok++;
})(); } catch(e) { fail++; }

// layer_locked_pixels
try { (function() {
    var d = app.documents.add(200, 200, 72, "layer_locked_pixels", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = fillLayer(d, "Pixels Locked", 50, 100, 200);
    layer.pixelsLocked = true;
    savePsd(d, B+"layer_locked_pixels.psd"); ok++;
})(); } catch(e) { fail++; }

// blend_if (blend ranges)
try { (function() {
    var d = app.documents.add(200, 200, 72, "blend_if", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Dark Base", 50, 50, 50);
    var layer = fillLayer(d, "Blend If Layer", 200, 200, 200);
    // Set blend if via Action Manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var ldesc = new ActionDescriptor();
    // Blend if this layer: black point at 50
    var blendRange = new ActionDescriptor();
    // This layer
    var thisList = new ActionList();
    thisList.putInteger(0); thisList.putInteger(50); thisList.putInteger(200); thisList.putInteger(255);
    blendRange.putList(charIDToTypeID("Wht "), thisList);
    ldesc.putObject(stringIDToTypeID("blendRange"), stringIDToTypeID("blendRange"), blendRange);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), ldesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, B+"blend_if.psd"); ok++;
})(); } catch(e) { fail++; }

// group_blend_mode_normal (group with non-passthrough blend)
try { (function() {
    var d = app.documents.add(200, 200, 72, "group_blend_normal", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillLayer(d, "Base", 128, 128, 128);
    var group = d.layerSets.add(); group.name = "Normal Group";
    group.blendMode = BlendMode.NORMAL;
    var child = group.artLayers.add(); child.name = "Child"; d.activeLayer = child;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c); d.selection.deselect();
    savePsd(d, B+"group_blend_normal.psd"); ok++;
})(); } catch(e) { fail++; }

// multiple_masks (both layer mask + vector mask on same layer)
try { (function() {
    var d = app.documents.add(200, 200, 72, "multiple_masks", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Create shape layer (has vector mask)
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "), 255); cd.putDouble(charIDToTypeID("Grn "), 0); cd.putDouble(charIDToTypeID("Bl  "), 0);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 20);
    r.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 20);
    r.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 180);
    r.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 180);
    sd.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Dual Mask";
    // Add layer mask too
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region);
    var mkDesc = new ActionDescriptor();
    mkDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mkRef = new ActionReference(); mkRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mkDesc.putReference(charIDToTypeID("At  "), mkRef);
    mkDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    savePsd(d, B+"multiple_masks.psd"); ok++;
})(); } catch(e) { fail++; }

alert("Adj+Effects+Misc: ok=" + ok + " fail=" + fail);
