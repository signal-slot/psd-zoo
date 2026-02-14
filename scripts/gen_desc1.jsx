// gen_desc1.jsx - Descriptor coverage part 1:
//   Custom contour curves, complex gradients, blend-if, fill opacity, group effects
//
// Targets descriptor types: ShpC/CrPt (contour curves), large VlLs (many gradient stops),
//   blendRange (blend-if), Objc nesting (effects), various UntF units (#Pxl, #Prc, #Ang)
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
    var ly = doc.artLayers.add();
    ly.name = nm || "Rect";
    doc.activeLayer = ly;
    doc.selection.select([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c); doc.selection.deselect();
    return ly;
}

function cTID(s) { return charIDToTypeID(s); }
function sTID(s) { return stringIDToTypeID(s); }

function makeRGBC(r, g, b) {
    var c = new ActionDescriptor();
    c.putDouble(cTID("Rd  "), r);
    c.putDouble(cTID("Grn "), g);
    c.putDouble(cTID("Bl  "), b);
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

function makeContour(name, points) {
    var contour = new ActionDescriptor();
    contour.putString(cTID("Nm  "), name);
    var curve = new ActionList();
    for (var i = 0; i < points.length; i++) {
        var pt = new ActionDescriptor();
        pt.putDouble(sTID("horizontal"), points[i][0]);
        pt.putDouble(sTID("vertical"), points[i][1]);
        pt.putBoolean(sTID("continuity"), points[i].length > 2 ? points[i][2] : true);
        curve.putObject(cTID("CrPt"), pt);
    }
    contour.putList(cTID("Crv "), curve);
    return contour;
}

function makeDropShadow(opts) {
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID(opts.blendMode || "Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(opts.r || 0, opts.g || 0, opts.b || 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), opts.opacity || 75);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), opts.angle || 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), opts.distance || 5);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), opts.spread || 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), opts.size || 5);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), opts.noise || 0);
    ds.putBoolean(cTID("AntA"), opts.antiAlias !== false);
    return ds;
}

function makeInnerShadow(opts) {
    var is = new ActionDescriptor();
    is.putBoolean(cTID("enab"), true);
    is.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID(opts.blendMode || "Mltp"));
    is.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(opts.r || 0, opts.g || 0, opts.b || 0));
    is.putUnitDouble(cTID("Opct"), cTID("#Prc"), opts.opacity || 75);
    is.putBoolean(cTID("uglg"), true);
    is.putUnitDouble(cTID("lagl"), cTID("#Ang"), opts.angle || 120);
    is.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), opts.distance || 5);
    is.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), opts.choke || 0);
    is.putUnitDouble(cTID("blur"), cTID("#Pxl"), opts.size || 5);
    is.putUnitDouble(cTID("Nose"), cTID("#Prc"), opts.noise || 0);
    is.putBoolean(cTID("AntA"), opts.antiAlias !== false);
    return is;
}

function makeGradientDesc(name, colorStops, opacityStops) {
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), name);
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    for (var i = 0; i < colorStops.length; i++) {
        var cs = new ActionDescriptor();
        cs.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(colorStops[i][0], colorStops[i][1], colorStops[i][2]));
        cs.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
        cs.putInteger(cTID("Lctn"), colorStops[i][3]);
        cs.putInteger(cTID("Mdpn"), colorStops[i].length > 4 ? colorStops[i][4] : 50);
        clrs.putObject(cTID("Clrt"), cs);
    }
    grad.putList(cTID("Clrs"), clrs);
    var trns = new ActionList();
    for (var i = 0; i < opacityStops.length; i++) {
        var ts = new ActionDescriptor();
        ts.putUnitDouble(cTID("Opct"), cTID("#Prc"), opacityStops[i][0]);
        ts.putInteger(cTID("Lctn"), opacityStops[i][1]);
        ts.putInteger(cTID("Mdpn"), opacityStops[i].length > 2 ? opacityStops[i][2] : 50);
        trns.putObject(cTID("TrnS"), ts);
    }
    grad.putList(cTID("Trns"), trns);
    return grad;
}

// ==========================================
// 1. effect/contour_custom — Drop Shadow with custom S-curve contour
//    Descriptor: ShpC class with CrPt list (doub horizontal, doub vertical, bool continuity)
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 100, 150, 200, "Contour Test");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = makeDropShadow({opacity: 75, distance: 10, size: 15});
    // Custom S-curve contour via transferSpec (ShpC descriptor)
    ds.putObject(sTID("transferSpec"), cTID("ShpC"),
        makeContour("S-Curve", [[0,0],[25,80],[50,10],[75,90],[100,100]]));
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(doc, "effect/contour_custom");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("contour_custom: "+e); }

// ==========================================
// 2. effect/contour_half_round — Drop Shadow with half-round contour (3 points)
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 200, 100, 150, "Half Round");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = makeDropShadow({opacity: 80, distance: 8, size: 12});
    ds.putObject(sTID("transferSpec"), cTID("ShpC"),
        makeContour("Half Round", [[0,0],[50,100,false],[100,0]]));
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(doc, "effect/contour_half_round");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("contour_half_round: "+e); }

// ==========================================
// 3. effect/inner_shadow_contour — Inner Shadow with custom contour
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 80, 120, 200, "Inner Shadow Contour");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var is = makeInnerShadow({opacity: 60, distance: 7, size: 10});
    is.putObject(sTID("transferSpec"), cTID("ShpC"),
        makeContour("Gaussian", [[0,0],[25,50],[50,100],[75,50],[100,0]]));
    fx.putObject(cTID("IrSh"), cTID("IrSh"), is);
    setLayerEffects(fx);
    savePsd(doc, "effect/inner_shadow_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("inner_shadow_contour: "+e); }

// ==========================================
// 4. bevel/gloss_contour — Bevel & Emboss with custom gloss contour
//    Descriptor: ebbl with nested ShpC for glossContour and transferSpec2
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 180, 120, 80, "Bevel Gloss");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var bv = new ActionDescriptor();
    bv.putBoolean(cTID("enab"), true);
    bv.putEnumerated(cTID("bvlS"), cTID("BESl"), cTID("InrB")); // Inner Bevel
    bv.putEnumerated(cTID("bvlT"), cTID("bvlT"), cTID("SfBL")); // Smooth
    bv.putUnitDouble(cTID("srgR"), cTID("#Prc"), 100);            // Strength
    bv.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);             // Size
    bv.putUnitDouble(cTID("Sftn"), cTID("#Pxl"), 3);              // Soften
    bv.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);             // Angle
    bv.putUnitDouble(cTID("Lald"), cTID("#Ang"), 30);              // Altitude
    bv.putBoolean(cTID("uglg"), true);
    // Highlight
    bv.putEnumerated(cTID("hglM"), cTID("BlnM"), cTID("Scrn"));
    bv.putObject(cTID("hglC"), cTID("RGBC"), makeRGBC(255, 255, 255));
    bv.putUnitDouble(cTID("hglO"), cTID("#Prc"), 75);
    // Shadow
    bv.putEnumerated(cTID("sdwM"), cTID("BlnM"), cTID("Mltp"));
    bv.putObject(cTID("sdwC"), cTID("RGBC"), makeRGBC(0, 0, 0));
    bv.putUnitDouble(cTID("sdwO"), cTID("#Prc"), 50);
    bv.putBoolean(cTID("AntA"), true);
    // Gloss Contour — ring pattern (deep descriptor nesting with ShpC)
    bv.putObject(sTID("glossContour"), cTID("ShpC"),
        makeContour("Ring", [[0,100],[25,0],[50,100],[75,0],[100,100]]));
    // Highlight Contour
    bv.putObject(sTID("transferSpec2"), cTID("ShpC"),
        makeContour("Sawtooth", [[0,0],[33,100],[66,0],[100,100]]));
    fx.putObject(cTID("ebbl"), cTID("ebbl"), bv);
    setLayerEffects(fx);
    savePsd(doc, "bevel/gloss_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("bevel_gloss_contour: "+e); }

// ==========================================
// 5. effect/gradient_overlay_rainbow — Gradient Overlay with 6 color stops + 3 opacity stops
//    Descriptor: large VlLs for Clrs and Trns, nested Clrt/TrnS Objc items
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 20, 20, 160, 160, 128, 128, 128, "Gradient Overlay");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(cTID("enab"), true);
    go.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    go.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    go.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    go.putUnitDouble(cTID("Angl"), cTID("#Ang"), 45);
    go.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    go.putBoolean(cTID("Rvrs"), false);
    go.putBoolean(cTID("Algn"), true);
    // Offset
    var ofs = new ActionDescriptor();
    ofs.putUnitDouble(cTID("Hrzn"), cTID("#Prc"), 0);
    ofs.putUnitDouble(cTID("Vrtc"), cTID("#Prc"), 0);
    go.putObject(cTID("Ofst"), cTID("Pnt "), ofs);
    // 6-stop rainbow gradient
    go.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Rainbow",
        [[255,0,0,0],[255,128,0,819],[255,255,0,1638],[0,255,0,2457],[0,0,255,3276],[128,0,255,4096]],
        [[100,0],[50,2048],[100,4096]]
    ));
    fx.putObject(cTID("GrFl"), cTID("GrFl"), go);
    setLayerEffects(fx);
    savePsd(doc, "effect/gradient_overlay_rainbow");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_overlay_rainbow: "+e); }

// ==========================================
// 6. effect/gradient_overlay_radial — Radial Gradient Overlay with offset
//    Descriptor: GrdT=Rdl, Ofst point descriptor with non-zero values
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 20, 20, 160, 160, 100, 100, 100, "Radial Gradient");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(cTID("enab"), true);
    go.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    go.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    go.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Rdl "));  // Radial
    go.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    go.putUnitDouble(cTID("Scl "), cTID("#Prc"), 80);
    go.putBoolean(cTID("Rvrs"), false);
    go.putBoolean(cTID("Algn"), true);
    // Non-zero offset — exercises Pnt descriptor with UntF values
    var ofs = new ActionDescriptor();
    ofs.putUnitDouble(cTID("Hrzn"), cTID("#Prc"), 25);
    ofs.putUnitDouble(cTID("Vrtc"), cTID("#Prc"), -15);
    go.putObject(cTID("Ofst"), cTID("Pnt "), ofs);
    go.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Radial",
        [[255,255,255,0],[0,0,128,4096]],
        [[100,0],[100,4096]]
    ));
    fx.putObject(cTID("GrFl"), cTID("GrFl"), go);
    setLayerEffects(fx);
    savePsd(doc, "effect/gradient_overlay_radial");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_overlay_radial: "+e); }

// ==========================================
// 7. effect/outer_glow_contour — Outer Glow with custom contour
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 50, 50, 100, 100, 50, 50, 150, "Outer Glow Contour");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    og.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 50));
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), true);
    // Contour on outer glow — MpgS/ShpC descriptor
    og.putObject(sTID("transferSpec"), cTID("ShpC"),
        makeContour("Cone", [[0,100],[50,0],[100,100]]));
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(doc, "effect/outer_glow_contour");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("outer_glow_contour: "+e); }

// ==========================================
// 8. effect/all_params — All 8 effects with comprehensive non-default params
//    Maximum descriptor nesting and variety
// ==========================================
try {
    var doc = newDoc(300, 300);
    fillRect(doc, 50, 50, 200, 200, 100, 120, 180, "All Effects");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);

    // Drop Shadow with contour
    var ds = makeDropShadow({opacity: 65, distance: 8, size: 12, spread: 5, noise: 10, angle: 135});
    ds.putBoolean(cTID("layerConceals"), true);
    ds.putObject(sTID("transferSpec"), cTID("ShpC"),
        makeContour("Linear", [[0,0],[100,100]]));
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);

    // Inner Shadow
    var is = makeInnerShadow({opacity: 50, distance: 5, size: 8, choke: 3});
    fx.putObject(cTID("IrSh"), cTID("IrSh"), is);

    // Outer Glow
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    og.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 200));
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 5);
    og.putBoolean(cTID("AntA"), true);
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);

    // Inner Glow
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    ig.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(200, 220, 255));
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 50);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC")); // Center source
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 20);
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);

    // Bevel & Emboss
    var bv = new ActionDescriptor();
    bv.putBoolean(cTID("enab"), true);
    bv.putEnumerated(cTID("bvlS"), cTID("BESl"), cTID("InrB"));
    bv.putEnumerated(cTID("bvlT"), cTID("bvlT"), cTID("SfBL"));
    bv.putUnitDouble(cTID("srgR"), cTID("#Prc"), 80);
    bv.putUnitDouble(cTID("blur"), cTID("#Pxl"), 5);
    bv.putUnitDouble(cTID("Sftn"), cTID("#Pxl"), 2);
    bv.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    bv.putUnitDouble(cTID("Lald"), cTID("#Ang"), 30);
    bv.putBoolean(cTID("uglg"), true);
    bv.putEnumerated(cTID("hglM"), cTID("BlnM"), cTID("Scrn"));
    bv.putObject(cTID("hglC"), cTID("RGBC"), makeRGBC(255, 255, 255));
    bv.putUnitDouble(cTID("hglO"), cTID("#Prc"), 70);
    bv.putEnumerated(cTID("sdwM"), cTID("BlnM"), cTID("Mltp"));
    bv.putObject(cTID("sdwC"), cTID("RGBC"), makeRGBC(0, 0, 0));
    bv.putUnitDouble(cTID("sdwO"), cTID("#Prc"), 40);
    bv.putBoolean(cTID("AntA"), true);
    fx.putObject(cTID("ebbl"), cTID("ebbl"), bv);

    // Satin
    var st = new ActionDescriptor();
    st.putBoolean(cTID("enab"), true);
    st.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    st.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    st.putUnitDouble(cTID("Opct"), cTID("#Prc"), 30);
    st.putUnitDouble(cTID("lagl"), cTID("#Ang"), 19);
    st.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 11);
    st.putUnitDouble(cTID("blur"), cTID("#Pxl"), 14);
    st.putBoolean(cTID("AntA"), true);
    st.putBoolean(cTID("Invr"), true);
    fx.putObject(cTID("ChFX"), cTID("ChFX"), st);

    // Color Overlay
    var co = new ActionDescriptor();
    co.putBoolean(cTID("enab"), true);
    co.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    co.putUnitDouble(cTID("Opct"), cTID("#Prc"), 30);
    co.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 100));
    fx.putObject(cTID("SoFi"), cTID("SoFi"), co);

    // Stroke (outside, gradient fill)
    var fr = new ActionDescriptor();
    fr.putBoolean(cTID("enab"), true);
    fr.putEnumerated(cTID("Styl"), cTID("FStl"), cTID("OutF"));
    fr.putEnumerated(cTID("PntT"), cTID("FrFl"), cTID("GrFl"));
    fr.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    fr.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    fr.putUnitDouble(cTID("Sz  "), cTID("#Pxl"), 3);
    fr.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    fr.putUnitDouble(cTID("Angl"), cTID("#Ang"), 90);
    fr.putBoolean(cTID("Rvrs"), false);
    fr.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fr.putBoolean(cTID("Algn"), true);
    fr.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("StrokeGrad",
        [[255,0,0,0],[0,0,255,4096]],
        [[100,0],[100,4096]]
    ));
    fx.putObject(cTID("FrFX"), cTID("FrFX"), fr);

    setLayerEffects(fx);
    savePsd(doc, "effect/all_params");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("all_params: "+e); }

// ==========================================
// 9. effect/disabled_effects — Effects defined but disabled (enab=false)
//    Descriptor: enab boolean set to false — parser should still read the data
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 150, 150, 200, "Disabled Effects");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = makeDropShadow({opacity: 75, distance: 10, size: 15});
    ds.putBoolean(cTID("enab"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    var is = makeInnerShadow({opacity: 60, distance: 5, size: 8});
    is.putBoolean(cTID("enab"), false);
    fx.putObject(cTID("IrSh"), cTID("IrSh"), is);
    setLayerEffects(fx);
    savePsd(doc, "effect/disabled_individual");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("disabled_effects: "+e); }

// ==========================================
// 10. fill/gradient_10stops — Gradient fill layer with 10 color stops
//     Descriptor: large VlLs (10 Clrt items)
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
    // 10-stop gradient: spectral
    var stops = [];
    var hueSteps = [[255,0,0],[255,128,0],[255,255,0],[128,255,0],[0,255,0],
                    [0,255,128],[0,255,255],[0,128,255],[0,0,255],[128,0,255]];
    for (var i = 0; i < hueSteps.length; i++) {
        stops.push([hueSteps[i][0], hueSteps[i][1], hueSteps[i][2], Math.round(i * 4096 / 9)]);
    }
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Spectral 10",
        stops, [[100,0],[100,4096]]
    ));
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Gradient 10 Stops";
    savePsd(doc, "fill/gradient_10stops");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_10stops: "+e); }

// ==========================================
// 11. fill/gradient_offset — Gradient fill layer with X/Y offset
//     Descriptor: Ofst point descriptor with UntF Prc values
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
    gradContent.putBoolean(cTID("Dthr"), true);
    gradContent.putBoolean(cTID("Rvrs"), true);
    gradContent.putUnitDouble(cTID("Scl "), cTID("#Prc"), 150);
    // Offset
    var ofs = new ActionDescriptor();
    ofs.putUnitDouble(cTID("Hrzn"), cTID("#Prc"), 30);
    ofs.putUnitDouble(cTID("Vrtc"), cTID("#Prc"), -20);
    gradContent.putObject(cTID("Ofst"), cTID("Pnt "), ofs);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Offset Radial",
        [[255,255,255,0],[0,100,200,4096]],
        [[100,0],[0,4096]]
    ));
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Gradient Offset";
    savePsd(doc, "fill/gradient_offset");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_offset: "+e); }

// ==========================================
// 12. fill/gradient_reverse_dither — Gradient fill with reverse + dither flags
//     Descriptor: Rvrs bool, Dthr bool
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
    gradContent.putBoolean(cTID("Dthr"), true);
    gradContent.putBoolean(cTID("Rvrs"), true);
    gradContent.putBoolean(cTID("Algn"), true);
    gradContent.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    gradContent.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Reversed",
        [[0,0,0,0],[255,255,255,4096]],
        [[100,0],[100,4096]]
    ));
    fillDesc.putObject(cTID("Type"), sTID("gradientLayer"), gradContent);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), fillDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = "Gradient Reverse Dither";
    savePsd(doc, "fill/gradient_reverse_dither");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("gradient_reverse_dither: "+e); }

// ==========================================
// 13. layer/fill_opacity — Fill opacity 50%, master opacity 100%
//     Descriptor: fillOpacity long value
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 255, 0, 0, "Fill 50%");
    doc.activeLayer.fillOpacity = 50;
    doc.activeLayer.opacity = 100;
    savePsd(doc, "layer/fill_opacity");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("fill_opacity: "+e); }

// ==========================================
// 14. layer/fill_opacity_zero — Fill opacity 0%, effects still visible
//     Common technique for effect-only layers
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 0, 128, 255, "Fill 0%");
    doc.activeLayer.fillOpacity = 0;
    doc.activeLayer.opacity = 100;
    // Add drop shadow so the layer is not invisible
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), makeDropShadow({opacity: 100, distance: 10, size: 15}));
    setLayerEffects(fx);
    savePsd(doc, "layer/fill_opacity_zero");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("fill_opacity_zero: "+e); }

// ==========================================
// 15. layer/blend_if_split — Blend-If with feathered (split) points
//     Descriptor: blendRange list with 4 integers [srcBlk, srcBlkFeather, srcWhtFeather, srcWht]
// ==========================================
try {
    var doc = newDoc();
    // Dark base for blend-if
    var bg = doc.artLayers.add(); bg.name = "Dark Base"; doc.activeLayer = bg;
    doc.selection.selectAll();
    var cbg = new SolidColor(); cbg.rgb.red = 50; cbg.rgb.green = 50; cbg.rgb.blue = 50;
    doc.selection.fill(cbg); doc.selection.deselect();
    // Gradient layer for blend-if testing
    var layer = doc.artLayers.add(); layer.name = "Blend If Split"; doc.activeLayer = layer;
    doc.selection.selectAll();
    var gDesc = new ActionDescriptor();
    var gradDesc = makeGradientDesc("BW", [[0,0,0,0],[255,255,255,4096]], [[100,0],[100,4096]]);
    gDesc.putObject(cTID("Grad"), cTID("Grdn"), gradDesc);
    gDesc.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    gDesc.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    executeAction(cTID("Grdn"), gDesc, DialogModes.NO);
    doc.selection.deselect();
    // Set blend-if with split (feathered) points: this layer 30/80 to 180/230
    var bDesc = new ActionDescriptor();
    var bRef = new ActionReference();
    bRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    bDesc.putReference(cTID("null"), bRef);
    var bTo = new ActionDescriptor();
    var bRange = new ActionList();
    bRange.putInteger(30);   // This Layer Black (low)
    bRange.putInteger(80);   // This Layer Black (high/feather)
    bRange.putInteger(180);  // This Layer White (low/feather)
    bRange.putInteger(230);  // This Layer White (high)
    bTo.putList(sTID("blendRange"), bRange);
    bDesc.putObject(cTID("T   "), cTID("Lyr "), bTo);
    executeAction(cTID("setd"), bDesc, DialogModes.NO);
    savePsd(doc, "layer/blend_if_split");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("blend_if_split: "+e); }

// ==========================================
// 16. group/with_effects — Group layer with drop shadow
//     Tests descriptor on layer set (group) rather than art layer
// ==========================================
try {
    var doc = newDoc();
    var bg = doc.artLayers.add(); bg.name = "BG"; doc.activeLayer = bg;
    doc.selection.selectAll();
    var cbg = new SolidColor(); cbg.rgb.red = 240; cbg.rgb.green = 240; cbg.rgb.blue = 240;
    doc.selection.fill(cbg); doc.selection.deselect();
    var group = doc.layerSets.add(); group.name = "Group with Effects";
    group.blendMode = BlendMode.NORMAL;
    var child = group.artLayers.add(); child.name = "Child"; doc.activeLayer = child;
    doc.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var cc = new SolidColor(); cc.rgb.red = 100; cc.rgb.green = 150; cc.rgb.blue = 200;
    doc.selection.fill(cc); doc.selection.deselect();
    // Select group and add effects
    doc.activeLayer = group;
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), makeDropShadow({opacity: 60, distance: 8, size: 12}));
    setLayerEffects(fx);
    savePsd(doc, "group/with_effects");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("group_with_effects: "+e); }

// ==========================================
// 17. group/opacity_blend — Group with opacity + blend mode
//     Tests group-level blend mode and opacity with multiple children
// ==========================================
try {
    var doc = newDoc();
    var bg = doc.artLayers.add(); bg.name = "BG"; doc.activeLayer = bg;
    var cbg = new SolidColor(); cbg.rgb.red = 255; cbg.rgb.green = 255; cbg.rgb.blue = 255;
    doc.selection.selectAll(); doc.selection.fill(cbg); doc.selection.deselect();
    var group = doc.layerSets.add();
    group.name = "Multiply 60%";
    group.blendMode = BlendMode.MULTIPLY;
    group.opacity = 60;
    var c1 = group.artLayers.add(); c1.name = "Red"; doc.activeLayer = c1;
    doc.selection.select([[20,20],[100,20],[100,100],[20,100]]);
    var cr = new SolidColor(); cr.rgb.red = 255; cr.rgb.green = 0; cr.rgb.blue = 0;
    doc.selection.fill(cr); doc.selection.deselect();
    var c2 = group.artLayers.add(); c2.name = "Blue"; doc.activeLayer = c2;
    doc.selection.select([[80,80],[180,80],[180,180],[80,180]]);
    var cb = new SolidColor(); cb.rgb.red = 0; cb.rgb.green = 0; cb.rgb.blue = 255;
    doc.selection.fill(cb); doc.selection.deselect();
    savePsd(doc, "group/opacity_blend");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("group_opacity_blend: "+e); }

// ==========================================
// 18. effect/stroke_gradient_type — Stroke effect with gradient fill (inside, linear)
//     Descriptor: FrFX with PntT=GrFl and nested gradient descriptor
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 200, 200, 200, "Stroke Grad Inside");

    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var fr = new ActionDescriptor();
    fr.putBoolean(cTID("enab"), true);
    fr.putEnumerated(cTID("Styl"), cTID("FStl"), cTID("InsF")); // Inside
    fr.putEnumerated(cTID("PntT"), cTID("FrFl"), cTID("GrFl")); // Gradient fill
    fr.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    fr.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    fr.putUnitDouble(cTID("Sz  "), cTID("#Pxl"), 6);
    fr.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Lnr "));
    fr.putUnitDouble(cTID("Angl"), cTID("#Ang"), 90);
    fr.putBoolean(cTID("Rvrs"), false);
    fr.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fr.putBoolean(cTID("Algn"), true);
    fr.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("StrokeGrad",
        [[255,0,0,0],[0,255,0,2048],[0,0,255,4096]],
        [[100,0],[100,4096]]
    ));
    fx.putObject(cTID("FrFX"), cTID("FrFX"), fr);
    setLayerEffects(fx);
    savePsd(doc, "effect/stroke_gradient_inside");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("stroke_gradient_inside: "+e); }

"gen_desc1 done: " + ok + " ok, " + fail + " fail";
