// gen_adj2.jsx - More adjustment layers and advanced features
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

// 1. Channel Mixer adjustment layer
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_channel_mixer",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 50, "Content");
    // Channel Mixer via action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cmDesc = new ActionDescriptor();
    cmDesc.putBoolean(charIDToTypeID("Mnch"), false); // monochrome
    // Red output channel
    var rl = new ActionList();
    rl.putUnitDouble(charIDToTypeID("#Prc"), 120);  // Red from Red
    rl.putUnitDouble(charIDToTypeID("#Prc"), -10);   // Red from Green
    rl.putUnitDouble(charIDToTypeID("#Prc"), -10);   // Red from Blue
    cmDesc.putList(charIDToTypeID("Rd  "), rl);
    // Green output
    var gl = new ActionList();
    gl.putUnitDouble(charIDToTypeID("#Prc"), -10);
    gl.putUnitDouble(charIDToTypeID("#Prc"), 120);
    gl.putUnitDouble(charIDToTypeID("#Prc"), -10);
    cmDesc.putList(charIDToTypeID("Grn "), gl);
    // Blue output
    var bl = new ActionList();
    bl.putUnitDouble(charIDToTypeID("#Prc"), -10);
    bl.putUnitDouble(charIDToTypeID("#Prc"), -10);
    bl.putUnitDouble(charIDToTypeID("#Prc"), 120);
    cmDesc.putList(charIDToTypeID("Bl  "), bl);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("ChnM"), cmDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_channel_mixer"); ok++;
})();}catch(e){fail++; $.writeln("channel_mixer: "+e);}

// 2. Channel Mixer - Monochrome
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_channel_mixer_mono",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 50, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cmDesc = new ActionDescriptor();
    cmDesc.putBoolean(charIDToTypeID("Mnch"), true); // monochrome
    var gl = new ActionList();
    gl.putUnitDouble(charIDToTypeID("#Prc"), 40);
    gl.putUnitDouble(charIDToTypeID("#Prc"), 40);
    gl.putUnitDouble(charIDToTypeID("#Prc"), 20);
    cmDesc.putList(charIDToTypeID("Gry "), gl);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("ChnM"), cmDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_channel_mixer_mono"); ok++;
})();}catch(e){fail++; $.writeln("channel_mixer_mono: "+e);}

// 3. Solid Color fill layer (adjustment)
try{(function(){
    var d = app.documents.add(200,200,72,"fill_solid_color",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 100);
    clr.putDouble(charIDToTypeID("Grn "), 50);
    clr.putDouble(charIDToTypeID("Bl  "), 200);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    fillDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), fillDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "fill_solid_color"); ok++;
})();}catch(e){fail++; $.writeln("fill_solid_color: "+e);}

// 4. Gradient fill layer
try{(function(){
    var d = app.documents.add(200,200,72,"fill_gradient_layer",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var gradContent = new ActionDescriptor();
    gradContent.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    gradContent.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    // Gradient
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Custom Grad");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor();
    var clr1 = new ActionDescriptor();
    clr1.putDouble(charIDToTypeID("Rd  "), 255); clr1.putDouble(charIDToTypeID("Grn "), 100); clr1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0);
    c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var clr2 = new ActionDescriptor();
    clr2.putDouble(charIDToTypeID("Rd  "), 0); clr2.putDouble(charIDToTypeID("Grn "), 100); clr2.putDouble(charIDToTypeID("Bl  "), 255);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096);
    c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    grad.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor();
    t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor();
    t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t2);
    grad.putList(charIDToTypeID("Trns"), trList);
    gradContent.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    fillDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gradContent);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), fillDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "fill_gradient_layer"); ok++;
})();}catch(e){fail++; $.writeln("fill_gradient_layer: "+e);}

// 5. Pattern fill layer
try{(function(){
    var d = app.documents.add(200,200,72,"fill_pattern_layer",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fillDesc = new ActionDescriptor();
    var patContent = new ActionDescriptor();
    patContent.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    fillDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("patternLayer"), patContent);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), fillDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "fill_pattern_layer"); ok++;
})();}catch(e){fail++; $.writeln("fill_pattern_layer: "+e);}

// 6. Adjustment with clipping mask
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_clipped",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 150, 200, "Base");
    // Add brightness adjustment
    var layer = d.artLayers.add();
    layer.name = "TopContent";
    d.activeLayer = layer;
    var r = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=100; c.rgb.blue=50;
    d.selection.fill(c);
    d.selection.deselect();
    // Add brightness adjustment clipped to TopContent
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var brDesc = new ActionDescriptor();
    brDesc.putInteger(charIDToTypeID("Brgh"), 50);
    brDesc.putInteger(charIDToTypeID("Cntr"), 20);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), brDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    // Create clipping mask
    var clipDesc = new ActionDescriptor();
    var clipRef = new ActionReference();
    clipRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    clipDesc.putReference(charIDToTypeID("null"), clipRef);
    executeAction(stringIDToTypeID("groupEvent"), clipDesc, DialogModes.NO);
    savePsd(d, "adjustment_clipped"); ok++;
})();}catch(e){fail++; $.writeln("adjustment_clipped: "+e);}

// 7. Adjustment layer with mask
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_with_mask",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 150, 200, "Content");
    // Add brightness adjustment
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var brDesc = new ActionDescriptor();
    brDesc.putInteger(charIDToTypeID("Brgh"), 80);
    brDesc.putInteger(charIDToTypeID("Cntr"), 0);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), brDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    // Select left half for mask
    d.selection.select([[0,0],[100,0],[100,200],[0,200]]);
    // Fill mask with black (hide left side)
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "adjustment_with_mask"); ok++;
})();}catch(e){fail++; $.writeln("adjustment_with_mask: "+e);}

// 8. Multiple adjustment layers stacked
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_stack",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 150, 200, "Content");
    // Brightness
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(charIDToTypeID("AdjL"));
    desc1.putReference(charIDToTypeID("null"), ref1);
    var adj1 = new ActionDescriptor();
    var br = new ActionDescriptor();
    br.putInteger(charIDToTypeID("Brgh"), 30);
    br.putInteger(charIDToTypeID("Cntr"), 10);
    adj1.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), br);
    desc1.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adj1);
    executeAction(charIDToTypeID("Mk  "), desc1, DialogModes.NO);
    // Hue/Saturation
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putClass(charIDToTypeID("AdjL"));
    desc2.putReference(charIDToTypeID("null"), ref2);
    var adj2 = new ActionDescriptor();
    var hs = new ActionDescriptor();
    hs.putEnumerated(charIDToTypeID("Presetind"), charIDToTypeID("Presetind"), charIDToTypeID("Presetind"));
    var hsl = new ActionList();
    var master = new ActionDescriptor();
    master.putInteger(charIDToTypeID("H   "), 20);
    master.putInteger(charIDToTypeID("Strt"), 30);
    master.putInteger(charIDToTypeID("Lght"), 0);
    hsl.putObject(charIDToTypeID("HStA"), master);
    hs.putList(charIDToTypeID("Adjs"), hsl);
    adj2.putObject(charIDToTypeID("Type"), charIDToTypeID("HStr"), hs);
    desc2.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adj2);
    executeAction(charIDToTypeID("Mk  "), desc2, DialogModes.NO);
    // Curves
    var desc3 = new ActionDescriptor();
    var ref3 = new ActionReference();
    ref3.putClass(charIDToTypeID("AdjL"));
    desc3.putReference(charIDToTypeID("null"), ref3);
    var adj3 = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var ch = new ActionDescriptor();
    var crvRef = new ActionReference();
    crvRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Cmps"));
    ch.putReference(charIDToTypeID("Chnl"), crvRef);
    var ptList = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(charIDToTypeID("Hrzn"), 0); p1.putDouble(charIDToTypeID("Vrtc"), 0);
    ptList.putObject(charIDToTypeID("Pnt "), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(charIDToTypeID("Hrzn"), 64); p2.putDouble(charIDToTypeID("Vrtc"), 80);
    ptList.putObject(charIDToTypeID("Pnt "), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(charIDToTypeID("Hrzn"), 192); p3.putDouble(charIDToTypeID("Vrtc"), 170);
    ptList.putObject(charIDToTypeID("Pnt "), p3);
    var p4 = new ActionDescriptor(); p4.putDouble(charIDToTypeID("Hrzn"), 255); p4.putDouble(charIDToTypeID("Vrtc"), 255);
    ptList.putObject(charIDToTypeID("Pnt "), p4);
    ch.putList(charIDToTypeID("Crv "), ptList);
    chList.putObject(charIDToTypeID("CrvA"), ch);
    cv.putList(charIDToTypeID("Adjs"), chList);
    adj3.putObject(charIDToTypeID("Type"), charIDToTypeID("Crvs"), cv);
    desc3.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adj3);
    executeAction(charIDToTypeID("Mk  "), desc3, DialogModes.NO);
    savePsd(d, "adjustment_stack"); ok++;
})();}catch(e){fail++; $.writeln("adjustment_stack: "+e);}

// 9. Levels per-channel
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_levels_perchannel",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var lvl = new ActionDescriptor();
    var adjList = new ActionList();
    // Red channel
    var r = new ActionDescriptor();
    var rRef = new ActionReference();
    rRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Rd  "));
    r.putReference(charIDToTypeID("Chnl"), rRef);
    var rInp = new ActionList(); rInp.putInteger(20); rInp.putInteger(235);
    r.putList(charIDToTypeID("Inpt"), rInp);
    var rOut = new ActionList(); rOut.putInteger(10); rOut.putInteger(245);
    r.putList(charIDToTypeID("Otpt"), rOut);
    r.putDouble(charIDToTypeID("Gmm "), 1.2);
    adjList.putObject(charIDToTypeID("LvlA"), r);
    // Green channel
    var g = new ActionDescriptor();
    var gRef = new ActionReference();
    gRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Grn "));
    g.putReference(charIDToTypeID("Chnl"), gRef);
    var gInp = new ActionList(); gInp.putInteger(10); gInp.putInteger(240);
    g.putList(charIDToTypeID("Inpt"), gInp);
    var gOut = new ActionList(); gOut.putInteger(0); gOut.putInteger(255);
    g.putList(charIDToTypeID("Otpt"), gOut);
    g.putDouble(charIDToTypeID("Gmm "), 0.9);
    adjList.putObject(charIDToTypeID("LvlA"), g);
    // Blue channel
    var b = new ActionDescriptor();
    var bRef = new ActionReference();
    bRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Bl  "));
    b.putReference(charIDToTypeID("Chnl"), bRef);
    var bInp = new ActionList(); bInp.putInteger(0); bInp.putInteger(200);
    b.putList(charIDToTypeID("Inpt"), bInp);
    var bOut = new ActionList(); bOut.putInteger(20); bOut.putInteger(255);
    b.putList(charIDToTypeID("Otpt"), bOut);
    b.putDouble(charIDToTypeID("Gmm "), 1.0);
    adjList.putObject(charIDToTypeID("LvlA"), b);
    lvl.putList(charIDToTypeID("Adjs"), adjList);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Lvls"), lvl);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_levels_perchannel"); ok++;
})();}catch(e){fail++; $.writeln("levels_perchannel: "+e);}

// 10. Curves per-channel
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_curves_perchannel",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var channels = [charIDToTypeID("Rd  "), charIDToTypeID("Grn "), charIDToTypeID("Bl  ")];
    var mids = [140, 100, 170]; // different midtone adjustments per channel
    for(var i = 0; i < 3; i++){
        var ch = new ActionDescriptor();
        var cRef = new ActionReference();
        cRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), channels[i]);
        ch.putReference(charIDToTypeID("Chnl"), cRef);
        var ptList = new ActionList();
        var p1 = new ActionDescriptor(); p1.putDouble(charIDToTypeID("Hrzn"), 0); p1.putDouble(charIDToTypeID("Vrtc"), 0);
        ptList.putObject(charIDToTypeID("Pnt "), p1);
        var p2 = new ActionDescriptor(); p2.putDouble(charIDToTypeID("Hrzn"), 128); p2.putDouble(charIDToTypeID("Vrtc"), mids[i]);
        ptList.putObject(charIDToTypeID("Pnt "), p2);
        var p3 = new ActionDescriptor(); p3.putDouble(charIDToTypeID("Hrzn"), 255); p3.putDouble(charIDToTypeID("Vrtc"), 255);
        ptList.putObject(charIDToTypeID("Pnt "), p3);
        ch.putList(charIDToTypeID("Crv "), ptList);
        chList.putObject(charIDToTypeID("CrvA"), ch);
    }
    cv.putList(charIDToTypeID("Adjs"), chList);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("Crvs"), cv);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_curves_perchannel"); ok++;
})();}catch(e){fail++; $.writeln("curves_perchannel: "+e);}

// 11. Disabled adjustment layer
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_disabled",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var brDesc = new ActionDescriptor();
    brDesc.putInteger(charIDToTypeID("Brgh"), 80);
    brDesc.putInteger(charIDToTypeID("Cntr"), 50);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), brDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    // Hide the adjustment layer
    d.activeLayer.visible = false;
    savePsd(d, "adjustment_disabled"); ok++;
})();}catch(e){fail++; $.writeln("adjustment_disabled: "+e);}

// 12. Hue/Saturation colorize
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_hue_colorize",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 100, 200, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var hs = new ActionDescriptor();
    hs.putBoolean(stringIDToTypeID("colorize"), true);
    var hsl = new ActionList();
    var master = new ActionDescriptor();
    master.putInteger(charIDToTypeID("H   "), 200); // blue-ish
    master.putInteger(charIDToTypeID("Strt"), 50);
    master.putInteger(charIDToTypeID("Lght"), 0);
    hsl.putObject(charIDToTypeID("HStA"), master);
    hs.putList(charIDToTypeID("Adjs"), hsl);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("HStr"), hs);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_hue_colorize"); ok++;
})();}catch(e){fail++; $.writeln("hue_colorize: "+e);}

// 13. Selective Color adjustment - per color
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_selective_perchannel",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 100, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var sc = new ActionDescriptor();
    // Set for Reds
    var adjList = new ActionList();
    var red = new ActionDescriptor();
    red.putEnumerated(charIDToTypeID("Clrs"), charIDToTypeID("Clrs"), charIDToTypeID("Rds "));
    red.putUnitDouble(charIDToTypeID("Cyn "), charIDToTypeID("#Prc"), -30);
    red.putUnitDouble(charIDToTypeID("Mgnt"), charIDToTypeID("#Prc"), 10);
    red.putUnitDouble(charIDToTypeID("Ylw "), charIDToTypeID("#Prc"), 20);
    red.putUnitDouble(charIDToTypeID("Bk  "), charIDToTypeID("#Prc"), 0);
    adjList.putObject(charIDToTypeID("ClrC"), red);
    sc.putList(charIDToTypeID("Adjs"), adjList);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("SlcC"), sc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_selective_perchannel"); ok++;
})();}catch(e){fail++; $.writeln("selective_perchannel: "+e);}

// 14. Brightness/Contrast legacy mode
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_brightness_legacy",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 150, 150, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var brDesc = new ActionDescriptor();
    brDesc.putInteger(charIDToTypeID("Brgh"), 50);
    brDesc.putInteger(charIDToTypeID("Cntr"), 50);
    brDesc.putBoolean(stringIDToTypeID("useLegacy"), true);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("BrgC"), brDesc);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_brightness_legacy"); ok++;
})();}catch(e){fail++; $.writeln("brightness_legacy: "+e);}

// 15. Photo Filter with custom color
try{(function(){
    var d = app.documents.add(200,200,72,"adjustment_photo_filter_custom",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 150, 200, 100, "Content");
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("AdjL"));
    desc.putReference(charIDToTypeID("null"), ref);
    var adjDesc = new ActionDescriptor();
    var pf = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255);
    clr.putDouble(charIDToTypeID("Grn "), 128);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    pf.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    pf.putUnitDouble(charIDToTypeID("Dnst"), charIDToTypeID("#Prc"), 40);
    pf.putBoolean(charIDToTypeID("Lmns"), true);
    adjDesc.putObject(charIDToTypeID("Type"), charIDToTypeID("photoFilter"), pf);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "adjustment_photo_filter_custom"); ok++;
})();}catch(e){fail++; $.writeln("photo_filter_custom: "+e);}

alert("gen_adj2 done: " + ok + " ok, " + fail + " fail");
