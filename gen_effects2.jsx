// gen_effects2.jsx - More layer effects and styles
var basePath = "C:/Users/tasuku/com/github/signal-slot/psd-zoo/";
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

// 1. Satin effect
try{(function(){
    var d = app.documents.add(200,200,72,"effect_satin",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 50, 150, "Satin");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var satin = new ActionDescriptor();
    satin.putBoolean(charIDToTypeID("enab"), true);
    satin.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    satin.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    satin.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    satin.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 19);
    satin.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 11);
    satin.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 14);
    satin.putBoolean(charIDToTypeID("AntA"), true);
    satin.putBoolean(charIDToTypeID("Invr"), true);
    fx.putObject(charIDToTypeID("ChFX"), charIDToTypeID("ChFX"), satin);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "effect_satin"); ok++;
})();}catch(e){fail++; $.writeln("satin: "+e);}

// 2. Pattern overlay effect
try{(function(){
    var d = app.documents.add(200,200,72,"effect_pattern_overlay",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 80, 120, 200, "PatternOverlay");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var po = new ActionDescriptor();
    po.putBoolean(charIDToTypeID("enab"), true);
    po.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    po.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    po.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    po.putBoolean(charIDToTypeID("Algn"), true);
    fx.putObject(charIDToTypeID("patternFill"), charIDToTypeID("patternFill"), po);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "effect_pattern_overlay"); ok++;
})();}catch(e){fail++; $.writeln("pattern_overlay: "+e);}

// 3. Stroke inside
try{(function(){
    var d = app.documents.add(200,200,72,"stroke_inside",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 150, 100, "StrokeInside");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("InsF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 5);
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "stroke_inside"); ok++;
})();}catch(e){fail++; $.writeln("stroke_inside: "+e);}

// 4. Stroke outside
try{(function(){
    var d = app.documents.add(200,200,72,"stroke_outside",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 150, 100, "StrokeOutside");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 5);
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 255);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "stroke_outside"); ok++;
})();}catch(e){fail++; $.writeln("stroke_outside: "+e);}

// 5. Stroke center
try{(function(){
    var d = app.documents.add(200,200,72,"stroke_center",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 150, 100, "StrokeCenter");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("CtrF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 5);
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 128);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "stroke_center"); ok++;
})();}catch(e){fail++; $.writeln("stroke_center: "+e);}

// 6. Global Light setting (via drop shadow with use global light)
try{(function(){
    var d = app.documents.add(200,200,72,"global_light",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 200, 100, 100, "GlobalLight");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Set global angle
    var glAng = new ActionDescriptor();
    glAng.putUnitDouble(charIDToTypeID("gblA"), charIDToTypeID("#Ang"), 45);
    fx.putUnitDouble(charIDToTypeID("gblA"), charIDToTypeID("#Ang"), 45);
    // Drop shadow using global light
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putBoolean(charIDToTypeID("uglg"), true); // use global light
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 45);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    ds.putBoolean(charIDToTypeID("AntA"), false);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "global_light"); ok++;
})();}catch(e){fail++; $.writeln("global_light: "+e);}

// 7. Bevel emboss with texture
try{(function(){
    var d = app.documents.add(200,200,72,"bevel_texture",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 150, 100, 50, "BevelTexture");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("InrB")); // inner bevel
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL")); // smooth
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    // Highlight
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255);
    hlClr.putDouble(charIDToTypeID("Grn "), 255);
    hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    // Shadow
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0);
    swClr.putDouble(charIDToTypeID("Grn "), 0);
    swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    // Enable texture sub-effect
    bev.putBoolean(stringIDToTypeID("useTexture"), true);
    bev.putUnitDouble(stringIDToTypeID("textureScale"), charIDToTypeID("#Prc"), 100);
    bev.putInteger(stringIDToTypeID("textureDepth"), 100);
    bev.putBoolean(stringIDToTypeID("invertTexture"), false);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_texture"); ok++;
})();}catch(e){fail++; $.writeln("bevel_texture: "+e);}

// 8. Bevel emboss - Outer Bevel style
try{(function(){
    var d = app.documents.add(200,200,72,"bevel_outer",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 100, "OuterBevel");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("OtrB")); // outer bevel
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL"));
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255);
    hlClr.putDouble(charIDToTypeID("Grn "), 255);
    hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0);
    swClr.putDouble(charIDToTypeID("Grn "), 0);
    swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_outer"); ok++;
})();}catch(e){fail++; $.writeln("bevel_outer: "+e);}

// 9. Bevel emboss - Emboss style
try{(function(){
    var d = app.documents.add(200,200,72,"bevel_emboss_style",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 100, 200, "Emboss");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("Embs")); // emboss
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL"));
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 8);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255);
    hlClr.putDouble(charIDToTypeID("Grn "), 255);
    hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0);
    swClr.putDouble(charIDToTypeID("Grn "), 0);
    swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_emboss_style"); ok++;
})();}catch(e){fail++; $.writeln("bevel_emboss_style: "+e);}

// 10. Bevel emboss - Pillow Emboss
try{(function(){
    var d = app.documents.add(200,200,72,"bevel_pillow",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 200, 100, 200, "Pillow");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("PlEb")); // pillow emboss
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL"));
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255);
    hlClr.putDouble(charIDToTypeID("Grn "), 255);
    hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0);
    swClr.putDouble(charIDToTypeID("Grn "), 0);
    swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_pillow"); ok++;
})();}catch(e){fail++; $.writeln("bevel_pillow: "+e);}

// 11. Bevel emboss - Stroke Emboss
try{(function(){
    var d = app.documents.add(200,200,72,"bevel_stroke_emboss",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 200, "StrokeEmboss");
    d.activeLayer = layer;
    // First add a stroke
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref1.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc1.putReference(charIDToTypeID("null"), ref1);
    var fx1 = new ActionDescriptor();
    fx1.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Stroke
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 8);
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 200);
    clr.putDouble(charIDToTypeID("Grn "), 150);
    clr.putDouble(charIDToTypeID("Bl  "), 50);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    fx1.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    // Bevel stroke emboss
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), stringIDToTypeID("strokeEmboss"));
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL"));
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255);
    hlClr.putDouble(charIDToTypeID("Grn "), 255);
    hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0);
    swClr.putDouble(charIDToTypeID("Grn "), 0);
    swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx1.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc1.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx1);
    executeAction(charIDToTypeID("setd"), desc1, DialogModes.NO);
    savePsd(d, "bevel_stroke_emboss"); ok++;
})();}catch(e){fail++; $.writeln("bevel_stroke_emboss: "+e);}

// 12. Drop shadow with spread (choke)
try{(function(){
    var d = app.documents.add(200,200,72,"drop_shadow_spread",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 180, 50, 50, "Spread");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putBoolean(charIDToTypeID("uglg"), true);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 50); // spread/choke = 50%
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 15);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    ds.putBoolean(charIDToTypeID("AntA"), false);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "drop_shadow_spread"); ok++;
})();}catch(e){fail++; $.writeln("drop_shadow_spread: "+e);}

// 13. Drop shadow with noise
try{(function(){
    var d = app.documents.add(200,200,72,"drop_shadow_noise",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 50, 180, "Noise");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putBoolean(charIDToTypeID("uglg"), true);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 50); // 50% noise
    ds.putBoolean(charIDToTypeID("AntA"), true);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "drop_shadow_noise"); ok++;
})();}catch(e){fail++; $.writeln("drop_shadow_noise: "+e);}

// 14. Outer glow with spread
try{(function(){
    var d = app.documents.add(200,200,72,"outer_glow_spread",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 50, 200, "GlowSpread");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(charIDToTypeID("enab"), true);
    og.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255);
    clr.putDouble(charIDToTypeID("Grn "), 255);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    og.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    og.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    og.putEnumerated(charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL"));
    og.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 50); // spread
    og.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 20);
    og.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    og.putBoolean(charIDToTypeID("AntA"), false);
    fx.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), og);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "outer_glow_spread"); ok++;
})();}catch(e){fail++; $.writeln("outer_glow_spread: "+e);}

// 15. Inner glow with source center
try{(function(){
    var d = app.documents.add(200,200,72,"inner_glow_center",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 50, "GlowCenter");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(charIDToTypeID("enab"), true);
    ig.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255);
    clr.putDouble(charIDToTypeID("Grn "), 200);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    ig.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ig.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ig.putEnumerated(charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL"));
    ig.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ig.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 20);
    ig.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    ig.putBoolean(charIDToTypeID("AntA"), false);
    ig.putEnumerated(charIDToTypeID("glwS"), charIDToTypeID("IGSr"), charIDToTypeID("SrcC")); // source: center
    fx.putObject(charIDToTypeID("IrGl"), charIDToTypeID("IrGl"), ig);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "inner_glow_center"); ok++;
})();}catch(e){fail++; $.writeln("inner_glow_center: "+e);}

// 16. All effects combined on one layer
try{(function(){
    var d = app.documents.add(300,300,72,"effect_all_combined",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 150, 200, "AllEffects");
    // Make it smaller for visible effects
    d.activeLayer = layer;
    d.selection.selectAll();
    d.selection.fill(new SolidColor()); // Clear
    d.selection.deselect();
    // Draw a centered rectangle
    var r = [[50,50],[250,50],[250,250],[50,250]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=100; c.rgb.green=150; c.rgb.blue=200;
    d.selection.fill(c);
    d.selection.deselect();

    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Drop shadow
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr1 = new ActionDescriptor(); clr1.putDouble(charIDToTypeID("Rd  "), 0); clr1.putDouble(charIDToTypeID("Grn "), 0); clr1.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr1);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    // Inner shadow
    var is = new ActionDescriptor();
    is.putBoolean(charIDToTypeID("enab"), true);
    is.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr2 = new ActionDescriptor(); clr2.putDouble(charIDToTypeID("Rd  "), 0); clr2.putDouble(charIDToTypeID("Grn "), 0); clr2.putDouble(charIDToTypeID("Bl  "), 0);
    is.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr2);
    is.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 35);
    is.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    is.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 3);
    is.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    is.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    fx.putObject(charIDToTypeID("IrSh"), charIDToTypeID("IrSh"), is);
    // Outer glow
    var og = new ActionDescriptor();
    og.putBoolean(charIDToTypeID("enab"), true);
    og.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var clr3 = new ActionDescriptor(); clr3.putDouble(charIDToTypeID("Rd  "), 255); clr3.putDouble(charIDToTypeID("Grn "), 255); clr3.putDouble(charIDToTypeID("Bl  "), 100);
    og.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr3);
    og.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    og.putEnumerated(charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL"));
    og.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    og.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    fx.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), og);
    // Inner glow
    var ig = new ActionDescriptor();
    ig.putBoolean(charIDToTypeID("enab"), true);
    ig.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var clr4 = new ActionDescriptor(); clr4.putDouble(charIDToTypeID("Rd  "), 255); clr4.putDouble(charIDToTypeID("Grn "), 200); clr4.putDouble(charIDToTypeID("Bl  "), 0);
    ig.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr4);
    ig.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    ig.putEnumerated(charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL"));
    ig.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ig.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    ig.putEnumerated(charIDToTypeID("glwS"), charIDToTypeID("IGSr"), charIDToTypeID("SrcE"));
    fx.putObject(charIDToTypeID("IrGl"), charIDToTypeID("IrGl"), ig);
    // Bevel emboss
    var bev = new ActionDescriptor();
    bev.putBoolean(charIDToTypeID("enab"), true);
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("InrB"));
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SfBL"));
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 3);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hl = new ActionDescriptor(); hl.putDouble(charIDToTypeID("Rd  "), 255); hl.putDouble(charIDToTypeID("Grn "), 255); hl.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hl);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 50);
    var sw = new ActionDescriptor(); sw.putDouble(charIDToTypeID("Rd  "), 0); sw.putDouble(charIDToTypeID("Grn "), 0); sw.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), sw);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 50);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    // Satin
    var sat = new ActionDescriptor();
    sat.putBoolean(charIDToTypeID("enab"), true);
    sat.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr5 = new ActionDescriptor(); clr5.putDouble(charIDToTypeID("Rd  "), 0); clr5.putDouble(charIDToTypeID("Grn "), 0); clr5.putDouble(charIDToTypeID("Bl  "), 0);
    sat.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr5);
    sat.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 30);
    sat.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 19);
    sat.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 8);
    sat.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 8);
    fx.putObject(charIDToTypeID("ChFX"), charIDToTypeID("ChFX"), sat);
    // Color overlay
    var co = new ActionDescriptor();
    co.putBoolean(charIDToTypeID("enab"), true);
    co.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    var clr6 = new ActionDescriptor(); clr6.putDouble(charIDToTypeID("Rd  "), 80); clr6.putDouble(charIDToTypeID("Grn "), 120); clr6.putDouble(charIDToTypeID("Bl  "), 200);
    co.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr6);
    co.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 30);
    fx.putObject(charIDToTypeID("SoFi"), charIDToTypeID("SoFi"), co);
    // Stroke
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 2);
    var clr7 = new ActionDescriptor(); clr7.putDouble(charIDToTypeID("Rd  "), 50); clr7.putDouble(charIDToTypeID("Grn "), 50); clr7.putDouble(charIDToTypeID("Bl  "), 50);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr7);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "effect_all_combined"); ok++;
})();}catch(e){fail++; $.writeln("effect_all_combined: "+e);}

alert("gen_effects2 done: " + ok + " ok, " + fail + " fail");
