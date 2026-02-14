// gen_desc3.jsx - Descriptor coverage part 3:
//   Alternative color spaces (HSBC, LbCl, CMYC, Grsc), noise gradients (ClNs),
//   pattern references (Ptrn with Nm/Idnt), CMYK/Lab documents, gradient types
//
// These descriptor types are completely absent from all previous test files.
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
function addColorLayer(doc, r, g, b, nm) {
    var ly = doc.artLayers.add(); ly.name = nm || "Color"; doc.activeLayer = ly;
    doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c); doc.selection.deselect(); return ly;
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

// ==========================================
// 1. effect/color_hsb — Drop Shadow using HSBC color space
//    Descriptor: Clr class = HSBC with H UntF #Ang, Strt doub, Brgh doub
//    ALL existing files use RGBC only - this tests HSBC parsing
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 150, 100, 200, "HSB Shadow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    // HSB Color descriptor: H (hue angle), Strt (saturation), Brgh (brightness)
    var hsbClr = new ActionDescriptor();
    hsbClr.putUnitDouble(cTID("H   "), cTID("#Ang"), 240); // blue hue
    hsbClr.putDouble(cTID("Strt"), 80);                     // 80% saturation
    hsbClr.putDouble(cTID("Brgh"), 20);                     // 20% brightness (dark)
    ds.putObject(cTID("Clr "), cTID("HSBC"), hsbClr);
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 8);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), true);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(doc, "effect/color_hsb");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("color_hsb: "+e); }

// ==========================================
// 2. effect/color_lab — Inner Glow using Lab color space
//    Descriptor: Clr class = LbCl with Lmnc doub, A doub, B doub
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 100, 100, 150, "Lab Glow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    // Lab Color descriptor: Lmnc (luminance), A, B
    var labClr = new ActionDescriptor();
    labClr.putDouble(cTID("Lmnc"), 90);  // high luminance (bright)
    labClr.putDouble(cTID("A   "), 30);  // toward red/magenta
    labClr.putDouble(cTID("B   "), -40); // toward blue
    ig.putObject(cTID("Clr "), cTID("LbCl"), labClr);
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC"));
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);
    setLayerEffects(fx);
    savePsd(doc, "effect/color_lab");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("color_lab: "+e); }

// ==========================================
// 3. effect/color_grayscale — Color Overlay using Grayscale color space
//    Descriptor: Clr class = Grsc with Gry doub, Bk doub
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 200, 100, 100, "Gray Overlay");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var co = new ActionDescriptor();
    co.putBoolean(cTID("enab"), true);
    co.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    co.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    // Grayscale Color descriptor
    var gryClr = new ActionDescriptor();
    gryClr.putDouble(cTID("Gry "), 50); // 50% gray
    gryClr.putDouble(cTID("Bk  "), 0);
    co.putObject(cTID("Clr "), cTID("Grsc"), gryClr);
    fx.putObject(cTID("SoFi"), cTID("SoFi"), co);
    setLayerEffects(fx);
    savePsd(doc, "effect/color_grayscale");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("color_grayscale: "+e); }

// ==========================================
// 4. effect/color_cmyk — Outer Glow using CMYK color space
//    Descriptor: Clr class = CMYC with Cyn doub, Mgnt doub, Ylw doub, Blck doub
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 50, 50, 100, 100, 50, 100, 200, "CMYK Glow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    // CMYK Color descriptor
    var cmykClr = new ActionDescriptor();
    cmykClr.putDouble(cTID("Cyn "), 0);
    cmykClr.putDouble(cTID("Mgnt"), 80);
    cmykClr.putDouble(cTID("Ylw "), 100);
    cmykClr.putDouble(cTID("Blck"), 0);
    og.putObject(cTID("Clr "), cTID("CMYC"), cmykClr);
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), true);
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(doc, "effect/color_cmyk");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("color_cmyk: "+e); }

// ==========================================
// 5. fill/gradient_noise_rgb — Noise Gradient fill (RGB color space)
//    Descriptor: GrdF=ClNs (completely different from CstS gradients)
//    Contains: RndS long, Smth long, ClrS enum, Mnm/Mxm long lists, ShTr/VctC bools
//    NO existing test file uses ClNs gradient form.
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
    // Noise gradient descriptor
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Noise RGB");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("ClNs")); // Color Noise!
    grad.putDouble(cTID("Smth"), 2048); // smoothness
    grad.putInteger(cTID("RndS"), 12345); // random seed
    grad.putBoolean(sTID("showTransparency"), false);
    grad.putBoolean(sTID("vectorColor"), true);
    grad.putEnumerated(cTID("ClrS"), cTID("ClrS"), cTID("RGBC")); // RGB color space
    // Min per channel
    var minL = new ActionList();
    minL.putInteger(0); minL.putInteger(0); minL.putInteger(0);
    grad.putList(cTID("Mnm "), minL);
    // Max per channel
    var maxL = new ActionList();
    maxL.putInteger(100); maxL.putInteger(100); maxL.putInteger(100);
    grad.putList(cTID("Mxm "), maxL);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Noise Gradient RGB";
    savePsd(doc, "fill/gradient_noise_rgb");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_noise_rgb: "+e); }

// ==========================================
// 6. fill/gradient_noise_hsb — Noise Gradient in HSB color space
//    Descriptor: ClrS=HSBC (different channel semantics)
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
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Noise HSB");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("ClNs"));
    grad.putDouble(cTID("Smth"), 3000);
    grad.putInteger(cTID("RndS"), 67890);
    grad.putBoolean(sTID("showTransparency"), true);
    grad.putBoolean(sTID("vectorColor"), false);
    grad.putEnumerated(cTID("ClrS"), cTID("ClrS"), cTID("HSBC")); // HSB!
    var minL = new ActionList();
    minL.putInteger(0); minL.putInteger(50); minL.putInteger(50);
    grad.putList(cTID("Mnm "), minL);
    var maxL = new ActionList();
    maxL.putInteger(100); maxL.putInteger(100); maxL.putInteger(100);
    grad.putList(cTID("Mxm "), maxL);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Noise Gradient HSB";
    savePsd(doc, "fill/gradient_noise_hsb");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_noise_hsb: "+e); }

// ==========================================
// 7. fill/gradient_noise_lab — Noise Gradient in Lab color space
//    Descriptor: ClrS=LbCl
// ==========================================
try {
    var doc = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(cTID("Angl"), cTID("#Ang"), 45);
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Rdl "));
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Noise Lab");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("ClNs"));
    grad.putDouble(cTID("Smth"), 1024);
    grad.putInteger(cTID("RndS"), 54321);
    grad.putBoolean(sTID("showTransparency"), false);
    grad.putBoolean(sTID("vectorColor"), true);
    grad.putEnumerated(cTID("ClrS"), cTID("ClrS"), cTID("LbCl")); // Lab!
    var minL = new ActionList();
    minL.putInteger(20); minL.putInteger(0); minL.putInteger(0);
    grad.putList(cTID("Mnm "), minL);
    var maxL = new ActionList();
    maxL.putInteger(80); maxL.putInteger(100); maxL.putInteger(100);
    grad.putList(cTID("Mxm "), maxL);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Noise Gradient Lab";
    savePsd(doc, "fill/gradient_noise_lab");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_noise_lab: "+e); }

// ==========================================
// 8. effect/pattern_overlay_ref — Pattern Overlay with explicit Ptrn descriptor
//    First defines a custom pattern, then references it by Nm and Idnt.
//    Tests Ptrn class descriptor parsing (Nm TEXT, Idnt TEXT)
// ==========================================
try {
    // Step 1: Create and define a checkerboard pattern
    var patDoc = app.documents.add(8, 8, 72, "pat", NewDocumentMode.RGB, DocumentFill.WHITE);
    patDoc.flatten();
    patDoc.selection.select([[0,0],[4,0],[4,4],[0,4]]);
    var cb = new SolidColor(); cb.rgb.red = 0; cb.rgb.green = 0; cb.rgb.blue = 0;
    patDoc.selection.fill(cb);
    patDoc.selection.select([[4,4],[8,4],[8,8],[4,8]]);
    patDoc.selection.fill(cb);
    patDoc.selection.deselect();
    patDoc.selection.selectAll();
    var defDesc = new ActionDescriptor();
    defDesc.putString(cTID("Nm  "), "Zoo Checkerboard");
    executeAction(cTID("DfnP"), defDesc, DialogModes.NO);
    patDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Step 2: Create test document and apply pattern overlay
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 200, 180, 160, "Pattern Test");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var po = new ActionDescriptor();
    po.putBoolean(cTID("enab"), true);
    po.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    po.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    po.putUnitDouble(cTID("Scl "), cTID("#Prc"), 200);
    po.putBoolean(cTID("Algn"), true);
    // Pattern reference with name
    var patRef = new ActionDescriptor();
    patRef.putString(cTID("Nm  "), "Zoo Checkerboard");
    po.putObject(cTID("Ptrn"), cTID("Ptrn"), patRef);
    fx.putObject(cTID("patternFill"), cTID("patternFill"), po);
    setLayerEffects(fx);
    savePsd(doc, "effect/pattern_overlay_ref");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("pattern_overlay_ref: "+e); }

// ==========================================
// 9. fill/pattern_scaled_angle — Pattern fill layer with custom scale and phase
//    Descriptor: patternLayer with Scl UntF, phase Pnt descriptor
// ==========================================
try {
    // Define a stripe pattern
    var patDoc2 = app.documents.add(4, 4, 72, "pat2", NewDocumentMode.RGB, DocumentFill.WHITE);
    patDoc2.flatten();
    patDoc2.selection.select([[0,0],[4,0],[4,2],[0,2]]);
    var sc = new SolidColor(); sc.rgb.red = 100; sc.rgb.green = 100; sc.rgb.blue = 200;
    patDoc2.selection.fill(sc);
    patDoc2.selection.deselect();
    patDoc2.selection.selectAll();
    var defDesc2 = new ActionDescriptor();
    defDesc2.putString(cTID("Nm  "), "Zoo Stripes");
    executeAction(cTID("DfnP"), defDesc2, DialogModes.NO);
    patDoc2.close(SaveOptions.DONOTSAVECHANGES);

    var doc = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var patContent = new ActionDescriptor();
    patContent.putUnitDouble(cTID("Scl "), cTID("#Prc"), 300);
    // Phase (offset)
    var phase = new ActionDescriptor();
    phase.putDouble(cTID("Hrzn"), 5);
    phase.putDouble(cTID("Vrtc"), 3);
    patContent.putObject(sTID("phase"), cTID("Pnt "), phase);
    // Pattern reference
    var patRef = new ActionDescriptor();
    patRef.putString(cTID("Nm  "), "Zoo Stripes");
    patContent.putObject(cTID("Ptrn"), cTID("Ptrn"), patRef);
    fillDesc.putObject(cTID("Type"), sTID("patternLayer"), patContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Pattern Scaled";
    savePsd(doc, "fill/pattern_scaled_angle");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("pattern_scaled_angle: "+e); }

// ==========================================
// 10. color_mode/cmyk_curves — CMYK document with Curves adjustment
//     Exercises CMYK channel references (Cyn/Mgnt/Ylw/Blck) in adjustment descriptors
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.CMYK, DocumentFill.WHITE);
    // Fill with CMYK color via DOM
    var ly = d.artLayers.add(); ly.name = "CMYK Content"; d.activeLayer = ly;
    d.selection.selectAll();
    var c = new SolidColor(); c.cmyk.cyan = 30; c.cmyk.magenta = 60; c.cmyk.yellow = 10; c.cmyk.black = 0;
    d.selection.fill(c); d.selection.deselect();
    // Add Curves adjustment for Cyan channel
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var ch = new ActionDescriptor();
    var cRef = new ActionReference();
    cRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Cyn "));
    ch.putReference(cTID("Chnl"), cRef);
    var ptList = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    ptList.putObject(cTID("Pnt "), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 128); p2.putDouble(cTID("Vrtc"), 160);
    ptList.putObject(cTID("Pnt "), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 255); p3.putDouble(cTID("Vrtc"), 255);
    ptList.putObject(cTID("Pnt "), p3);
    ch.putList(cTID("Crv "), ptList);
    chList.putObject(cTID("CrvA"), ch);
    cv.putList(cTID("Adjs"), chList);
    adjDesc.putObject(cTID("Type"), cTID("Crvs"), cv);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "color_mode/cmyk_curves"); ok++;
})();}catch(e){fail++; $.writeln("cmyk_curves: "+e);}

// ==========================================
// 11. color_mode/cmyk_levels — CMYK document with Levels adjustment
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.CMYK, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "CMYK Content"; d.activeLayer = ly;
    d.selection.selectAll();
    var c = new SolidColor(); c.cmyk.cyan = 10; c.cmyk.magenta = 40; c.cmyk.yellow = 80; c.cmyk.black = 5;
    d.selection.fill(c); d.selection.deselect();
    // Levels on composite
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var lvl = new ActionDescriptor();
    var adjList = new ActionList();
    var ch = new ActionDescriptor();
    var cRef = new ActionReference();
    cRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Cmps"));
    ch.putReference(cTID("Chnl"), cRef);
    var inp = new ActionList(); inp.putInteger(10); inp.putInteger(240);
    ch.putList(cTID("Inpt"), inp);
    ch.putDouble(cTID("Gmm "), 1.2);
    adjList.putObject(cTID("LvlA"), ch);
    lvl.putList(cTID("Adjs"), adjList);
    adjDesc.putObject(cTID("Type"), cTID("Lvls"), lvl);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "color_mode/cmyk_levels"); ok++;
})();}catch(e){fail++; $.writeln("cmyk_levels: "+e);}

// ==========================================
// 12. color_mode/lab_curves — Lab document with Curves on Lightness channel
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.LAB, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "Lab Content"; d.activeLayer = ly;
    d.selection.selectAll();
    var c = new SolidColor(); c.lab.l = 60; c.lab.a = 20; c.lab.b = -30;
    d.selection.fill(c); d.selection.deselect();
    // Curves on Lightness
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var ch = new ActionDescriptor();
    var cRef = new ActionReference();
    cRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Lght"));
    ch.putReference(cTID("Chnl"), cRef);
    var ptList = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    ptList.putObject(cTID("Pnt "), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 64); p2.putDouble(cTID("Vrtc"), 40);
    ptList.putObject(cTID("Pnt "), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 192); p3.putDouble(cTID("Vrtc"), 220);
    ptList.putObject(cTID("Pnt "), p3);
    var p4 = new ActionDescriptor(); p4.putDouble(cTID("Hrzn"), 255); p4.putDouble(cTID("Vrtc"), 255);
    ptList.putObject(cTID("Pnt "), p4);
    ch.putList(cTID("Crv "), ptList);
    chList.putObject(cTID("CrvA"), ch);
    cv.putList(cTID("Adjs"), chList);
    adjDesc.putObject(cTID("Type"), cTID("Crvs"), cv);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "color_mode/lab_curves"); ok++;
})();}catch(e){fail++; $.writeln("lab_curves: "+e);}

// ==========================================
// 13. color_mode/cmyk_hue_sat — CMYK document with Hue/Saturation
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.CMYK, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "Content"; d.activeLayer = ly;
    d.selection.selectAll();
    var c = new SolidColor(); c.cmyk.cyan = 50; c.cmyk.magenta = 20; c.cmyk.yellow = 0; c.cmyk.black = 0;
    d.selection.fill(c); d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hs = new ActionDescriptor();
    var hsl = new ActionList();
    var master = new ActionDescriptor();
    master.putInteger(cTID("H   "), 30);
    master.putInteger(cTID("Strt"), 20);
    master.putInteger(cTID("Lght"), -5);
    hsl.putObject(cTID("HStA"), master);
    hs.putList(cTID("Adjs"), hsl);
    adjDesc.putObject(cTID("Type"), cTID("HStr"), hs);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "color_mode/cmyk_hue_sat"); ok++;
})();}catch(e){fail++; $.writeln("cmyk_hue_sat: "+e);}

// ==========================================
// 14. effect/gradient_overlay_diamond — Diamond gradient type
//     Descriptor: GrdT = Dmnd
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 20, 20, 160, 160, 128, 128, 128, "Diamond Gradient");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(cTID("enab"), true);
    go.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    go.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    go.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Dmnd")); // Diamond!
    go.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    go.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    go.putBoolean(cTID("Rvrs"), false);
    go.putBoolean(cTID("Algn"), true);
    // Simple 2-stop gradient
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Diamond BW");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 255));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
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
    savePsd(doc, "effect/gradient_overlay_diamond");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_overlay_diamond: "+e); }

// ==========================================
// 15. effect/gradient_overlay_angle — Angle gradient type
//     Descriptor: GrdT = Angl
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 20, 20, 160, 160, 128, 128, 128, "Angle Gradient");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(cTID("enab"), true);
    go.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    go.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    go.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Angl")); // Angle!
    go.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    go.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    go.putBoolean(cTID("Rvrs"), false);
    go.putBoolean(cTID("Algn"), true);
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Angle RB");
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
    savePsd(doc, "effect/gradient_overlay_angle");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_overlay_angle: "+e); }

// ==========================================
// 16. fill/gradient_hsb_stops — Gradient with HSBC color stops
//     ALL existing gradients use RGBC stops; this tests HSBC in Clrt
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
    grad.putString(cTID("Nm  "), "HSB Stops");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    // Stop 1: HSBC red
    var cs1 = new ActionDescriptor();
    var hsb1 = new ActionDescriptor();
    hsb1.putUnitDouble(cTID("H   "), cTID("#Ang"), 0);
    hsb1.putDouble(cTID("Strt"), 100);
    hsb1.putDouble(cTID("Brgh"), 100);
    cs1.putObject(cTID("Clr "), cTID("HSBC"), hsb1);
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    // Stop 2: HSBC green
    var cs2 = new ActionDescriptor();
    var hsb2 = new ActionDescriptor();
    hsb2.putUnitDouble(cTID("H   "), cTID("#Ang"), 120);
    hsb2.putDouble(cTID("Strt"), 100);
    hsb2.putDouble(cTID("Brgh"), 100);
    cs2.putObject(cTID("Clr "), cTID("HSBC"), hsb2);
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 2048); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    // Stop 3: HSBC blue
    var cs3 = new ActionDescriptor();
    var hsb3 = new ActionDescriptor();
    hsb3.putUnitDouble(cTID("H   "), cTID("#Ang"), 240);
    hsb3.putDouble(cTID("Strt"), 100);
    hsb3.putDouble(cTID("Brgh"), 100);
    cs3.putObject(cTID("Clr "), cTID("HSBC"), hsb3);
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
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "HSB Gradient";
    savePsd(doc, "fill/gradient_hsb_stops");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_hsb_stops: "+e); }

// ==========================================
// 17. group/deep_nesting_15 — 15 levels of nested groups
//     Stress-tests recursive descriptor parsing depth
// ==========================================
try{(function(){
    var d = newDoc();
    var parent = d;
    for (var i = 0; i < 15; i++) {
        var g = (i === 0 ? d : parent).layerSets.add();
        g.name = "Level " + (i + 1);
        parent = g;
    }
    // Add content at deepest level
    var ly = parent.artLayers.add(); ly.name = "Deepest"; d.activeLayer = ly;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    d.selection.fill(c); d.selection.deselect();
    savePsd(d, "group/deep_nesting_15"); ok++;
})();}catch(e){fail++; $.writeln("deep_nesting_15: "+e);}

// ==========================================
// 18. smart/linked — Linked smart object (exercises alis/Pth descriptors in SoLd block)
// ==========================================
try{(function(){
    // Create source file to link
    var srcDoc = app.documents.add(100, 100, 72, "link_source", NewDocumentMode.RGB, DocumentFill.WHITE);
    var ly = srcDoc.artLayers.add(); ly.name = "Source Content"; srcDoc.activeLayer = ly;
    srcDoc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 128; c.rgb.blue = 255;
    srcDoc.selection.fill(c); srcDoc.selection.deselect();
    var srcPath = basePath + "smart/link_source_temp.psd";
    var srcFile = new File(srcPath);
    var so = new PhotoshopSaveOptions(); so.alphaChannels = true; so.layers = true;
    srcDoc.saveAs(srcFile, so, true);
    srcDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Create main document and place linked
    var d = newDoc();
    addColorLayer(d, 200, 200, 200, "Background");
    var placeDesc = new ActionDescriptor();
    placeDesc.putPath(cTID("null"), new File(srcPath));
    placeDesc.putBoolean(sTID("linked"), true);
    placeDesc.putEnumerated(sTID("freeTransformCenterState"), sTID("quadCenterState"), sTID("QCSAverage"));
    executeAction(sTID("placeEvent"), placeDesc, DialogModes.NO);
    // Commit transform
    try { executeAction(cTID("Plc "), new ActionDescriptor(), DialogModes.NO); } catch(e2) {}
    savePsd(d, "smart/linked"); ok++;

    // Clean up temp file
    try { srcFile.remove(); } catch(e3) {}
})();}catch(e){fail++; $.writeln("linked: "+e);}

// ==========================================
// 19. color_mode/depth_16bit_gradient — 16-bit document with gradient fill
//     Exercises higher bit depth descriptor interactions
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE, 1, BitsPerChannelType.SIXTEEN);
    // Gradient fill layer (preserves gradient descriptor instead of rasterizing)
    var mkDesc = new ActionDescriptor();
    var mkRef = new ActionReference();
    mkRef.putClass(sTID("contentLayer"));
    mkDesc.putReference(cTID("null"), mkRef);
    var fillDesc = new ActionDescriptor();
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(cTID("Angl"), cTID("#Ang"), 45);
    gradContent.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "16bit Grad");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 0, 128));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 128, 255));
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
    mkDesc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.activeLayer.name = "16bit Gradient";
    savePsd(d, "color_mode/depth_16bit_gradient"); ok++;
})();}catch(e){fail++; $.writeln("depth_16bit_gradient: "+e);}

// ==========================================
// 20. effect/color_overlay_blendmode — Color Overlay with various blend modes
//     Tests different blend mode enum values in effect descriptors
// ==========================================
try {
    var doc = newDoc(300, 200);
    fillRect(doc, 20, 20, 260, 160, 128, 128, 128, "Blend Mode Test");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var co = new ActionDescriptor();
    co.putBoolean(cTID("enab"), true);
    co.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Ovrl")); // Overlay blend mode
    co.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    co.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 128, 0));
    fx.putObject(cTID("SoFi"), cTID("SoFi"), co);
    setLayerEffects(fx);
    savePsd(doc, "effect/color_overlay_overlay");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("color_overlay_overlay: "+e); }

"gen_desc3 done: " + ok + " ok, " + fail + " fail";
