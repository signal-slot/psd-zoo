// gen_desc4.jsx - Descriptor coverage part 4:
//   Area text (textShape bounds), exposure adjustment, inner shadow/glow contours,
//   bevel texture pattern, vector mask feather, smart object transform,
//   reflected gradient, gradient map with Lab stops, layer knockout,
//   Black & White with tint, stroke with pattern fill, global light angle,
//   shape with gradient fill, effect noise, layer style scale
//
// Focuses on descriptor types completely missing from all previous test files.
var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}
function newDoc(w, h) {
    return app.documents.add(w || 200, h || 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
}
function fillRect(doc, x, y, w, h, r, g, b, nm) {
    var ly = doc.artLayers.add(); ly.name = nm || "Rect"; doc.activeLayer = ly;
    doc.selection.select([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c); doc.selection.deselect(); return ly;
}
function cTID(s) { return charIDToTypeID(s); }
function sTID(s) { return stringIDToTypeID(s); }
function makeRGBC(r, g, b) {
    var c = new ActionDescriptor();
    c.putDouble(cTID("Rd  "), r); c.putDouble(cTID("Grn "), g); c.putDouble(cTID("Bl  "), b);
    return c;
}
function setLayerEffects(fxDesc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(cTID("Prpr"), cTID("Lefx"));
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    desc.putObject(cTID("T   "), cTID("Lefx"), fxDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
}
// Custom contour curve (S-curve)
function makeContourSCurve() {
    var shp = new ActionDescriptor();
    shp.putString(cTID("Nm  "), "S-Curve");
    var pts = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    p1.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 64); p2.putDouble(cTID("Vrtc"), 20);
    p2.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 128); p3.putDouble(cTID("Vrtc"), 128);
    p3.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p3);
    var p4 = new ActionDescriptor(); p4.putDouble(cTID("Hrzn"), 192); p4.putDouble(cTID("Vrtc"), 236);
    p4.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p4);
    var p5 = new ActionDescriptor(); p5.putDouble(cTID("Hrzn"), 255); p5.putDouble(cTID("Vrtc"), 255);
    p5.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p5);
    shp.putList(cTID("Crv "), pts);
    return shp;
}
// Gaussian contour
function makeContourGaussian() {
    var shp = new ActionDescriptor();
    shp.putString(cTID("Nm  "), "Gaussian");
    var pts = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    p1.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 64); p2.putDouble(cTID("Vrtc"), 192);
    p2.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 128); p3.putDouble(cTID("Vrtc"), 255);
    p3.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p3);
    var p4 = new ActionDescriptor(); p4.putDouble(cTID("Hrzn"), 192); p4.putDouble(cTID("Vrtc"), 192);
    p4.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p4);
    var p5 = new ActionDescriptor(); p5.putDouble(cTID("Hrzn"), 255); p5.putDouble(cTID("Vrtc"), 0);
    p5.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p5);
    shp.putList(cTID("Crv "), pts);
    return shp;
}

// ==========================================
// 1. text/area_text — Paragraph (area) text with bounds
//    Descriptor: textShape with base + bounds (Rctn: Top, Left, Btom, Rght)
//    ALL existing text layers are point text; this tests area text descriptor
// ==========================================
try {
    var doc = newDoc(400, 300);
    // Create area text using DOM
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Area Text";
    var txt = ly.textItem;
    txt.kind = TextType.PARAGRAPHTEXT;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(14, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 0; return c; })();
    txt.width = new UnitValue(300, "px");
    txt.height = new UnitValue(200, "px");
    txt.position = [new UnitValue(50, "px"), new UnitValue(50, "px")];
    txt.contents = "This is area text (paragraph text) which has a bounding box. The text wraps within the defined rectangle, unlike point text which extends in one direction. This exercises the textShape bounds descriptor with Rctn class containing Top, Left, Btom, Rght unit float values.";
    txt.justification = Justification.LEFTJUSTIFIED;
    savePsd(doc, "text/area_text");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("area_text: "+e); }

// ==========================================
// 2. text/area_text_justified — Area text with full justification
//    Descriptor: textShape bounds + justification = justifyAll
// ==========================================
try {
    var doc = newDoc(400, 300);
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Justified Area";
    var txt = ly.textItem;
    txt.kind = TextType.PARAGRAPHTEXT;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(12, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 30; c.rgb.green = 30; c.rgb.blue = 30; return c; })();
    txt.width = new UnitValue(350, "px");
    txt.height = new UnitValue(250, "px");
    txt.position = [new UnitValue(25, "px"), new UnitValue(25, "px")];
    txt.contents = "This text uses full justification, where all lines including the last are stretched to fill the width. This creates a different paragraph descriptor compared to left-aligned text, testing justifyAll enum value.";
    txt.justification = Justification.FULLYJUSTIFIED;
    savePsd(doc, "text/area_text_justified");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("area_text_justified: "+e); }

// ==========================================
// 3. adjustment/exposure — Exposure adjustment layer
//    Descriptor: exposureClass with Exps doub, Ofst doub, gmma doub
//    Completely missing from all previous test files.
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 128, 100, 80, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var exp = new ActionDescriptor();
    exp.putDouble(sTID("presetKind"), 1); // custom
    exp.putDouble(sTID("exposure"), 1.5);
    exp.putDouble(sTID("offset"), -0.02);
    exp.putDouble(sTID("gammaCorrection"), 1.2);
    adjDesc.putObject(cTID("Type"), sTID("exposureClass"), exp);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/exposure"); ok++;
})();}catch(e){fail++; $.writeln("exposure: "+e);}

// ==========================================
// 4. effect/inner_shadow_contour — Inner Shadow with custom contour curve
//    Descriptor: TrnS (ShpC class with CrPt list) inside IrSh
//    No existing file has a contour on inner shadow effect.
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 200, 200, 200, "IS Contour");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var is = new ActionDescriptor();
    is.putBoolean(cTID("enab"), true);
    is.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    is.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    is.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    is.putBoolean(cTID("uglg"), true);
    is.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    is.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 5);
    is.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    is.putUnitDouble(cTID("blur"), cTID("#Pxl"), 12);
    is.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    is.putBoolean(cTID("AntA"), true);
    // Custom contour
    is.putObject(cTID("TrnS"), cTID("ShpC"), makeContourSCurve());
    fx.putObject(cTID("IrSh"), cTID("IrSh"), is);
    setLayerEffects(fx);
    savePsd(doc, "effect/inner_shadow_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("inner_shadow_contour: "+e); }

// ==========================================
// 5. effect/outer_glow_contour — Outer Glow with custom contour curve
//    Descriptor: TrnS (ShpC class with CrPt list) inside OrGl
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 50, 50, 100, 100, 50, 50, 150, "OG Contour");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    og.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 50));
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 90);
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), true);
    // Gaussian contour
    og.putObject(cTID("TrnS"), cTID("ShpC"), makeContourGaussian());
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(doc, "effect/outer_glow_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("outer_glow_contour: "+e); }

// ==========================================
// 6. effect/inner_glow_contour — Inner Glow with custom contour
//    Descriptor: TrnS in IrGl
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 100, 100, 200, "IG Contour");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    ig.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 200));
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC"));
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    ig.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ig.putBoolean(cTID("AntA"), true);
    // S-curve contour
    ig.putObject(cTID("TrnS"), cTID("ShpC"), makeContourSCurve());
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);
    setLayerEffects(fx);
    savePsd(doc, "effect/inner_glow_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("inner_glow_contour: "+e); }

// ==========================================
// 7. bevel/texture_pattern — Bevel & Emboss with texture/pattern
//    Descriptor: ebbl with useTexture bool, Ptrn Objc, textureScale UntF,
//                textureDepth long, InvT bool
//    No existing file tests bevel texture pattern descriptor.
// ==========================================
try {
    // Define a noise pattern first
    var patDoc = app.documents.add(16, 16, 72, "noise_pat", NewDocumentMode.RGB, DocumentFill.WHITE);
    patDoc.flatten();
    // Create a simple noise-like pattern
    for (var py = 0; py < 16; py += 4) {
        for (var px = 0; px < 16; px += 4) {
            var v = ((px + py) * 37) % 256;
            patDoc.selection.select([[px,py],[px+4,py],[px+4,py+4],[px,py+4]]);
            var pc = new SolidColor(); pc.rgb.red = v; pc.rgb.green = v; pc.rgb.blue = v;
            patDoc.selection.fill(pc);
        }
    }
    patDoc.selection.deselect();
    patDoc.selection.selectAll();
    var defP = new ActionDescriptor();
    defP.putString(cTID("Nm  "), "Zoo Noise Texture");
    executeAction(cTID("DfnP"), defP, DialogModes.NO);
    patDoc.close(SaveOptions.DONOTSAVECHANGES);

    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 150, 150, 180, "Bevel Texture");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var bv = new ActionDescriptor();
    bv.putBoolean(cTID("enab"), true);
    bv.putEnumerated(cTID("bvlS"), cTID("BESl"), cTID("InrB")); // Inner Bevel
    bv.putEnumerated(cTID("bvlT"), cTID("bvlT"), cTID("SfBL")); // Smooth
    bv.putUnitDouble(cTID("srgR"), cTID("#Prc"), 100);
    bv.putUnitDouble(cTID("blur"), cTID("#Pxl"), 5);
    bv.putUnitDouble(cTID("Sftn"), cTID("#Pxl"), 0);
    bv.putEnumerated(cTID("bvlD"), cTID("BESs"), cTID("In  ")); // direction Up
    bv.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    bv.putUnitDouble(cTID("Lald"), cTID("#Ang"), 30);
    bv.putEnumerated(cTID("hglM"), cTID("BlnM"), cTID("Scrn"));
    bv.putObject(cTID("hglC"), cTID("RGBC"), makeRGBC(255, 255, 255));
    bv.putUnitDouble(cTID("hglO"), cTID("#Prc"), 75);
    bv.putEnumerated(cTID("sdwM"), cTID("BlnM"), cTID("Mltp"));
    bv.putObject(cTID("sdwC"), cTID("RGBC"), makeRGBC(0, 0, 0));
    bv.putUnitDouble(cTID("sdwO"), cTID("#Prc"), 75);
    // Texture sub-descriptor
    bv.putBoolean(sTID("useTexture"), true);
    bv.putBoolean(sTID("invertTexture"), false);
    bv.putBoolean(cTID("Algn"), true);
    bv.putUnitDouble(sTID("textureScale"), cTID("#Prc"), 150);
    bv.putInteger(sTID("textureDepth"), 80);
    // Pattern reference
    var texPat = new ActionDescriptor();
    texPat.putString(cTID("Nm  "), "Zoo Noise Texture");
    bv.putObject(cTID("Ptrn"), cTID("Ptrn"), texPat);
    fx.putObject(cTID("ebbl"), cTID("ebbl"), bv);
    setLayerEffects(fx);
    savePsd(doc, "bevel/texture_pattern");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("texture_pattern: "+e); }

// ==========================================
// 8. mask/vector_mask_feather — Vector mask with feather radius
//    Descriptor: vectorMaskFeather UntF #Pxl in vmsk block
//    No existing file tests vector mask feathering.
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 255, 100, 50, "Feathered VMask");
    // Create an ellipse vector mask
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(cTID("Path"));
    desc.putReference(cTID("null"), ref);
    var shape = new ActionDescriptor();
    var top = 50, left = 50, bottom = 250, right = 250;
    shape.putUnitDouble(cTID("Top "), cTID("#Pxl"), top);
    shape.putUnitDouble(cTID("Left"), cTID("#Pxl"), left);
    shape.putUnitDouble(cTID("Btom"), cTID("#Pxl"), bottom);
    shape.putUnitDouble(cTID("Rght"), cTID("#Pxl"), right);
    desc.putObject(cTID("T   "), cTID("Elps"), shape);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    // Convert to vector mask
    var vmDesc = new ActionDescriptor();
    var vmRef = new ActionReference();
    vmRef.putClass(cTID("Path"));
    vmDesc.putReference(cTID("null"), vmRef);
    var atRef = new ActionReference();
    atRef.putEnumerated(cTID("Path"), cTID("Path"), sTID("vectorMask"));
    vmDesc.putReference(cTID("At  "), atRef);
    var pathRef = new ActionReference();
    pathRef.putEnumerated(cTID("Path"), cTID("Ordn"), cTID("Trgt"));
    vmDesc.putReference(cTID("Usng"), pathRef);
    executeAction(cTID("Mk  "), vmDesc, DialogModes.NO);
    // Set vector mask feather
    var fDesc = new ActionDescriptor();
    var fRef = new ActionReference();
    fRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    fDesc.putReference(cTID("null"), fRef);
    var propDesc = new ActionDescriptor();
    propDesc.putUnitDouble(sTID("vectorMaskFeather"), cTID("#Pxl"), 15);
    fDesc.putObject(cTID("T   "), cTID("Lyr "), propDesc);
    executeAction(cTID("setd"), fDesc, DialogModes.NO);
    savePsd(d, "mask/vector_mask_feather"); ok++;
})();}catch(e){fail++; $.writeln("vector_mask_feather: "+e);}

// ==========================================
// 9. smart/transform — Smart object with perspective transform
//    Exercises nonAffineTransform descriptor (list of 8 doubles)
// ==========================================
try{(function(){
    // Create source
    var srcDoc = app.documents.add(100, 100, 72, "xform_src", NewDocumentMode.RGB, DocumentFill.WHITE);
    var ly = srcDoc.artLayers.add(); ly.name = "Source"; srcDoc.activeLayer = ly;
    srcDoc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 50; c.rgb.blue = 50;
    srcDoc.selection.fill(c); srcDoc.selection.deselect();
    // Draw diagonal line for visual reference
    srcDoc.selection.select([[0,0],[100,0],[100,10],[0,10]]);
    var c2 = new SolidColor(); c2.rgb.red = 255; c2.rgb.green = 255; c2.rgb.blue = 0;
    srcDoc.selection.fill(c2); srcDoc.selection.deselect();

    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 200, 200, 200, "Background");
    // Place embedded smart object
    var tmpPath = basePath + "smart/xform_temp.psd";
    var tmpFile = new File(tmpPath);
    var so = new PhotoshopSaveOptions(); so.alphaChannels = true; so.layers = true;
    srcDoc.saveAs(tmpFile, so, true);
    srcDoc.close(SaveOptions.DONOTSAVECHANGES);

    var placeDesc = new ActionDescriptor();
    placeDesc.putPath(cTID("null"), new File(tmpPath));
    placeDesc.putEnumerated(sTID("freeTransformCenterState"), sTID("quadCenterState"), sTID("QCSAverage"));
    executeAction(sTID("placeEvent"), placeDesc, DialogModes.NO);

    // Apply a perspective-like transform via free transform
    var tDesc = new ActionDescriptor();
    var tRef = new ActionReference();
    tRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    tDesc.putReference(cTID("null"), tRef);
    tDesc.putEnumerated(cTID("FTcs"), cTID("QCSt"), cTID("Qcs0"));
    // Offset to apply perspective
    var oDesc = new ActionDescriptor();
    oDesc.putUnitDouble(cTID("Hrzn"), cTID("#Pxl"), 0);
    oDesc.putUnitDouble(cTID("Vrtc"), cTID("#Pxl"), 0);
    tDesc.putObject(cTID("Ofst"), cTID("Ofst"), oDesc);
    tDesc.putUnitDouble(cTID("Wdth"), cTID("#Prc"), 120);
    tDesc.putUnitDouble(cTID("Hght"), cTID("#Prc"), 80);
    tDesc.putUnitDouble(cTID("Angl"), cTID("#Ang"), 15);
    executeAction(cTID("Trnf"), tDesc, DialogModes.NO);
    savePsd(d, "smart/transform"); ok++;
    try { tmpFile.remove(); } catch(e3) {}
})();}catch(e){fail++; $.writeln("transform: "+e);}

// ==========================================
// 10. fill/gradient_reflected — Reflected gradient type
//     Descriptor: GrdT = Rflc (not covered by existing gradient tests)
// ==========================================
try {
    var doc = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Rflc")); // Reflected!
    gradContent.putBoolean(cTID("Dthr"), true);
    gradContent.putBoolean(cTID("Rvrs"), false);
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Reflected Warm");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 100));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(100, 50, 0));
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 4096); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    grad.putList(cTID("Clrs"), clrs);
    var trns = new ActionList();
    var ts1 = new ActionDescriptor();
    ts1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts1.putInteger(cTID("Lctn"), 0); ts1.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts1);
    var ts2 = new ActionDescriptor();
    ts2.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts2.putInteger(cTID("Lctn"), 4096); ts2.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts2);
    grad.putList(cTID("Trns"), trns);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Reflected Gradient";
    savePsd(doc, "fill/gradient_reflected");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_reflected: "+e); }

// ==========================================
// 11. adjustment/gradient_map_lab — Gradient Map with Lab color stops
//     Descriptor: GdMp with Grad containing LbCl color objects
//     All existing gradient maps use RGBC stops only.
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 128, 128, 128, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var gm = new ActionDescriptor();
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Lab Map");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    // Stop 1: Lab dark
    var cs1 = new ActionDescriptor();
    var lab1 = new ActionDescriptor();
    lab1.putDouble(cTID("Lmnc"), 10); lab1.putDouble(cTID("A   "), 0); lab1.putDouble(cTID("B   "), 0);
    cs1.putObject(cTID("Clr "), cTID("LbCl"), lab1);
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    // Stop 2: Lab mid green-blue
    var cs2 = new ActionDescriptor();
    var lab2 = new ActionDescriptor();
    lab2.putDouble(cTID("Lmnc"), 60); lab2.putDouble(cTID("A   "), -40); lab2.putDouble(cTID("B   "), -20);
    cs2.putObject(cTID("Clr "), cTID("LbCl"), lab2);
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 2048); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    // Stop 3: Lab light warm
    var cs3 = new ActionDescriptor();
    var lab3 = new ActionDescriptor();
    lab3.putDouble(cTID("Lmnc"), 95); lab3.putDouble(cTID("A   "), 10); lab3.putDouble(cTID("B   "), 30);
    cs3.putObject(cTID("Clr "), cTID("LbCl"), lab3);
    cs3.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs3.putInteger(cTID("Lctn"), 4096); cs3.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs3);
    grad.putList(cTID("Clrs"), clrs);
    var trns = new ActionList();
    var ts1 = new ActionDescriptor();
    ts1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts1.putInteger(cTID("Lctn"), 0); ts1.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts1);
    var ts2 = new ActionDescriptor();
    ts2.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts2.putInteger(cTID("Lctn"), 4096); ts2.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts2);
    grad.putList(cTID("Trns"), trns);
    gm.putObject(cTID("Grad"), cTID("Grdn"), grad);
    adjDesc.putObject(cTID("Type"), cTID("GdMp"), gm);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/gradient_map_lab"); ok++;
})();}catch(e){fail++; $.writeln("gradient_map_lab: "+e);}

// ==========================================
// 12. layer/knockout_deep — Layer with deep knockout
//     Descriptor: Kock enum = Dp (Deep knockout reveals background)
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    // Background gradient
    fillRect(d, 0, 0, 300, 300, 100, 150, 200, "BG");
    // Group
    var g = d.layerSets.add(); g.name = "Knockout Group";
    // Content layer in group with knockout
    var ly = g.artLayers.add(); ly.name = "KO Layer"; d.activeLayer = ly;
    d.selection.select([[75,75],[225,75],[225,225],[75,225]]);
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    d.selection.fill(c); d.selection.deselect();
    // Set knockout to Deep via ActionManager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var propDesc = new ActionDescriptor();
    propDesc.putEnumerated(sTID("knockout"), sTID("knockout"), sTID("deep"));
    desc.putObject(cTID("T   "), cTID("Lyr "), propDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "layer/knockout_deep"); ok++;
})();}catch(e){fail++; $.writeln("knockout_deep: "+e);}

// ==========================================
// 13. layer/knockout_shallow — Layer with shallow knockout
//     Descriptor: Kock enum = Shlw
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 200, 200, 100, "BG");
    var g = d.layerSets.add(); g.name = "Outer Group";
    var g2 = g.layerSets.add(); g2.name = "Inner Group";
    var ly = g2.artLayers.add(); ly.name = "Shallow KO"; d.activeLayer = ly;
    d.selection.select([[50,50],[250,50],[250,250],[50,250]]);
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 200;
    d.selection.fill(c); d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var propDesc = new ActionDescriptor();
    propDesc.putEnumerated(sTID("knockout"), sTID("knockout"), sTID("shallow"));
    desc.putObject(cTID("T   "), cTID("Lyr "), propDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "layer/knockout_shallow"); ok++;
})();}catch(e){fail++; $.writeln("knockout_shallow: "+e);}

// ==========================================
// 14. adjustment/black_white_tint — Black & White with tinting enabled
//     Descriptor: BanW with useTint bool + tintColor HSBC descriptor
//     Tests HSBC color descriptor in adjustment context.
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 100, 200, 200, 80, 80, "Red");
    fillRect(d, 100, 0, 100, 200, 80, 200, 80, "Green");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var bw = new ActionDescriptor();
    bw.putInteger(sTID("reds"), 40);
    bw.putInteger(sTID("yellows"), 60);
    bw.putInteger(sTID("greens"), 40);
    bw.putInteger(sTID("cyans"), 60);
    bw.putInteger(sTID("blues"), 20);
    bw.putInteger(sTID("magentas"), 80);
    bw.putBoolean(sTID("useTint"), true);
    // Tint color in HSBC
    var tint = new ActionDescriptor();
    tint.putUnitDouble(cTID("H   "), cTID("#Ang"), 35); // sepia hue
    tint.putDouble(cTID("Strt"), 25); // low saturation
    tint.putDouble(cTID("Brgh"), 100);
    bw.putObject(sTID("tintColor"), cTID("HSBC"), tint);
    adjDesc.putObject(cTID("Type"), sTID("blackAndWhite"), bw);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/black_white_tint"); ok++;
})();}catch(e){fail++; $.writeln("black_white_tint: "+e);}

// ==========================================
// 15. effect/stroke_pattern — Stroke effect with pattern fill
//     Descriptor: FrFX with PtFl content (pattern as stroke fill)
//     Existing strokes use solid color or gradient; this tests pattern fill.
// ==========================================
try {
    // Define a dot pattern
    var patDoc = app.documents.add(8, 8, 72, "dot_pat", NewDocumentMode.RGB, DocumentFill.WHITE);
    patDoc.flatten();
    patDoc.selection.select([[2,2],[6,2],[6,6],[2,6]]);
    var dc = new SolidColor(); dc.rgb.red = 0; dc.rgb.green = 0; dc.rgb.blue = 0;
    patDoc.selection.fill(dc);
    patDoc.selection.deselect();
    patDoc.selection.selectAll();
    var defP = new ActionDescriptor();
    defP.putString(cTID("Nm  "), "Zoo Dots");
    executeAction(cTID("DfnP"), defP, DialogModes.NO);
    patDoc.close(SaveOptions.DONOTSAVECHANGES);

    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 180, 180, 100, "Pattern Stroke");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var fr = new ActionDescriptor();
    fr.putBoolean(cTID("enab"), true);
    fr.putEnumerated(cTID("Styl"), cTID("FStl"), cTID("OutF")); // Outside
    fr.putEnumerated(cTID("PntT"), cTID("FrFl"), cTID("Ptrn")); // Pattern fill!
    fr.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    fr.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    fr.putUnitDouble(cTID("Sz  "), cTID("#Pxl"), 6);
    // Pattern reference
    var patRef = new ActionDescriptor();
    patRef.putString(cTID("Nm  "), "Zoo Dots");
    fr.putObject(cTID("Ptrn"), cTID("Ptrn"), patRef);
    fr.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fr.putBoolean(cTID("Algn"), true);
    fx.putObject(cTID("FrFX"), cTID("FrFX"), fr);
    setLayerEffects(fx);
    savePsd(doc, "effect/stroke_pattern");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("stroke_pattern: "+e); }

// ==========================================
// 16. effect/all_effects_scaled — Layer effects with non-100% global scale
//     Descriptor: Lefx Scl UntF != 100 (affects rendering of all effects)
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 150, 100, 200, "Scaled FX");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 200); // 200% scale!
    // Drop shadow
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 5);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 5);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    // Outer glow
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    og.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 0));
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 50);
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(doc, "effect/all_effects_scaled");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("all_effects_scaled: "+e); }

// ==========================================
// 17. effect/drop_shadow_noise — Drop Shadow with high noise value
//     Descriptor: Nose UntF #Prc > 0 in DrSh
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 100, 200, 100, "Noisy Shadow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 135);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 5); // spread/choke > 0
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 50); // 50% noise!
    ds.putBoolean(cTID("AntA"), true);
    // Custom contour on drop shadow too
    ds.putObject(cTID("TrnS"), cTID("ShpC"), makeContourGaussian());
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(doc, "effect/drop_shadow_noise");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("drop_shadow_noise: "+e); }

// ==========================================
// 18. shape/gradient_fill — Shape layer with gradient content
//     Exercises shapeLayer with gradientLayer content type
// ==========================================
try{(function(){
    var d = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(cTID("Lyr "));
    desc.putReference(cTID("null"), ref);
    // Build shape with gradient fill
    var lyDesc = new ActionDescriptor();
    lyDesc.putEnumerated(cTID("Type"), sTID("shapeStyle"), sTID("solidColorShapeStyle"));
    // Use DOM for simpler shape creation then modify
    desc.putObject(cTID("Usng"), cTID("Lyr "), lyDesc);
    // Create via DOM: rectangle shape with gradient
    var lineColor = new SolidColor(); lineColor.rgb.red = 0; lineColor.rgb.green = 0; lineColor.rgb.blue = 0;
    // Actually create shape with ActionManager for gradient fill
    var mkDesc = new ActionDescriptor();
    var mkRef = new ActionReference();
    mkRef.putClass(sTID("contentLayer"));
    mkDesc.putReference(cTID("null"), mkRef);
    var shapeDesc = new ActionDescriptor();
    // Gradient fill content
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(cTID("Angl"), cTID("#Ang"), 45);
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Shape Grad");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 100, 200));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(200, 100, 0));
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 4096); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    grad.putList(cTID("Clrs"), clrs);
    var trns = new ActionList();
    var ts1 = new ActionDescriptor();
    ts1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts1.putInteger(cTID("Lctn"), 0); ts1.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts1);
    var ts2 = new ActionDescriptor();
    ts2.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts2.putInteger(cTID("Lctn"), 4096); ts2.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts2);
    grad.putList(cTID("Trns"), trns);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    shapeDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    mkDesc.putObject(cTID("Usng"), sTID("contentLayer"), shapeDesc);
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.activeLayer.name = "Gradient Shape";
    // Now draw a rectangle path on this layer
    var pathDesc = new ActionDescriptor();
    var pathRef = new ActionReference();
    pathRef.putProperty(cTID("Path"), sTID("vectorMask"));
    pathRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    pathDesc.putReference(cTID("null"), pathRef);
    var rect = new ActionDescriptor();
    rect.putUnitDouble(cTID("Top "), cTID("#Pxl"), 30);
    rect.putUnitDouble(cTID("Left"), cTID("#Pxl"), 30);
    rect.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 170);
    rect.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 170);
    pathDesc.putObject(cTID("T   "), cTID("Rctn"), rect);
    executeAction(cTID("setd"), pathDesc, DialogModes.NO);
    savePsd(d, "shape/gradient_fill"); ok++;
})();}catch(e){fail++; $.writeln("gradient_fill: "+e);}

// ==========================================
// 19. effect/global_angle — Layer effect with useGlobalAngle = false (local angle)
//     Exercises uglg bool = false in DrSh (overrides global light)
// ==========================================
try {
    var doc = newDoc(300, 200);
    fillRect(doc, 20, 20, 120, 160, 200, 100, 100, "Local Angle 1");
    var fx1 = new ActionDescriptor();
    fx1.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds1 = new ActionDescriptor();
    ds1.putBoolean(cTID("enab"), true);
    ds1.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    ds1.putBoolean(cTID("uglg"), false); // NOT using global angle
    ds1.putUnitDouble(cTID("lagl"), cTID("#Ang"), 45); // custom angle 45
    ds1.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 8);
    ds1.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds1.putUnitDouble(cTID("blur"), cTID("#Pxl"), 8);
    ds1.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds1.putBoolean(cTID("AntA"), false);
    fx1.putObject(cTID("DrSh"), cTID("DrSh"), ds1);
    setLayerEffects(fx1);
    // Second layer with different local angle
    fillRect(doc, 160, 20, 120, 160, 100, 100, 200, "Local Angle 2");
    var fx2 = new ActionDescriptor();
    fx2.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds2 = new ActionDescriptor();
    ds2.putBoolean(cTID("enab"), true);
    ds2.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds2.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    ds2.putBoolean(cTID("uglg"), false); // NOT using global angle
    ds2.putUnitDouble(cTID("lagl"), cTID("#Ang"), 225); // opposite angle
    ds2.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 8);
    ds2.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds2.putUnitDouble(cTID("blur"), cTID("#Pxl"), 8);
    ds2.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds2.putBoolean(cTID("AntA"), false);
    fx2.putObject(cTID("DrSh"), cTID("DrSh"), ds2);
    setLayerEffects(fx2);
    savePsd(doc, "effect/global_angle_override");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("global_angle: "+e); }

// ==========================================
// 20. text/paragraph_spacing — Area text with paragraph spacing
//     Tests spaceAfter/spaceBefore in text paragraph descriptor
// ==========================================
try {
    var doc = newDoc(400, 400);
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Paragraph Spacing";
    var txt = ly.textItem;
    txt.kind = TextType.PARAGRAPHTEXT;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(12, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 0; return c; })();
    txt.width = new UnitValue(350, "px");
    txt.height = new UnitValue(350, "px");
    txt.position = [new UnitValue(25, "px"), new UnitValue(25, "px")];
    txt.contents = "Paragraph one with default spacing.\r\rParagraph two should have space before it.\r\rParagraph three to test cumulative spacing.";
    txt.spaceAfter = new UnitValue(12, "pt");
    txt.spaceBefore = new UnitValue(6, "pt");
    txt.justification = Justification.LEFTJUSTIFIED;
    savePsd(doc, "text/paragraph_spacing");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("paragraph_spacing: "+e); }

"gen_desc4 done: " + ok + " ok, " + fail + " fail";
