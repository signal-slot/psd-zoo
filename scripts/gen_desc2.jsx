// gen_desc2.jsx - Descriptor coverage part 2:
//   Adjustment layers, text formatting, shapes with vector stroke, smart filter blend
//
// Targets descriptor types: ChnM (channel mixer), HStr/Clrz (hue-sat colorize),
//   phfl (photo filter custom), CrvA with many points, vstk (vector stroke),
//   TxLr/Txtt (text ranges), smart filter blend descriptors
var basePath = "C:/Users/tasuku/com/github/signal-slot/psd-zoo/";
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

function addColorLayer(doc, r, g, b, name) {
    var layer = doc.artLayers.add();
    layer.name = name || "Color";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red = r; c.rgb.green = g; c.rgb.blue = b;
    doc.selection.fill(c); doc.selection.deselect();
    return layer;
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
        cs.putInteger(cTID("Mdpn"), 50);
        clrs.putObject(cTID("Clrt"), cs);
    }
    grad.putList(cTID("Clrs"), clrs);
    var trns = new ActionList();
    for (var i = 0; i < opacityStops.length; i++) {
        var ts = new ActionDescriptor();
        ts.putUnitDouble(cTID("Opct"), cTID("#Prc"), opacityStops[i][0]);
        ts.putInteger(cTID("Lctn"), opacityStops[i][1]);
        ts.putInteger(cTID("Mdpn"), 50);
        trns.putObject(cTID("TrnS"), ts);
    }
    grad.putList(cTID("Trns"), trns);
    return grad;
}

// ==========================================
// 1. adjustment/channel_mixer — Channel Mixer (RGB channels)
//    Descriptor: ChnM with Mnch bool, Rd/Grn/Bl lists of UntF #Prc
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 100, 50, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cmDesc = new ActionDescriptor();
    cmDesc.putBoolean(cTID("Mnch"), false);
    // Red output: more red, less green/blue
    var rl = new ActionList();
    rl.putUnitDouble(cTID("#Prc"), 120); rl.putUnitDouble(cTID("#Prc"), -10); rl.putUnitDouble(cTID("#Prc"), -10);
    cmDesc.putList(cTID("Rd  "), rl);
    // Green output
    var gl = new ActionList();
    gl.putUnitDouble(cTID("#Prc"), -10); gl.putUnitDouble(cTID("#Prc"), 120); gl.putUnitDouble(cTID("#Prc"), -10);
    cmDesc.putList(cTID("Grn "), gl);
    // Blue output
    var bl = new ActionList();
    bl.putUnitDouble(cTID("#Prc"), -10); bl.putUnitDouble(cTID("#Prc"), -10); bl.putUnitDouble(cTID("#Prc"), 120);
    cmDesc.putList(cTID("Bl  "), bl);
    adjDesc.putObject(cTID("Type"), cTID("ChnM"), cmDesc);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/channel_mixer"); ok++;
})();}catch(e){fail++; $.writeln("channel_mixer: "+e);}

// ==========================================
// 2. adjustment/channel_mixer_mono — Channel Mixer monochrome mode
//    Descriptor: ChnM with Mnch=true, Gry list
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 200, 100, 50, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cmDesc = new ActionDescriptor();
    cmDesc.putBoolean(cTID("Mnch"), true);
    var gl = new ActionList();
    gl.putUnitDouble(cTID("#Prc"), 40); gl.putUnitDouble(cTID("#Prc"), 40); gl.putUnitDouble(cTID("#Prc"), 20);
    cmDesc.putList(cTID("Gry "), gl);
    adjDesc.putObject(cTID("Type"), cTID("ChnM"), cmDesc);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/channel_mixer_mono"); ok++;
})();}catch(e){fail++; $.writeln("channel_mixer_mono: "+e);}

// ==========================================
// 3. adjustment/hue_sat_colorize — Hue/Saturation in colorize mode
//    Descriptor: HStr with colorize bool = true (changes interpretation)
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hs = new ActionDescriptor();
    hs.putBoolean(sTID("colorize"), true);
    var hsl = new ActionList();
    var master = new ActionDescriptor();
    master.putInteger(cTID("H   "), 30);   // warm sepia-like
    master.putInteger(cTID("Strt"), 40);
    master.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), master);
    hs.putList(cTID("Adjs"), hsl);
    adjDesc.putObject(cTID("Type"), cTID("HStr"), hs);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/hue_sat_colorize"); ok++;
})();}catch(e){fail++; $.writeln("hue_sat_colorize: "+e);}

// ==========================================
// 4. adjustment/hue_sat_per_color — Hue/Sat with per-color range adjustments
//    Descriptor: HStr with Adjs list containing multiple HStA entries for different Clrs
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 200, 150, 100, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hs = new ActionDescriptor();
    var hsl = new ActionList();
    // Master
    var master = new ActionDescriptor();
    master.putInteger(cTID("H   "), 0);
    master.putInteger(cTID("Strt"), 10);
    master.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), master);
    // Reds — shift hue, increase saturation
    var reds = new ActionDescriptor();
    reds.putInteger(cTID("H   "), 15);
    reds.putInteger(cTID("Strt"), 30);
    reds.putInteger(cTID("Lght"), -5);
    hsl.putObject(cTID("HStA"), reds);
    // Yellows
    var yellows = new ActionDescriptor();
    yellows.putInteger(cTID("H   "), -10);
    yellows.putInteger(cTID("Strt"), 20);
    yellows.putInteger(cTID("Lght"), 5);
    hsl.putObject(cTID("HStA"), yellows);
    // Greens
    var greens = new ActionDescriptor();
    greens.putInteger(cTID("H   "), 0);
    greens.putInteger(cTID("Strt"), -20);
    greens.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), greens);
    // Cyans
    var cyans = new ActionDescriptor();
    cyans.putInteger(cTID("H   "), 0);
    cyans.putInteger(cTID("Strt"), 0);
    cyans.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), cyans);
    // Blues
    var blues = new ActionDescriptor();
    blues.putInteger(cTID("H   "), 10);
    blues.putInteger(cTID("Strt"), 15);
    blues.putInteger(cTID("Lght"), -10);
    hsl.putObject(cTID("HStA"), blues);
    // Magentas
    var magentas = new ActionDescriptor();
    magentas.putInteger(cTID("H   "), 0);
    magentas.putInteger(cTID("Strt"), 0);
    magentas.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), magentas);
    hs.putList(cTID("Adjs"), hsl);
    adjDesc.putObject(cTID("Type"), cTID("HStr"), hs);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/hue_sat_per_color"); ok++;
})();}catch(e){fail++; $.writeln("hue_sat_per_color: "+e);}

// ==========================================
// 5. adjustment/photo_filter_color — Photo Filter with custom color
//    Descriptor: phfl with custom RGBC, Dnst UntF #Prc, Lmns bool
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 200, 100, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var pf = new ActionDescriptor();
    pf.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 128, 0));
    pf.putUnitDouble(cTID("Dnst"), cTID("#Prc"), 40);
    pf.putBoolean(cTID("Lmns"), true);
    adjDesc.putObject(cTID("Type"), cTID("photoFilter"), pf);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/photo_filter_color"); ok++;
})();}catch(e){fail++; $.writeln("photo_filter_color: "+e);}

// ==========================================
// 6. adjustment/curves_many_points — Curves with 6 control points (complex S-curve)
//    Descriptor: CrvA with long Crv list of Pnt descriptors
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var ch = new ActionDescriptor();
    var cRef = new ActionReference();
    cRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Cmps"));
    ch.putReference(cTID("Chnl"), cRef);
    // 6-point complex S-curve
    var ptList = new ActionList();
    var points = [[0,0],[50,20],[100,80],[155,175],[200,235],[255,255]];
    for (var i = 0; i < points.length; i++) {
        var p = new ActionDescriptor();
        p.putDouble(cTID("Hrzn"), points[i][0]);
        p.putDouble(cTID("Vrtc"), points[i][1]);
        ptList.putObject(cTID("Pnt "), p);
    }
    ch.putList(cTID("Crv "), ptList);
    chList.putObject(cTID("CrvA"), ch);
    cv.putList(cTID("Adjs"), chList);
    adjDesc.putObject(cTID("Type"), cTID("Crvs"), cv);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/curves_many_points"); ok++;
})();}catch(e){fail++; $.writeln("curves_many_points: "+e);}

// ==========================================
// 7. adjustment/levels_output — Levels with output levels narrowed
//    Descriptor: LvlA with both Inpt and Otpt lists
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 100, 150, 200, "Content");
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
    var inp = new ActionList(); inp.putInteger(20); inp.putInteger(230);
    ch.putList(cTID("Inpt"), inp);
    var out = new ActionList(); out.putInteger(30); out.putInteger(220);
    ch.putList(cTID("Otpt"), out);
    ch.putDouble(cTID("Gmm "), 1.3);
    adjList.putObject(cTID("LvlA"), ch);
    lvl.putList(cTID("Adjs"), adjList);
    adjDesc.putObject(cTID("Type"), cTID("Lvls"), lvl);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/levels_output"); ok++;
})();}catch(e){fail++; $.writeln("levels_output: "+e);}

// ==========================================
// 8. adjustment/gradient_map_5stops — Gradient Map with 5 color stops
//    Descriptor: GdMp with nested gradient descriptor containing many stops
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var gmDesc = new ActionDescriptor();
    gmDesc.putObject(cTID("Grad"), cTID("Grdn"), makeGradientDesc("Map5",
        [[0,0,128,0],[0,128,255,1024],[255,255,255,2048],[255,128,0,3072],[128,0,0,4096]],
        [[100,0],[100,4096]]
    ));
    gmDesc.putBoolean(cTID("Dthr"), true);
    gmDesc.putBoolean(cTID("Rvrs"), false);
    adjDesc.putObject(cTID("Type"), cTID("GdMp"), gmDesc);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/gradient_map_5stops"); ok++;
})();}catch(e){fail++; $.writeln("gradient_map_5stops: "+e);}

// ==========================================
// 9. shape/rounded_rect — Rounded rectangle shape
//    Descriptor: Rctn with topLeft/topRight/bottomLeft/bottomRight radius UntF
// ==========================================
try{(function(){
    var d = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(cTID("Rd  "), 0); cd.putDouble(cTID("Grn "), 128); cd.putDouble(cTID("Bl  "), 255);
    var sol = new ActionDescriptor(); sol.putObject(cTID("Clr "), cTID("RGBC"), cd);
    sd.putObject(cTID("Type"), sTID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(cTID("Top "), cTID("#Pxl"), 30);
    r.putUnitDouble(cTID("Left"), cTID("#Pxl"), 30);
    r.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 170);
    r.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 170);
    r.putUnitDouble(sTID("topLeft"), cTID("#Pxl"), 20);
    r.putUnitDouble(sTID("topRight"), cTID("#Pxl"), 20);
    r.putUnitDouble(sTID("bottomLeft"), cTID("#Pxl"), 20);
    r.putUnitDouble(sTID("bottomRight"), cTID("#Pxl"), 20);
    sd.putObject(cTID("Shp "), sTID("roundedRect"), r);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), sd);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Rounded Rect";
    savePsd(d, "shape/rounded_rect"); ok++;
})();}catch(e){fail++; $.writeln("rounded_rect: "+e);}

// ==========================================
// 10. shape/rounded_rect_asymmetric — Rounded rect with different corner radii
//     Descriptor: different UntF values per corner
// ==========================================
try{(function(){
    var d = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(cTID("Rd  "), 255); cd.putDouble(cTID("Grn "), 100); cd.putDouble(cTID("Bl  "), 50);
    var sol = new ActionDescriptor(); sol.putObject(cTID("Clr "), cTID("RGBC"), cd);
    sd.putObject(cTID("Type"), sTID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(cTID("Top "), cTID("#Pxl"), 20);
    r.putUnitDouble(cTID("Left"), cTID("#Pxl"), 20);
    r.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 180);
    r.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 180);
    r.putUnitDouble(sTID("topLeft"), cTID("#Pxl"), 0);
    r.putUnitDouble(sTID("topRight"), cTID("#Pxl"), 30);
    r.putUnitDouble(sTID("bottomLeft"), cTID("#Pxl"), 10);
    r.putUnitDouble(sTID("bottomRight"), cTID("#Pxl"), 50);
    sd.putObject(cTID("Shp "), sTID("roundedRect"), r);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), sd);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Asymmetric Corners";
    savePsd(d, "shape/rounded_rect_asymmetric"); ok++;
})();}catch(e){fail++; $.writeln("rounded_rect_asymmetric: "+e);}

// ==========================================
// 11. shape/vector_stroke_caps — Shape with vector stroke line cap and join settings
//     Descriptor: strokeStyle with strokeStyleLineCap, strokeStyleLineJoin,
//     strokeStyleLineWidth, strokeStyleLineDashOffset — exercises vstk block
// ==========================================
try{(function(){
    var d = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(cTID("Rd  "), 200); cd.putDouble(cTID("Grn "), 230); cd.putDouble(cTID("Bl  "), 255);
    var sol = new ActionDescriptor(); sol.putObject(cTID("Clr "), cTID("RGBC"), cd);
    sd.putObject(cTID("Type"), sTID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(cTID("Top "), cTID("#Pxl"), 30);
    r.putUnitDouble(cTID("Left"), cTID("#Pxl"), 30);
    r.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 170);
    r.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 170);
    sd.putObject(cTID("Shp "), cTID("Rctn"), r);
    // Vector stroke style — exercises vstk descriptor
    var stk = new ActionDescriptor();
    stk.putBoolean(sTID("fillEnabled"), true);
    stk.putBoolean(sTID("strokeEnabled"), true);
    var skClr = new ActionDescriptor();
    skClr.putDouble(cTID("Rd  "), 0); skClr.putDouble(cTID("Grn "), 0); skClr.putDouble(cTID("Bl  "), 128);
    var skCnt = new ActionDescriptor();
    skCnt.putObject(cTID("Clr "), cTID("RGBC"), skClr);
    stk.putObject(sTID("strokeStyleContent"), sTID("solidColorLayer"), skCnt);
    stk.putUnitDouble(sTID("strokeStyleLineWidth"), cTID("#Pxl"), 4);
    stk.putEnumerated(sTID("strokeStyleLineCap"), sTID("strokeStyleLineCap"), sTID("strokeStyleRoundCap"));
    stk.putEnumerated(sTID("strokeStyleLineJoin"), sTID("strokeStyleLineJoin"), sTID("strokeStyleRoundJoin"));
    stk.putUnitDouble(sTID("strokeStyleMiterLimit"), cTID("#Pxl"), 4);
    stk.putEnumerated(sTID("strokeStyleLineAlignment"), sTID("strokeStyleLineAlignment"), sTID("strokeStyleAlignCenter"));
    stk.putUnitDouble(sTID("strokeStyleOpacity"), cTID("#Prc"), 100);
    stk.putBoolean(sTID("strokeStyleScaleLock"), false);
    stk.putBoolean(sTID("strokeStyleStrokeAdjust"), true);
    sd.putObject(sTID("strokeStyle"), sTID("strokeStyle"), stk);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), sd);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Stroke Caps Join";
    savePsd(d, "shape/vector_stroke_caps"); ok++;
})();}catch(e){fail++; $.writeln("vector_stroke_caps: "+e);}

// ==========================================
// 12. shape/vector_stroke_dash_custom — Shape with custom dash pattern
//     Descriptor: strokeStyleLineDashSet with custom dash array
// ==========================================
try{(function(){
    var d = newDoc();
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(sTID("contentLayer"));
    desc.putReference(cTID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(cTID("Rd  "), 255); cd.putDouble(cTID("Grn "), 230); cd.putDouble(cTID("Bl  "), 200);
    var sol = new ActionDescriptor(); sol.putObject(cTID("Clr "), cTID("RGBC"), cd);
    sd.putObject(cTID("Type"), sTID("solidColorLayer"), sol);
    var e = new ActionDescriptor();
    e.putUnitDouble(cTID("Top "), cTID("#Pxl"), 30);
    e.putUnitDouble(cTID("Left"), cTID("#Pxl"), 30);
    e.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 170);
    e.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 170);
    sd.putObject(cTID("Shp "), cTID("Elps"), e);
    // Stroke with custom dash pattern
    var stk = new ActionDescriptor();
    stk.putBoolean(sTID("fillEnabled"), true);
    stk.putBoolean(sTID("strokeEnabled"), true);
    var skClr = new ActionDescriptor();
    skClr.putDouble(cTID("Rd  "), 255); skClr.putDouble(cTID("Grn "), 0); skClr.putDouble(cTID("Bl  "), 0);
    var skCnt = new ActionDescriptor();
    skCnt.putObject(cTID("Clr "), cTID("RGBC"), skClr);
    stk.putObject(sTID("strokeStyleContent"), sTID("solidColorLayer"), skCnt);
    stk.putUnitDouble(sTID("strokeStyleLineWidth"), cTID("#Pxl"), 3);
    stk.putEnumerated(sTID("strokeStyleLineCap"), sTID("strokeStyleLineCap"), sTID("strokeStyleButtCap"));
    stk.putEnumerated(sTID("strokeStyleLineJoin"), sTID("strokeStyleLineJoin"), sTID("strokeStyleMiterJoin"));
    // Custom dash pattern: dash-dash-gap-dot-gap
    var dashList = new ActionList();
    dashList.putUnitDouble(cTID("#Nne"), 4);  // dash length
    dashList.putUnitDouble(cTID("#Nne"), 2);  // gap
    dashList.putUnitDouble(cTID("#Nne"), 1);  // dot
    dashList.putUnitDouble(cTID("#Nne"), 2);  // gap
    stk.putList(sTID("strokeStyleLineDashSet"), dashList);
    stk.putUnitDouble(sTID("strokeStyleLineDashOffset"), cTID("#Pnt"), 0);
    sd.putObject(sTID("strokeStyle"), sTID("strokeStyle"), stk);
    desc.putObject(cTID("Usng"), sTID("contentLayer"), sd);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Custom Dash";
    savePsd(d, "shape/vector_stroke_dash_custom"); ok++;
})();}catch(e){fail++; $.writeln("vector_stroke_dash_custom: "+e);}

// ==========================================
// 13. text/superscript — Text with superscript
//     Descriptor: TxLr/TxtS with baseline enum = superScript
// ==========================================
try{(function(){
    var d = app.documents.add(300, 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(30, "pt");
    layer.textItem.contents = "E=mc2";
    layer.textItem.position = [30, 120];
    // Set "2" to superscript
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(cTID("Prpr"), cTID("TxLr"));
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    // "E=mc" normal
    var r1 = new ActionDescriptor();
    r1.putInteger(cTID("From"), 0);
    r1.putInteger(cTID("T   "), 4);
    var s1 = new ActionDescriptor();
    s1.putString(cTID("FntN"), "Roboto-Regular");
    s1.putString(cTID("FntS"), "Regular");
    s1.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
    r1.putObject(cTID("TxtS"), cTID("TxtS"), s1);
    list.putObject(cTID("Txtt"), r1);
    // "2" superscript
    var r2 = new ActionDescriptor();
    r2.putInteger(cTID("From"), 4);
    r2.putInteger(cTID("T   "), 5);
    var s2 = new ActionDescriptor();
    s2.putString(cTID("FntN"), "Roboto-Regular");
    s2.putString(cTID("FntS"), "Regular");
    s2.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
    s2.putEnumerated(sTID("baseline"), sTID("baseline"), sTID("superScript"));
    r2.putObject(cTID("TxtS"), cTID("TxtS"), s2);
    list.putObject(cTID("Txtt"), r2);
    txDesc.putList(cTID("Txtt"), list);
    desc.putObject(cTID("T   "), cTID("TxLr"), txDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "text/superscript"); ok++;
})();}catch(e){fail++; $.writeln("superscript: "+e);}

// ==========================================
// 14. text/subscript — Text with subscript
//     Descriptor: baseline enum = subScript
// ==========================================
try{(function(){
    var d = app.documents.add(300, 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(30, "pt");
    layer.textItem.contents = "H2O";
    layer.textItem.position = [30, 120];
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(cTID("Prpr"), cTID("TxLr"));
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    // "H" normal
    var r1 = new ActionDescriptor();
    r1.putInteger(cTID("From"), 0);
    r1.putInteger(cTID("T   "), 1);
    var s1 = new ActionDescriptor();
    s1.putString(cTID("FntN"), "Roboto-Regular");
    s1.putString(cTID("FntS"), "Regular");
    s1.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
    r1.putObject(cTID("TxtS"), cTID("TxtS"), s1);
    list.putObject(cTID("Txtt"), r1);
    // "2" subscript
    var r2 = new ActionDescriptor();
    r2.putInteger(cTID("From"), 1);
    r2.putInteger(cTID("T   "), 2);
    var s2 = new ActionDescriptor();
    s2.putString(cTID("FntN"), "Roboto-Regular");
    s2.putString(cTID("FntS"), "Regular");
    s2.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
    s2.putEnumerated(sTID("baseline"), sTID("baseline"), sTID("subScript"));
    r2.putObject(cTID("TxtS"), cTID("TxtS"), s2);
    list.putObject(cTID("Txtt"), r2);
    // "O" normal
    var r3 = new ActionDescriptor();
    r3.putInteger(cTID("From"), 2);
    r3.putInteger(cTID("T   "), 3);
    var s3 = new ActionDescriptor();
    s3.putString(cTID("FntN"), "Roboto-Regular");
    s3.putString(cTID("FntS"), "Regular");
    s3.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
    r3.putObject(cTID("TxtS"), cTID("TxtS"), s3);
    list.putObject(cTID("Txtt"), r3);
    txDesc.putList(cTID("Txtt"), list);
    desc.putObject(cTID("T   "), cTID("TxLr"), txDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "text/subscript"); ok++;
})();}catch(e){fail++; $.writeln("subscript: "+e);}

// ==========================================
// 15. text/per_char_tracking — Different tracking values per character range
//     Descriptor: TxtS with Trck long values per range
// ==========================================
try{(function(){
    var d = app.documents.add(400, 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "TIGHT  WIDE";
    layer.textItem.position = [20, 120];
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(cTID("Prpr"), cTID("TxLr"));
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    // "TIGHT" with tight tracking (-100)
    var r1 = new ActionDescriptor();
    r1.putInteger(cTID("From"), 0);
    r1.putInteger(cTID("T   "), 5);
    var s1 = new ActionDescriptor();
    s1.putString(cTID("FntN"), "Roboto-Bold");
    s1.putString(cTID("FntS"), "Bold");
    s1.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 24);
    s1.putInteger(sTID("tracking"), -100);
    r1.putObject(cTID("TxtS"), cTID("TxtS"), s1);
    list.putObject(cTID("Txtt"), r1);
    // "  " normal tracking
    var r2 = new ActionDescriptor();
    r2.putInteger(cTID("From"), 5);
    r2.putInteger(cTID("T   "), 7);
    var s2 = new ActionDescriptor();
    s2.putString(cTID("FntN"), "Roboto-Regular");
    s2.putString(cTID("FntS"), "Regular");
    s2.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 24);
    s2.putInteger(sTID("tracking"), 0);
    r2.putObject(cTID("TxtS"), cTID("TxtS"), s2);
    list.putObject(cTID("Txtt"), r2);
    // "WIDE" with wide tracking (500)
    var r3 = new ActionDescriptor();
    r3.putInteger(cTID("From"), 7);
    r3.putInteger(cTID("T   "), 11);
    var s3 = new ActionDescriptor();
    s3.putString(cTID("FntN"), "Roboto-Bold");
    s3.putString(cTID("FntS"), "Bold");
    s3.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 24);
    s3.putInteger(sTID("tracking"), 500);
    r3.putObject(cTID("TxtS"), cTID("TxtS"), s3);
    list.putObject(cTID("Txtt"), r3);
    txDesc.putList(cTID("Txtt"), list);
    desc.putObject(cTID("T   "), cTID("TxLr"), txDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "text/per_char_tracking"); ok++;
})();}catch(e){fail++; $.writeln("per_char_tracking: "+e);}

// ==========================================
// 16. text/per_char_baseline_shift — Different baseline shift per character
//     Descriptor: TxtS with baselineShift UntF #Pnt
// ==========================================
try{(function(){
    var d = app.documents.add(400, 200, 72, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "WAVE";
    layer.textItem.position = [30, 120];
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(cTID("Prpr"), cTID("TxLr"));
    ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    desc.putReference(cTID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    var shifts = [0, 10, -5, 15]; // different baseline shifts
    for (var i = 0; i < 4; i++) {
        var r = new ActionDescriptor();
        r.putInteger(cTID("From"), i);
        r.putInteger(cTID("T   "), i + 1);
        var s = new ActionDescriptor();
        s.putString(cTID("FntN"), "Roboto-Bold");
        s.putString(cTID("FntS"), "Bold");
        s.putUnitDouble(cTID("Sz  "), cTID("#Pnt"), 30);
        s.putUnitDouble(sTID("baselineShift"), cTID("#Pnt"), shifts[i]);
        r.putObject(cTID("TxtS"), cTID("TxtS"), s);
        list.putObject(cTID("Txtt"), r);
    }
    txDesc.putList(cTID("Txtt"), list);
    desc.putObject(cTID("T   "), cTID("TxLr"), txDesc);
    executeAction(cTID("setd"), desc, DialogModes.NO);
    savePsd(d, "text/per_char_baseline_shift"); ok++;
})();}catch(e){fail++; $.writeln("per_char_baseline_shift: "+e);}

// ==========================================
// 17. smart/filter_blend — Smart filter with non-default blend mode and opacity
//     Descriptor: SmFl with blend mode enum and opacity UntF
// ==========================================
try{(function(){
    var d = newDoc();
    var layer = addColorLayer(d, 128, 100, 200, "To Smartify");
    // Convert to smart object
    executeAction(sTID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    // Apply Gaussian Blur smart filter
    var gbDesc = new ActionDescriptor();
    gbDesc.putUnitDouble(cTID("Rds "), cTID("#Pxl"), 5.0);
    executeAction(cTID("GsnB"), gbDesc, DialogModes.NO);
    // Change smart filter blend mode and opacity
    // Select the smart filter
    var blendDesc = new ActionDescriptor();
    var blendRef = new ActionReference();
    blendRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    blendDesc.putReference(cTID("null"), blendRef);
    var filterBlend = new ActionDescriptor();
    filterBlend.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    filterBlend.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    blendDesc.putObject(sTID("filterFXStyle"), sTID("filterFXStyle"), filterBlend);
    try {
        executeAction(cTID("setd"), blendDesc, DialogModes.NO);
    } catch(e2) { /* blend mode change might not work on all versions */ }
    savePsd(d, "smart/filter_blend"); ok++;
})();}catch(e){fail++; $.writeln("filter_blend: "+e);}

// ==========================================
// 18. mask/vector_compound — Compound vector mask (rect + ellipse combined)
//     Descriptor: multiple path components in vmsk with path operations
// ==========================================
try{(function(){
    var d = newDoc();
    // Create shape with first rect
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID("null"), ref1);
    var sd1 = new ActionDescriptor();
    var cd1 = new ActionDescriptor(); cd1.putDouble(cTID("Rd  "), 255); cd1.putDouble(cTID("Grn "), 80); cd1.putDouble(cTID("Bl  "), 80);
    var sol1 = new ActionDescriptor(); sol1.putObject(cTID("Clr "), cTID("RGBC"), cd1);
    sd1.putObject(cTID("Type"), sTID("solidColorLayer"), sol1);
    var r1 = new ActionDescriptor();
    r1.putUnitDouble(cTID("Top "), cTID("#Pxl"), 20);
    r1.putUnitDouble(cTID("Left"), cTID("#Pxl"), 20);
    r1.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 180);
    r1.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 180);
    sd1.putObject(cTID("Shp "), cTID("Rctn"), r1);
    desc1.putObject(cTID("Usng"), sTID("contentLayer"), sd1);
    executeAction(cTID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Compound Mask";
    // Add ellipse to same path (combine/union)
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID("Path"), cTID("Ordn"), cTID("Trgt"));
    desc2.putReference(cTID("null"), ref2);
    var e = new ActionDescriptor();
    e.putUnitDouble(cTID("Top "), cTID("#Pxl"), 60);
    e.putUnitDouble(cTID("Left"), cTID("#Pxl"), 80);
    e.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 200);
    e.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 200);
    desc2.putObject(cTID("T   "), cTID("Elps"), e);
    executeAction(sTID("addTo"), desc2, DialogModes.NO);
    savePsd(d, "mask/vector_compound"); ok++;
})();}catch(e){fail++; $.writeln("vector_compound: "+e);}

// ==========================================
// 19. shape/path_subtract — Shape with path subtraction
//     Descriptor: path with subtract operation — different path op descriptor
// ==========================================
try{(function(){
    var d = newDoc();
    // Create outer rect
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID("null"), ref1);
    var sd1 = new ActionDescriptor();
    var cd1 = new ActionDescriptor(); cd1.putDouble(cTID("Rd  "), 0); cd1.putDouble(cTID("Grn "), 150); cd1.putDouble(cTID("Bl  "), 200);
    var sol1 = new ActionDescriptor(); sol1.putObject(cTID("Clr "), cTID("RGBC"), cd1);
    sd1.putObject(cTID("Type"), sTID("solidColorLayer"), sol1);
    var r1 = new ActionDescriptor();
    r1.putUnitDouble(cTID("Top "), cTID("#Pxl"), 10);
    r1.putUnitDouble(cTID("Left"), cTID("#Pxl"), 10);
    r1.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 190);
    r1.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 190);
    sd1.putObject(cTID("Shp "), cTID("Rctn"), r1);
    desc1.putObject(cTID("Usng"), sTID("contentLayer"), sd1);
    executeAction(cTID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Subtracted Shape";
    // Subtract inner circle
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID("Path"), cTID("Ordn"), cTID("Trgt"));
    desc2.putReference(cTID("null"), ref2);
    var e = new ActionDescriptor();
    e.putUnitDouble(cTID("Top "), cTID("#Pxl"), 50);
    e.putUnitDouble(cTID("Left"), cTID("#Pxl"), 50);
    e.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 150);
    e.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 150);
    desc2.putObject(cTID("T   "), cTID("Elps"), e);
    executeAction(sTID("subtractFrom"), desc2, DialogModes.NO);
    savePsd(d, "shape/path_subtract"); ok++;
})();}catch(e){fail++; $.writeln("path_subtract: "+e);}

// ==========================================
// 20. shape/path_intersect — Shape with intersect operation
//     Descriptor: path with intersect operation
// ==========================================
try{(function(){
    var d = newDoc();
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID("null"), ref1);
    var sd1 = new ActionDescriptor();
    var cd1 = new ActionDescriptor(); cd1.putDouble(cTID("Rd  "), 200); cd1.putDouble(cTID("Grn "), 0); cd1.putDouble(cTID("Bl  "), 100);
    var sol1 = new ActionDescriptor(); sol1.putObject(cTID("Clr "), cTID("RGBC"), cd1);
    sd1.putObject(cTID("Type"), sTID("solidColorLayer"), sol1);
    var r1 = new ActionDescriptor();
    r1.putUnitDouble(cTID("Top "), cTID("#Pxl"), 10);
    r1.putUnitDouble(cTID("Left"), cTID("#Pxl"), 10);
    r1.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 150);
    r1.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 150);
    sd1.putObject(cTID("Shp "), cTID("Rctn"), r1);
    desc1.putObject(cTID("Usng"), sTID("contentLayer"), sd1);
    executeAction(cTID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Intersected Shape";
    // Intersect with offset circle
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID("Path"), cTID("Ordn"), cTID("Trgt"));
    desc2.putReference(cTID("null"), ref2);
    var e = new ActionDescriptor();
    e.putUnitDouble(cTID("Top "), cTID("#Pxl"), 50);
    e.putUnitDouble(cTID("Left"), cTID("#Pxl"), 50);
    e.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 190);
    e.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 190);
    desc2.putObject(cTID("T   "), cTID("Elps"), e);
    executeAction(sTID("intersectWith"), desc2, DialogModes.NO);
    savePsd(d, "shape/path_intersect"); ok++;
})();}catch(e){fail++; $.writeln("path_intersect: "+e);}

// ==========================================
// 21. adjustment/color_balance — Color Balance with per-tonal-range values
//     Descriptor: ClrB with ShdC/MdtC/HghC lists and PrsL bool
// ==========================================
try{(function(){
    var d = newDoc();
    addColorLayer(d, 150, 150, 150, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(cTID("AdjL"));
    desc.putReference(cTID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cbDesc = new ActionDescriptor();
    // Shadows: shift toward blue and cyan
    var shdList = new ActionList();
    shdList.putInteger(-10); shdList.putInteger(0); shdList.putInteger(15);
    cbDesc.putList(cTID("ShdC"), shdList);
    // Midtones: shift toward red and yellow
    var mdtList = new ActionList();
    mdtList.putInteger(20); mdtList.putInteger(0); mdtList.putInteger(-15);
    cbDesc.putList(cTID("MdtC"), mdtList);
    // Highlights: shift toward green
    var hghList = new ActionList();
    hghList.putInteger(0); hghList.putInteger(10); hghList.putInteger(0);
    cbDesc.putList(cTID("HghC"), hghList);
    cbDesc.putBoolean(cTID("PrsL"), true); // preserve luminosity
    adjDesc.putObject(cTID("Type"), cTID("ClrB"), cbDesc);
    desc.putObject(cTID("Usng"), cTID("AdjL"), adjDesc);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment/color_balance_full"); ok++;
})();}catch(e){fail++; $.writeln("color_balance_full: "+e);}

// ==========================================
// 22. document/resolution_mixed — Document with non-standard DPI and pixel aspect
//     Descriptor: exercises ResI (resolution info) with different UntF #Rsl values
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 144, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    addColorLayer(d, 100, 200, 150, "Content");
    d.pixelAspectRatio = 1.2; // non-square pixels
    savePsd(d, "document/resolution_144dpi"); ok++;
})();}catch(e){fail++; $.writeln("resolution_144dpi: "+e);}

"gen_desc2 done: " + ok + " ok, " + fail + " fail";
