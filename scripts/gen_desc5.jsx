// gen_desc5.jsx - Descriptor coverage part 5:
//   Multiple effect instances (VlLs of DrSh/IrSh), group blend modes
//   (pass-through vs normal), advanced blending options (blendInterior,
//   blendClipped, layerFXVisible), channel restrictions on effects,
//   text auto kerning/hyphenation, gradient transparency stops,
//   gradient with offset, shape with pattern fill, minimal adjustments
//
// Focuses on descriptor LIST structures and advanced layer properties.
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
function setLayerProp(propDesc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    desc.putObject(cTID("T   "), cTID("Lyr "), propDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
}

// ==========================================
// 1. effect/multi_drop_shadow — Multiple drop shadows on single layer
//    Descriptor: dropShadowMulti VlLs containing multiple DrSh objects
//    CS6+ feature; exercises VlLs (value list) of effect descriptors.
//    NO existing file tests multiple instances of the same effect.
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 100, 100, 200, "Multi DS");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    // First drop shadow
    var ds1 = new ActionDescriptor();
    ds1.putBoolean(cTID("enab"), true);
    ds1.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 50);
    ds1.putBoolean(cTID("uglg"), true);
    ds1.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds1.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 5);
    ds1.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds1.putUnitDouble(cTID("blur"), cTID("#Pxl"), 5);
    ds1.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds1.putBoolean(cTID("AntA"), false);
    // Put first shadow directly
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds1);
    // Multi drop shadow list
    var dsList = new ActionList();
    // Shadow A: close, sharp, red
    var dsA = new ActionDescriptor();
    dsA.putBoolean(cTID("enab"), true);
    dsA.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    dsA.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(200, 0, 0));
    dsA.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    dsA.putBoolean(cTID("uglg"), true);
    dsA.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    dsA.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 3);
    dsA.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    dsA.putUnitDouble(cTID("blur"), cTID("#Pxl"), 2);
    dsA.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    dsA.putBoolean(cTID("AntA"), false);
    dsList.putObject(cTID("DrSh"), dsA);
    // Shadow B: far, soft, blue
    var dsB = new ActionDescriptor();
    dsB.putBoolean(cTID("enab"), true);
    dsB.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    dsB.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 200));
    dsB.putUnitDouble(cTID("Opct"), cTID("#Prc"), 40);
    dsB.putBoolean(cTID("uglg"), true);
    dsB.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    dsB.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 15);
    dsB.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    dsB.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    dsB.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    dsB.putBoolean(cTID("AntA"), false);
    dsList.putObject(cTID("DrSh"), dsB);
    fx.putList(sTID("dropShadowMulti"), dsList);
    setLayerEffects(fx);
    savePsd(doc, "effect/multi_drop_shadow");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("multi_drop_shadow: "+e); }

// ==========================================
// 2. effect/multi_inner_shadow — Multiple inner shadows (VlLs of IrSh)
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 200, 200, 200, "Multi IS");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var is1 = new ActionDescriptor();
    is1.putBoolean(cTID("enab"), true);
    is1.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    is1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    is1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 50);
    is1.putBoolean(cTID("uglg"), true);
    is1.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    is1.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 5);
    is1.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    is1.putUnitDouble(cTID("blur"), cTID("#Pxl"), 5);
    is1.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    is1.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("IrSh"), cTID("IrSh"), is1);
    var isList = new ActionList();
    var isA = new ActionDescriptor();
    isA.putBoolean(cTID("enab"), true);
    isA.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    isA.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(150, 0, 0));
    isA.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    isA.putBoolean(cTID("uglg"), true);
    isA.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    isA.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 2);
    isA.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    isA.putUnitDouble(cTID("blur"), cTID("#Pxl"), 3);
    isA.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    isA.putBoolean(cTID("AntA"), false);
    isList.putObject(cTID("IrSh"), isA);
    var isB = new ActionDescriptor();
    isB.putBoolean(cTID("enab"), true);
    isB.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    isB.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 150));
    isB.putUnitDouble(cTID("Opct"), cTID("#Prc"), 40);
    isB.putBoolean(cTID("uglg"), true);
    isB.putUnitDouble(cTID("lagl"), cTID("#Ang"), 240);
    isB.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 10);
    isB.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    isB.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    isB.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    isB.putBoolean(cTID("AntA"), false);
    isList.putObject(cTID("IrSh"), isB);
    fx.putList(sTID("innerShadowMulti"), isList);
    setLayerEffects(fx);
    savePsd(doc, "effect/multi_inner_shadow");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("multi_inner_shadow: "+e); }

// ==========================================
// 3. group/pass_through — Group with pass-through blend mode (default)
//    Descriptor: BlnM = passThrough in group layer section
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 100, 150, 200, "BG");
    var g = d.layerSets.add(); g.name = "PassThrough Group";
    g.blendMode = BlendMode.PASSTHROUGH;
    var ly = g.artLayers.add(); ly.name = "Content"; d.activeLayer = ly;
    d.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 100; c.rgb.blue = 100;
    d.selection.fill(c); d.selection.deselect();
    ly.blendMode = BlendMode.MULTIPLY;
    savePsd(d, "group/pass_through"); ok++;
})();}catch(e){fail++; $.writeln("pass_through: "+e);}

// ==========================================
// 4. group/normal_isolate — Group with Normal blend (isolates contents)
//    Tests different group blend mode descriptor value
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 100, 150, 200, "BG");
    var g = d.layerSets.add(); g.name = "Normal Group";
    g.blendMode = BlendMode.NORMAL;
    var ly = g.artLayers.add(); ly.name = "Content"; d.activeLayer = ly;
    d.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 100; c.rgb.blue = 100;
    d.selection.fill(c); d.selection.deselect();
    ly.blendMode = BlendMode.MULTIPLY;
    savePsd(d, "group/normal_isolate"); ok++;
})();}catch(e){fail++; $.writeln("normal_isolate: "+e);}

// ==========================================
// 5. layer/blend_interior — Layer with "Blend Interior Effects as Group"
//    Descriptor: blendInterior bool = true via layer advanced blending
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 40, 40, 120, 120, 128, 128, 200, "Blend Interior");
    // Apply an effect first
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    ig.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 200));
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC"));
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    ig.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ig.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);
    setLayerEffects(fx);
    // Set blend interior
    var propDesc = new ActionDescriptor();
    propDesc.putBoolean(sTID("blendInterior"), true);
    setLayerProp(propDesc);
    savePsd(d, "layer/blend_interior"); ok++;
})();}catch(e){fail++; $.writeln("blend_interior: "+e);}

// ==========================================
// 6. layer/blend_clipped — Layer with "Blend Clipped Layers as Group"
//    Descriptor: blendClipped bool in layer properties
// ==========================================
try{(function(){
    var d = newDoc();
    var base = fillRect(d, 20, 20, 160, 160, 150, 150, 150, "Base");
    var clip = fillRect(d, 40, 40, 120, 120, 255, 100, 100, "Clipped");
    clip.grouped = true; // clipping mask
    // Set blend clipped on base layer
    d.activeLayer = base;
    var propDesc = new ActionDescriptor();
    propDesc.putBoolean(sTID("blendClipped"), false); // don't blend clipped as group
    setLayerProp(propDesc);
    savePsd(d, "layer/blend_clipped"); ok++;
})();}catch(e){fail++; $.writeln("blend_clipped: "+e);}

// ==========================================
// 7. layer/layer_mask_hides_fx — Layer mask hides effects
//    Descriptor: layerFXVisible bool in layer advanced options
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 30, 30, 140, 140, 100, 100, 200, "Mask Hides FX");
    // Add effect
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 8);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    // Add layer mask
    d.selection.select([[60,60],[140,60],[140,140],[60,140]]);
    var mkDesc = new ActionDescriptor();
    mkDesc.putEnumerated(cTID("Nw  "), cTID("Chnl"), cTID("Msk "));
    mkDesc.putEnumerated(cTID("At  "), cTID("Chnl"), cTID("Msk "));
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Set layer mask hides effects
    var propDesc = new ActionDescriptor();
    propDesc.putBoolean(sTID("layerFXVisible"), false);
    setLayerProp(propDesc);
    savePsd(d, "layer/layer_mask_hides_fx"); ok++;
})();}catch(e){fail++; $.writeln("layer_mask_hides_fx: "+e);}

// ==========================================
// 8. text/auto_kern_optical — Text with Optical auto kerning
//    Descriptor: autoKern enum = OpticalKerning in text style
// ==========================================
try {
    var doc = newDoc(300, 100);
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Optical Kern";
    var txt = ly.textItem;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(24, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 0; return c; })();
    txt.position = [new UnitValue(10, "px"), new UnitValue(50, "px")];
    txt.contents = "AVA WATT";
    txt.autoKerning = AutoKernType.OPTICAL;
    savePsd(doc, "text/auto_kern_optical");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("auto_kern_optical: "+e); }

// ==========================================
// 9. text/auto_kern_metrics — Text with Metrics auto kerning
//    Descriptor: autoKern enum = MetricsKerning
// ==========================================
try {
    var doc = newDoc(300, 100);
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Metrics Kern";
    var txt = ly.textItem;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(24, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 0; return c; })();
    txt.position = [new UnitValue(10, "px"), new UnitValue(50, "px")];
    txt.contents = "AVA WATT";
    txt.autoKerning = AutoKernType.METRICS;
    savePsd(doc, "text/auto_kern_metrics");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("auto_kern_metrics: "+e); }

// ==========================================
// 10. text/hyphenation — Area text with hyphenation settings
//     Descriptor: hyphenation bool + hyphenation-related properties
// ==========================================
try {
    var doc = newDoc(300, 300);
    var ly = doc.artLayers.add();
    ly.kind = LayerKind.TEXT;
    ly.name = "Hyphenation";
    var txt = ly.textItem;
    txt.kind = TextType.PARAGRAPHTEXT;
    txt.font = "Roboto-Regular";
    txt.size = new UnitValue(14, "pt");
    txt.color = (function(){ var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 0; c.rgb.blue = 0; return c; })();
    txt.width = new UnitValue(200, "px");
    txt.height = new UnitValue(250, "px");
    txt.position = [new UnitValue(50, "px"), new UnitValue(25, "px")];
    txt.contents = "Internationalization and telecommunications infrastructure development requires extraordinary documentation and standardization across organizations.";
    txt.hyphenation = true;
    txt.hyphenationZone = new UnitValue(36, "pt");
    txt.hyphenLimit = 3;
    txt.minimumAfterHyphen = 3;
    txt.minimumBeforeHyphen = 2;
    txt.justification = Justification.LEFTJUSTIFIED;
    savePsd(doc, "text/hyphenation");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("hyphenation: "+e); }

// ==========================================
// 11. fill/gradient_transparency — Gradient with varying opacity stops
//     Descriptor: Trns list with multiple TrnS at different Opct values
//     ALL existing gradients use 100% opacity at both stops.
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
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Fade Out");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 0, 0));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 255));
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 4096); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    grad.putList(cTID("Clrs"), clrs);
    // Multiple transparency stops: opaque -> transparent -> opaque
    var trns = new ActionList();
    var ts1 = new ActionDescriptor();
    ts1.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts1.putInteger(cTID("Lctn"), 0); ts1.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts1);
    var ts2 = new ActionDescriptor();
    ts2.putUnitDouble(cTID("Opct"), cTID("#Prc"), 0); // fully transparent mid!
    ts2.putInteger(cTID("Lctn"), 2048); ts2.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts2);
    var ts3 = new ActionDescriptor();
    ts3.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ts3.putInteger(cTID("Lctn"), 4096); ts3.putInteger(cTID("Mdpn"), 50);
    trns.putObject(cTID("TrnS"), ts3);
    grad.putList(cTID("Trns"), trns);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Fade Gradient";
    savePsd(doc, "fill/gradient_transparency");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_transparency: "+e); }

// ==========================================
// 12. effect/gradient_overlay_offset — Gradient Overlay with position offset
//     Descriptor: GrFl with Ofst Pnt (Hrzn/Vrtc) descriptor
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 20, 20, 160, 160, 128, 128, 128, "GradOffset");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(cTID("enab"), true);
    go.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    go.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    go.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Rdl ")); // Radial
    go.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    go.putUnitDouble(cTID("Scl "), cTID("#Prc"), 80);
    go.putBoolean(cTID("Rvrs"), false);
    go.putBoolean(cTID("Algn"), true);
    // Offset from center
    var ofs = new ActionDescriptor();
    ofs.putUnitDouble(cTID("Hrzn"), cTID("#Prc"), 30);
    ofs.putUnitDouble(cTID("Vrtc"), cTID("#Prc"), -20);
    go.putObject(cTID("Ofst"), cTID("Pnt "), ofs);
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Offset Radial");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 255));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 100));
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
    go.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fx.putObject(cTID("GrFl"), cTID("GrFl"), go);
    setLayerEffects(fx);
    savePsd(doc, "effect/gradient_overlay_offset");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_overlay_offset: "+e); }

// ==========================================
// 13. adjustment/invert — Invert adjustment layer
//     Descriptor: Invr with no additional keys (minimal descriptor)
//     Tests parser handling of empty/minimal adjustment descriptors.
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 100, 200, 200, 100, 50, "Warm");
    fillRect(d, 100, 0, 100, 200, 50, 100, 200, "Cool");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    adjDesc.putClass(cTID("Type"), cTID("Invr"));
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/invert"); ok++;
})();}catch(e){fail++; $.writeln("invert: "+e);}

// ==========================================
// 14. adjustment/posterize — Posterize adjustment with specific level
//     Descriptor: Pstr with Lvl long
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 128, 128, 128, "Content");
    // Paint a gradient for visual effect
    var ly = d.artLayers.add(); ly.name = "Gradient"; d.activeLayer = ly;
    d.selection.selectAll();
    var gradDesc = new ActionDescriptor();
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "BW");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 255));
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
    gradDesc.putObject(cTID("Grad"), cTID("Grdn"), grad);
    gradDesc.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    gradDesc.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    executeAction(cTID("Grdn"), gradDesc, DialogModes.NO);
    d.selection.deselect();
    // Posterize
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var pst = new ActionDescriptor();
    pst.putInteger(cTID("Lvl "), 4);
    adjDesc.putObject(cTID("Type"), cTID("Pstr"), pst);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/posterize"); ok++;
})();}catch(e){fail++; $.writeln("posterize: "+e);}

// ==========================================
// 15. adjustment/threshold — Threshold adjustment
//     Descriptor: Thrs with Lvl long
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 100, 200, 200, 100, 50, "A");
    fillRect(d, 100, 0, 100, 200, 50, 100, 200, "B");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var thr = new ActionDescriptor();
    thr.putInteger(cTID("Lvl "), 100);
    adjDesc.putObject(cTID("Type"), cTID("Thrs"), thr);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/threshold"); ok++;
})();}catch(e){fail++; $.writeln("threshold: "+e);}

// ==========================================
// 16. shape/pattern_fill — Shape layer with pattern fill content
//     Descriptor: contentLayer with patternLayer type (not solid or gradient)
// ==========================================
try{(function(){
    // Define a cross-hatch pattern
    var patDoc = app.documents.add(12, 12, 72, "xhatch", NewDocumentMode.RGB, DocumentFill.WHITE);
    patDoc.flatten();
    // Horizontal line
    patDoc.selection.select([[0,5],[12,5],[12,7],[0,7]]);
    var bc = new SolidColor(); bc.rgb.red = 0; bc.rgb.green = 0; bc.rgb.blue = 0;
    patDoc.selection.fill(bc);
    // Vertical line
    patDoc.selection.select([[5,0],[7,0],[7,12],[5,12]]);
    patDoc.selection.fill(bc);
    patDoc.selection.deselect();
    patDoc.selection.selectAll();
    var defP = new ActionDescriptor();
    defP.putString(cTID("Nm  "), "Zoo CrossHatch");
    executeAction(cTID("DfnP"), defP, DialogModes.NO);
    patDoc.close(SaveOptions.DONOTSAVECHANGES);

    var d = newDoc();
    var mkDesc = new ActionDescriptor();
    var mkRef = new ActionReference();
    mkRef.putClass(sTID("contentLayer"));
    mkDesc.putReference(cTID("null"), mkRef);
    var shapeDesc = new ActionDescriptor();
    var patContent = new ActionDescriptor();
    patContent.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var patRef = new ActionDescriptor();
    patRef.putString(cTID("Nm  "), "Zoo CrossHatch");
    patContent.putObject(cTID("Ptrn"), cTID("Ptrn"), patRef);
    shapeDesc.putObject(cTID("Type"), sTID("patternLayer"), patContent);
    mkDesc.putObject(cTID("Usng"), sTID("contentLayer"), shapeDesc);
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.activeLayer.name = "Pattern Shape";
    // Set vector mask to ellipse
    var pathDesc = new ActionDescriptor();
    var pathRef = new ActionReference();
    pathRef.putProperty(cTID("Path"), sTID("vectorMask"));
    pathRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    pathDesc.putReference(cTID("null"), pathRef);
    var ellipse = new ActionDescriptor();
    ellipse.putUnitDouble(cTID("Top "), cTID("#Pxl"), 20);
    ellipse.putUnitDouble(cTID("Left"), cTID("#Pxl"), 20);
    ellipse.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 180);
    ellipse.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 180);
    pathDesc.putObject(cTID("T   "), cTID("Elps"), ellipse);
    executeAction(cTID("setd"), pathDesc, DialogModes.NO);
    savePsd(d, "shape/pattern_fill"); ok++;
})();}catch(e){fail++; $.writeln("pattern_fill: "+e);}

// ==========================================
// 17. adjustment/selective_color_abs — Selective Color in Absolute mode
//     Descriptor: SlcC with method enum = Absolute (vs Relative)
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 100, 200, 200, 50, 50, "Red");
    fillRect(d, 100, 0, 100, 200, 50, 200, 50, "Green");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var sc = new ActionDescriptor();
    sc.putEnumerated(sTID("method"), sTID("correctionMethod"), sTID("absolute"));
    var colorList = new ActionList();
    // Reds correction
    var reds = new ActionDescriptor();
    reds.putEnumerated(sTID("selColor"), sTID("selColors"), sTID("reds"));
    reds.putUnitDouble(cTID("Cyn "), cTID("#Prc"), 20);
    reds.putUnitDouble(cTID("Mgnt"), cTID("#Prc"), -10);
    reds.putUnitDouble(cTID("Ylw "), cTID("#Prc"), 30);
    reds.putUnitDouble(cTID("Blck"), cTID("#Prc"), 0);
    colorList.putObject(sTID("selColor"), reds);
    // Greens correction
    var greens = new ActionDescriptor();
    greens.putEnumerated(sTID("selColor"), sTID("selColors"), sTID("greens"));
    greens.putUnitDouble(cTID("Cyn "), cTID("#Prc"), -30);
    greens.putUnitDouble(cTID("Mgnt"), cTID("#Prc"), 0);
    greens.putUnitDouble(cTID("Ylw "), cTID("#Prc"), -20);
    greens.putUnitDouble(cTID("Blck"), cTID("#Prc"), 10);
    colorList.putObject(sTID("selColor"), greens);
    sc.putList(sTID("colorCorrection"), colorList);
    adjDesc.putObject(cTID("Type"), sTID("selectiveColor"), sc);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/selective_color_abs"); ok++;
})();}catch(e){fail++; $.writeln("selective_color_abs: "+e);}

// ==========================================
// 18. fill/gradient_scale_50 — Gradient fill with 50% scale
//     Descriptor: gradientLayer with Scl UntF != 100
// ==========================================
try {
    var doc = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(cTID("Angl"), cTID("#Ang"), 90);
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    gradContent.putUnitDouble(cTID("Scl "), cTID("#Prc"), 50); // 50% scale!
    gradContent.putBoolean(cTID("Dthr"), true);
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Half Scale");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(50, 0, 100));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 50));
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
    doc.activeLayer.name = "50% Scale Gradient";
    savePsd(doc, "fill/gradient_scale_50");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_scale_50: "+e); }

// ==========================================
// 19. effect/drop_shadow_conceal — Drop Shadow with "Layer Knocks Out Drop Shadow"
//     Descriptor: layerConceals bool in DrSh
// ==========================================
try {
    var doc = newDoc();
    var ly = fillRect(doc, 40, 40, 120, 120, 200, 100, 100, "Conceal Test");
    ly.opacity = 50; // make semi-transparent so knockout effect visible
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    ds.putBoolean(sTID("layerConceals"), false); // layer does NOT knock out shadow
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(doc, "effect/drop_shadow_conceal");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("drop_shadow_conceal: "+e); }

// ==========================================
// 20. layer/transparency_shapes — Layer with "Transparency Shapes Layer" off
//     Descriptor: transparencyShapesLayer bool = false
//     Tests advanced blending option that affects effect rendering.
// ==========================================
try{(function(){
    var d = newDoc();
    var ly = fillRect(d, 30, 30, 140, 140, 100, 200, 100, "TransShape");
    // Apply inner glow
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    ig.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 0));
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC"));
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    ig.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ig.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);
    setLayerEffects(fx);
    // Turn off transparency shapes layer
    var propDesc = new ActionDescriptor();
    propDesc.putBoolean(sTID("transparencyShapesLayer"), false);
    setLayerProp(propDesc);
    savePsd(d, "layer/transparency_shapes"); ok++;
})();}catch(e){fail++; $.writeln("transparency_shapes: "+e);}

"gen_desc5 done: " + ok + " ok, " + fail + " fail";
