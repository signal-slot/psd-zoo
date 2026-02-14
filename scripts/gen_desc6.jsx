// gen_desc6.jsx - Descriptor coverage part 6:
//   Bevel styles (pillow/stroke emboss), stroke with radial gradient,
//   smart filter mask density/feather, multiple adjustments stacked,
//   high resolution documents, mask density, layer comp states,
//   clipping mask groups, vector+raster combined masks,
//   advanced blend channel restrictions, document grid settings
//
// Focuses on complex nested descriptors and uncommon property combinations.
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

// ==========================================
// 1. bevel/pillow_emboss — Pillow Emboss bevel style
//    Descriptor: bvlS enum = PlEb (Pillow Emboss)
//    No existing file tests this bevel style.
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 180, 180, 200, "Pillow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var bv = new ActionDescriptor();
    bv.putBoolean(cTID("enab"), true);
    bv.putEnumerated(cTID("bvlS"), cTID("BESl"), cTID("PlEb")); // Pillow Emboss!
    bv.putEnumerated(cTID("bvlT"), cTID("bvlT"), cTID("SfBL"));
    bv.putUnitDouble(cTID("srgR"), cTID("#Prc"), 100);
    bv.putUnitDouble(cTID("blur"), cTID("#Pxl"), 8);
    bv.putUnitDouble(cTID("Sftn"), cTID("#Pxl"), 0);
    bv.putEnumerated(cTID("bvlD"), cTID("BESs"), cTID("In  "));
    bv.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    bv.putUnitDouble(cTID("Lald"), cTID("#Ang"), 30);
    bv.putEnumerated(cTID("hglM"), cTID("BlnM"), cTID("Scrn"));
    bv.putObject(cTID("hglC"), cTID("RGBC"), makeRGBC(255, 255, 255));
    bv.putUnitDouble(cTID("hglO"), cTID("#Prc"), 75);
    bv.putEnumerated(cTID("sdwM"), cTID("BlnM"), cTID("Mltp"));
    bv.putObject(cTID("sdwC"), cTID("RGBC"), makeRGBC(0, 0, 0));
    bv.putUnitDouble(cTID("sdwO"), cTID("#Prc"), 75);
    fx.putObject(cTID("ebbl"), cTID("ebbl"), bv);
    setLayerEffects(fx);
    savePsd(doc, "bevel/pillow_emboss");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("pillow_emboss: "+e); }

// ==========================================
// 2. bevel/stroke_emboss — Stroke Emboss bevel style
//    Descriptor: bvlS enum = strkEmboss + requires stroke effect
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 200, 150, 100, "Stroke Emboss");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    // Stroke effect (required for stroke emboss)
    var fr = new ActionDescriptor();
    fr.putBoolean(cTID("enab"), true);
    fr.putEnumerated(cTID("Styl"), cTID("FStl"), cTID("OutF"));
    fr.putEnumerated(cTID("PntT"), cTID("FrFl"), cTID("SClr"));
    fr.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    fr.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    fr.putUnitDouble(cTID("Sz  "), cTID("#Pxl"), 6);
    fr.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(100, 100, 100));
    fx.putObject(cTID("FrFX"), cTID("FrFX"), fr);
    // Bevel: Stroke Emboss
    var bv = new ActionDescriptor();
    bv.putBoolean(cTID("enab"), true);
    bv.putEnumerated(cTID("bvlS"), cTID("BESl"), sTID("strokeEmboss")); // Stroke Emboss!
    bv.putEnumerated(cTID("bvlT"), cTID("bvlT"), cTID("SfBL"));
    bv.putUnitDouble(cTID("srgR"), cTID("#Prc"), 100);
    bv.putUnitDouble(cTID("blur"), cTID("#Pxl"), 4);
    bv.putUnitDouble(cTID("Sftn"), cTID("#Pxl"), 0);
    bv.putEnumerated(cTID("bvlD"), cTID("BESs"), cTID("In  "));
    bv.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    bv.putUnitDouble(cTID("Lald"), cTID("#Ang"), 30);
    bv.putEnumerated(cTID("hglM"), cTID("BlnM"), cTID("Scrn"));
    bv.putObject(cTID("hglC"), cTID("RGBC"), makeRGBC(255, 255, 255));
    bv.putUnitDouble(cTID("hglO"), cTID("#Prc"), 75);
    bv.putEnumerated(cTID("sdwM"), cTID("BlnM"), cTID("Mltp"));
    bv.putObject(cTID("sdwC"), cTID("RGBC"), makeRGBC(0, 0, 0));
    bv.putUnitDouble(cTID("sdwO"), cTID("#Prc"), 75);
    fx.putObject(cTID("ebbl"), cTID("ebbl"), bv);
    setLayerEffects(fx);
    savePsd(doc, "bevel/stroke_emboss");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("stroke_emboss: "+e); }

// ==========================================
// 3. effect/stroke_gradient_radial — Stroke with radial gradient fill
//    Descriptor: FrFX with PntT=GrFl + Type=Rdl
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 40, 40, 120, 120, 150, 150, 150, "Gradient Stroke Radial");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var fr = new ActionDescriptor();
    fr.putBoolean(cTID("enab"), true);
    fr.putEnumerated(cTID("Styl"), cTID("FStl"), cTID("OutF"));
    fr.putEnumerated(cTID("PntT"), cTID("FrFl"), cTID("GrFl")); // Gradient fill!
    fr.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Nrml"));
    fr.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    fr.putUnitDouble(cTID("Sz  "), cTID("#Pxl"), 8);
    fr.putEnumerated(cTID("Type"), cTID("GrdT"), cTID("Rdl ")); // Radial!
    fr.putUnitDouble(cTID("Angl"), cTID("#Ang"), 0);
    fr.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    fr.putBoolean(cTID("Rvrs"), false);
    fr.putBoolean(cTID("Algn"), true);
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Stroke Radial");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 0));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(200, 0, 0));
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
    fr.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fx.putObject(cTID("FrFX"), cTID("FrFX"), fr);
    setLayerEffects(fx);
    savePsd(doc, "effect/stroke_gradient_radial");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("stroke_gradient_radial: "+e); }

// ==========================================
// 4. smart/filter_mask — Smart filter with mask density and feather
//    Descriptor: filterMaskDensity doub, filterMaskFeather doub
// ==========================================
try{(function(){
    var d = newDoc(200, 200);
    fillRect(d, 0, 0, 200, 200, 100, 150, 200, "Content");
    d.activeLayer = d.artLayers[0];
    // Convert to smart object
    executeAction(sTID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    // Apply Gaussian Blur smart filter
    var blurDesc = new ActionDescriptor();
    blurDesc.putUnitDouble(cTID("Rds "), cTID("#Pxl"), 8);
    executeAction(cTID("GsnB"), blurDesc, DialogModes.NO);
    // Paint on filter mask to create partial mask
    // Select filter mask
    var selMask = new ActionDescriptor();
    var selRef = new ActionReference();
    selRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), sTID("filterMask"));
    selMask.putReference(cTID("null"), selRef);
    executeAction(cTID("slct"), selMask, DialogModes.NO);
    // Set filter mask density and feather
    var propDesc = new ActionDescriptor();
    var propRef = new ActionReference();
    propRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    propDesc.putReference(cTID("null"), propRef);
    var layerProps = new ActionDescriptor();
    layerProps.putDouble(sTID("filterMaskDensity"), 70);
    layerProps.putDouble(sTID("filterMaskFeather"), 5);
    propDesc.putObject(cTID("T   "), cTID("Lyr "), layerProps);
    executeAction(cTID("setd"), propDesc, DialogModes.NO);
    savePsd(d, "smart/filter_mask"); ok++;
})();}catch(e){fail++; $.writeln("filter_mask: "+e);}

// ==========================================
// 5. document/resolution_300 — 300 DPI document
//    Descriptor: Rslt UntF #Rsl (resolution unit type)
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 300, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillRect(d, 20, 20, 160, 160, 100, 200, 100, "300 DPI");
    savePsd(d, "document/resolution_300"); ok++;
})();}catch(e){fail++; $.writeln("resolution_300: "+e);}

// ==========================================
// 6. document/resolution_600 — 600 DPI document
//    Tests higher resolution descriptor value
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 600, "tmp", NewDocumentMode.RGB, DocumentFill.WHITE);
    fillRect(d, 20, 20, 160, 160, 200, 100, 100, "600 DPI");
    savePsd(d, "document/resolution_600"); ok++;
})();}catch(e){fail++; $.writeln("resolution_600: "+e);}

// ==========================================
// 7. adjustment/stacked — Multiple adjustment layers stacked
//    Tests parsing of multiple consecutive adjustment layer descriptors
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 0, 0, 200, 200, 150, 100, 80, "Content");
    // Curves
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(cTID("AdjL"));
    desc1.putReference(cTID("null"), ref1);
    var adj1 = new ActionDescriptor();
    var cv = new ActionDescriptor();
    var chList = new ActionList();
    var ch = new ActionDescriptor();
    var cRef = new ActionReference();
    cRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Cmps"));
    ch.putReference(cTID("Chnl"), cRef);
    var ptList = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    ptList.putObject(cTID("Pnt "), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 128); p2.putDouble(cTID("Vrtc"), 148);
    ptList.putObject(cTID("Pnt "), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 255); p3.putDouble(cTID("Vrtc"), 255);
    ptList.putObject(cTID("Pnt "), p3);
    ch.putList(cTID("Crv "), ptList);
    chList.putObject(cTID("CrvA"), ch);
    cv.putList(cTID("Adjs"), chList);
    adj1.putObject(cTID("Type"), cTID("Crvs"), cv);
    desc1.putObject(cTID("Usng"), cTID("AdjL"), adj1);
    executeAction(cTID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Curves";
    // Hue/Sat
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference(); ref2.putClass(cTID("AdjL"));
    desc2.putReference(cTID("null"), ref2);
    var adj2 = new ActionDescriptor();
    var hs = new ActionDescriptor();
    var hsl = new ActionList();
    var master = new ActionDescriptor();
    master.putInteger(cTID("H   "), 15);
    master.putInteger(cTID("Strt"), 10);
    master.putInteger(cTID("Lght"), 0);
    hsl.putObject(cTID("HStA"), master);
    hs.putList(cTID("Adjs"), hsl);
    adj2.putObject(cTID("Type"), cTID("HStr"), hs);
    desc2.putObject(cTID("Usng"), cTID("AdjL"), adj2);
    executeAction(cTID("Mk  "), desc2, DialogModes.NO);
    d.activeLayer.name = "Hue/Sat";
    // Vibrance
    var desc3 = new ActionDescriptor();
    var ref3 = new ActionReference(); ref3.putClass(cTID("AdjL"));
    desc3.putReference(cTID("null"), ref3);
    var adj3 = new ActionDescriptor();
    var vib = new ActionDescriptor();
    vib.putInteger(sTID("vibrance"), 40);
    vib.putInteger(cTID("Strt"), 10);
    adj3.putObject(cTID("Type"), sTID("vibrance"), vib);
    desc3.putObject(cTID("Usng"), cTID("AdjL"), adj3);
    executeAction(cTID("Mk  "), desc3, DialogModes.NO);
    d.activeLayer.name = "Vibrance";
    // Levels
    var desc4 = new ActionDescriptor();
    var ref4 = new ActionReference(); ref4.putClass(cTID("AdjL"));
    desc4.putReference(cTID("null"), ref4);
    var adj4 = new ActionDescriptor();
    var lvl = new ActionDescriptor();
    var adjList = new ActionList();
    var lch = new ActionDescriptor();
    var lcRef = new ActionReference();
    lcRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Cmps"));
    lch.putReference(cTID("Chnl"), lcRef);
    var inp = new ActionList(); inp.putInteger(15); inp.putInteger(240);
    lch.putList(cTID("Inpt"), inp);
    lch.putDouble(cTID("Gmm "), 1.1);
    adjList.putObject(cTID("LvlA"), lch);
    lvl.putList(cTID("Adjs"), adjList);
    adj4.putObject(cTID("Type"), cTID("Lvls"), lvl);
    desc4.putObject(cTID("Usng"), cTID("AdjL"), adj4);
    executeAction(cTID("Mk  "), desc4, DialogModes.NO);
    d.activeLayer.name = "Levels";
    savePsd(d, "adjustment/stacked"); ok++;
})();}catch(e){fail++; $.writeln("stacked: "+e);}

// ==========================================
// 8. mask/density_feather — Layer mask with density and feather
//    Descriptor: userMaskDensity doub, userMaskFeather doub
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 255, 100, 50, "Mask Props");
    // Add mask
    d.selection.select([[50,50],[250,50],[250,250],[50,250]]);
    var mkDesc = new ActionDescriptor();
    mkDesc.putEnumerated(cTID("Nw  "), cTID("Chnl"), cTID("Msk "));
    mkDesc.putEnumerated(cTID("At  "), cTID("Chnl"), cTID("Msk "));
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Set mask density and feather
    var propDesc = new ActionDescriptor();
    var propRef = new ActionReference();
    propRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    propDesc.putReference(cTID("null"), propRef);
    var layerProps = new ActionDescriptor();
    layerProps.putDouble(sTID("userMaskDensity"), 70);   // 70% density
    layerProps.putDouble(sTID("userMaskFeather"), 10);    // 10px feather
    propDesc.putObject(cTID("T   "), cTID("Lyr "), layerProps);
    executeAction(cTID("setd"), propDesc, DialogModes.NO);
    savePsd(d, "mask/density_feather"); ok++;
})();}catch(e){fail++; $.writeln("density_feather: "+e);}

// ==========================================
// 9. mask/vector_density — Vector mask with density
//    Descriptor: vectorMaskDensity doub
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 50, 100, 255, "VMask Density");
    // Create vector mask (ellipse)
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(cTID("Path"));
    desc.putReference(cTID("null"), ref);
    var shape = new ActionDescriptor();
    shape.putUnitDouble(cTID("Top "), cTID("#Pxl"), 30);
    shape.putUnitDouble(cTID("Left"), cTID("#Pxl"), 30);
    shape.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 270);
    shape.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 270);
    desc.putObject(cTID("T   "), cTID("Elps"), shape);
    executeAction(cTID("Mk  "), desc, DialogModes.NO);
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
    // Set vector mask density
    var propDesc = new ActionDescriptor();
    var propRef = new ActionReference();
    propRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    propDesc.putReference(cTID("null"), propRef);
    var layerProps = new ActionDescriptor();
    layerProps.putDouble(sTID("vectorMaskDensity"), 50);  // 50% density
    propDesc.putObject(cTID("T   "), cTID("Lyr "), layerProps);
    executeAction(cTID("setd"), propDesc, DialogModes.NO);
    savePsd(d, "mask/vector_density"); ok++;
})();}catch(e){fail++; $.writeln("vector_density: "+e);}

// ==========================================
// 10. layer_comp/visibility — Layer comp with different visibility states
//     Descriptor: layer comp with visibility, position, appearance captured
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    var ly1 = fillRect(d, 20, 20, 130, 260, 255, 100, 100, "Red Panel");
    var ly2 = fillRect(d, 150, 20, 130, 260, 100, 100, 255, "Blue Panel");
    // Layer comp 1: both visible
    var comp1 = d.layerComps.add("Both Visible", "", true, true, true);
    // Layer comp 2: only red
    ly2.visible = false;
    var comp2 = d.layerComps.add("Red Only", "", true, true, true);
    // Layer comp 3: only blue
    ly1.visible = false;
    ly2.visible = true;
    var comp3 = d.layerComps.add("Blue Only", "", true, true, true);
    // Restore both
    ly1.visible = true;
    savePsd(d, "layer_comp/visibility"); ok++;
})();}catch(e){fail++; $.writeln("visibility: "+e);}

// ==========================================
// 11. layer_comp/position — Layer comp with different positions
//     Descriptor: layer comp with position captured
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    var ly = fillRect(d, 50, 50, 100, 100, 200, 150, 50, "Movable");
    var comp1 = d.layerComps.add("Top Left", "", false, true, false);
    ly.translate(100, 100);
    var comp2 = d.layerComps.add("Bottom Right", "", false, true, false);
    ly.translate(-50, -200);
    var comp3 = d.layerComps.add("Top Center", "", false, true, false);
    savePsd(d, "layer_comp/position"); ok++;
})();}catch(e){fail++; $.writeln("position: "+e);}

// ==========================================
// 12. layer/clipping_multi — Multiple clipped layers (clipping group)
//     Tests parsing of consecutive isGroupClipped layers
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    // Base layer (clip target)
    var base = fillRect(d, 50, 50, 200, 200, 200, 200, 200, "Base");
    // Clipped layers
    var clip1 = fillRect(d, 0, 0, 300, 150, 255, 100, 100, "Clip Red");
    clip1.grouped = true;
    clip1.blendMode = BlendMode.NORMAL;
    var clip2 = fillRect(d, 0, 150, 300, 150, 100, 100, 255, "Clip Blue");
    clip2.grouped = true;
    clip2.blendMode = BlendMode.NORMAL;
    var clip3 = fillRect(d, 100, 75, 100, 150, 100, 255, 100, "Clip Green");
    clip3.grouped = true;
    clip3.blendMode = BlendMode.MULTIPLY;
    savePsd(d, "layer/clipping_multi"); ok++;
})();}catch(e){fail++; $.writeln("clipping_multi: "+e);}

// ==========================================
// 13. mask/vector_raster_combined — Both vector and raster mask on same layer
//     with different densities and feathers
//     Tests simultaneous userMask + vectorMask descriptor parsing.
// ==========================================
try{(function(){
    var d = newDoc(300, 300);
    fillRect(d, 0, 0, 300, 300, 200, 100, 50, "Dual Mask");
    // Add raster mask (rectangle)
    d.selection.select([[30,30],[270,30],[270,270],[30,270]]);
    var mkDesc = new ActionDescriptor();
    mkDesc.putEnumerated(cTID("Nw  "), cTID("Chnl"), cTID("Msk "));
    mkDesc.putEnumerated(cTID("At  "), cTID("Chnl"), cTID("Msk "));
    executeAction(cTID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Add vector mask (ellipse)
    var pDesc = new ActionDescriptor();
    var pRef = new ActionReference();
    pRef.putClass(cTID("Path"));
    pDesc.putReference(cTID("null"), pRef);
    var ellipse = new ActionDescriptor();
    ellipse.putUnitDouble(cTID("Top "), cTID("#Pxl"), 50);
    ellipse.putUnitDouble(cTID("Left"), cTID("#Pxl"), 50);
    ellipse.putUnitDouble(cTID("Btom"), cTID("#Pxl"), 250);
    ellipse.putUnitDouble(cTID("Rght"), cTID("#Pxl"), 250);
    pDesc.putObject(cTID("T   "), cTID("Elps"), ellipse);
    executeAction(cTID("Mk  "), pDesc, DialogModes.NO);
    var vmDesc = new ActionDescriptor();
    var vmRef = new ActionReference();
    vmRef.putClass(cTID("Path"));
    vmDesc.putReference(cTID("null"), vmRef);
    var atRef = new ActionReference();
    atRef.putEnumerated(cTID("Path"), cTID("Path"), sTID("vectorMask"));
    vmDesc.putReference(cTID("At  "), atRef);
    var usRef = new ActionReference();
    usRef.putEnumerated(cTID("Path"), cTID("Ordn"), cTID("Trgt"));
    vmDesc.putReference(cTID("Usng"), usRef);
    executeAction(cTID("Mk  "), vmDesc, DialogModes.NO);
    // Set different densities
    var propDesc = new ActionDescriptor();
    var propRef = new ActionReference();
    propRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    propDesc.putReference(cTID("null"), propRef);
    var layerProps = new ActionDescriptor();
    layerProps.putDouble(sTID("userMaskDensity"), 80);
    layerProps.putDouble(sTID("userMaskFeather"), 5);
    layerProps.putDouble(sTID("vectorMaskDensity"), 60);
    layerProps.putDouble(sTID("vectorMaskFeather"), 8);
    propDesc.putObject(cTID("T   "), cTID("Lyr "), layerProps);
    executeAction(cTID("setd"), propDesc, DialogModes.NO);
    savePsd(d, "mask/vector_raster_combined"); ok++;
})();}catch(e){fail++; $.writeln("vector_raster_combined: "+e);}

// ==========================================
// 14. effect/channel_restrict — Layer effect with channel restrictions
//     Descriptor: layer effect only applies to specific channels (R, G, or B)
// ==========================================
try{(function(){
    var d = newDoc();
    fillRect(d, 30, 30, 140, 140, 200, 200, 200, "Channel Restrict");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ds.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(0, 0, 0));
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 100);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 8);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 10);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    // Set channel restrictions via advanced blending
    var propDesc = new ActionDescriptor();
    var propRef = new ActionReference();
    propRef.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
    propDesc.putReference(cTID("null"), propRef);
    var layerProps = new ActionDescriptor();
    // Channels list: only Red and Green (exclude Blue)
    var channels = new ActionList();
    var rRef = new ActionReference();
    rRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Rd  "));
    channels.putReference(rRef);
    var gRef = new ActionReference();
    gRef.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Grn "));
    channels.putReference(gRef);
    layerProps.putList(sTID("channelRestrictions"), channels);
    propDesc.putObject(cTID("T   "), cTID("Lyr "), layerProps);
    executeAction(cTID("setd"), propDesc, DialogModes.NO);
    savePsd(d, "effect/channel_restrict"); ok++;
})();}catch(e){fail++; $.writeln("channel_restrict: "+e);}

// ==========================================
// 15. effect/satin_detailed — Satin (ChFX) with all parameters
//     Descriptor: ChFX with Clr, Opct, lagl, Dstn, blur, TrnS, InvT
//     Tests full satin contour descriptor parsing.
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 30, 30, 140, 140, 150, 100, 50, "Satin Full");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ch = new ActionDescriptor();
    ch.putBoolean(cTID("enab"), true);
    ch.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    ch.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(50, 30, 10));
    ch.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    ch.putUnitDouble(cTID("lagl"), cTID("#Ang"), 19);
    ch.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 11);
    ch.putUnitDouble(cTID("blur"), cTID("#Pxl"), 14);
    ch.putBoolean(cTID("InvT"), true); // invert contour
    ch.putBoolean(cTID("AntA"), true);
    // Custom contour
    var shp = new ActionDescriptor();
    shp.putString(cTID("Nm  "), "Ring Double");
    var pts = new ActionList();
    var p1 = new ActionDescriptor(); p1.putDouble(cTID("Hrzn"), 0); p1.putDouble(cTID("Vrtc"), 0);
    p1.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p1);
    var p2 = new ActionDescriptor(); p2.putDouble(cTID("Hrzn"), 64); p2.putDouble(cTID("Vrtc"), 200);
    p2.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p2);
    var p3 = new ActionDescriptor(); p3.putDouble(cTID("Hrzn"), 128); p3.putDouble(cTID("Vrtc"), 50);
    p3.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p3);
    var p4 = new ActionDescriptor(); p4.putDouble(cTID("Hrzn"), 192); p4.putDouble(cTID("Vrtc"), 200);
    p4.putBoolean(cTID("Cnty"), false); pts.putObject(cTID("CrPt"), p4);
    var p5 = new ActionDescriptor(); p5.putDouble(cTID("Hrzn"), 255); p5.putDouble(cTID("Vrtc"), 255);
    p5.putBoolean(cTID("Cnty"), true); pts.putObject(cTID("CrPt"), p5);
    shp.putList(cTID("Crv "), pts);
    ch.putObject(cTID("MpgS"), cTID("ShpC"), shp);
    fx.putObject(cTID("ChFX"), cTID("ChFX"), ch);
    setLayerEffects(fx);
    savePsd(doc, "effect/satin_detailed");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("satin_detailed: "+e); }

// ==========================================
// 16. effect/glow_gradient — Outer Glow with gradient (instead of solid color)
//     Descriptor: OrGl with GlwT enum = SftG + gradient descriptor
// ==========================================
try {
    var doc = newDoc();
    fillRect(doc, 50, 50, 100, 100, 50, 50, 200, "Gradient Glow");
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    og.putEnumerated(cTID("GlwT"), cTID("BETE"), cTID("SfBL")); // Softer
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 25);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), true);
    // Gradient instead of color
    var grad = new ActionDescriptor();
    grad.putString(cTID("Nm  "), "Glow Rainbow");
    grad.putEnumerated(cTID("GrdF"), cTID("GrdF"), cTID("CstS"));
    grad.putDouble(cTID("Intr"), 4096);
    var clrs = new ActionList();
    var cs1 = new ActionDescriptor();
    cs1.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 255, 0));
    cs1.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs1.putInteger(cTID("Lctn"), 0); cs1.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    cs2.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 100, 0));
    cs2.putEnumerated(cTID("Type"), cTID("Clry"), cTID("UsrS"));
    cs2.putInteger(cTID("Lctn"), 2048); cs2.putInteger(cTID("Mdpn"), 50);
    clrs.putObject(cTID("Clrt"), cs2);
    var cs3 = new ActionDescriptor();
    cs3.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(200, 0, 0));
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
    og.putObject(cTID("Grad"), cTID("Grdn"), grad);
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(doc, "effect/glow_gradient");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("glow_gradient: "+e); }

// ==========================================
// 17. color_mode/grayscale_effects — Grayscale document with layer effects
//     Tests effect descriptors in non-RGB color mode document
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.GRAYSCALE, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "Gray Content"; d.activeLayer = ly;
    d.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var c = new SolidColor(); c.gray.gray = 50;
    d.selection.fill(c); d.selection.deselect();
    // Add drop shadow in grayscale
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    var gryClr = new ActionDescriptor();
    gryClr.putDouble(cTID("Gry "), 0);
    gryClr.putDouble(cTID("Bk  "), 0);
    ds.putObject(cTID("Clr "), cTID("Grsc"), gryClr);
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 75);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 120);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 5);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 8);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    setLayerEffects(fx);
    savePsd(d, "color_mode/grayscale_effects"); ok++;
})();}catch(e){fail++; $.writeln("grayscale_effects: "+e);}

// ==========================================
// 18. color_mode/cmyk_effects — CMYK document with layer effects
//     Tests effect descriptors in CMYK color mode
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.CMYK, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "CMYK Content"; d.activeLayer = ly;
    d.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    var c = new SolidColor(); c.cmyk.cyan = 40; c.cmyk.magenta = 20; c.cmyk.yellow = 0; c.cmyk.black = 0;
    d.selection.fill(c); d.selection.deselect();
    // Drop shadow + inner glow in CMYK
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(cTID("enab"), true);
    ds.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Mltp"));
    var cmykClr = new ActionDescriptor();
    cmykClr.putDouble(cTID("Cyn "), 0); cmykClr.putDouble(cTID("Mgnt"), 0);
    cmykClr.putDouble(cTID("Ylw "), 0); cmykClr.putDouble(cTID("Blck"), 100);
    ds.putObject(cTID("Clr "), cTID("CMYC"), cmykClr);
    ds.putUnitDouble(cTID("Opct"), cTID("#Prc"), 60);
    ds.putBoolean(cTID("uglg"), true);
    ds.putUnitDouble(cTID("lagl"), cTID("#Ang"), 135);
    ds.putUnitDouble(cTID("Dstn"), cTID("#Pxl"), 6);
    ds.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    ds.putUnitDouble(cTID("blur"), cTID("#Pxl"), 8);
    ds.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ds.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("DrSh"), cTID("DrSh"), ds);
    var ig = new ActionDescriptor();
    ig.putBoolean(cTID("enab"), true);
    ig.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    var cmykW = new ActionDescriptor();
    cmykW.putDouble(cTID("Cyn "), 0); cmykW.putDouble(cTID("Mgnt"), 0);
    cmykW.putDouble(cTID("Ylw "), 0); cmykW.putDouble(cTID("Blck"), 0);
    ig.putObject(cTID("Clr "), cTID("CMYC"), cmykW);
    ig.putUnitDouble(cTID("Opct"), cTID("#Prc"), 70);
    ig.putEnumerated(cTID("glwS"), cTID("IGSr"), cTID("SrcC"));
    ig.putUnitDouble(cTID("blur"), cTID("#Pxl"), 12);
    ig.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    ig.putBoolean(cTID("AntA"), false);
    fx.putObject(cTID("IrGl"), cTID("IrGl"), ig);
    setLayerEffects(fx);
    savePsd(d, "color_mode/cmyk_effects"); ok++;
})();}catch(e){fail++; $.writeln("cmyk_effects: "+e);}

// ==========================================
// 19. color_mode/lab_effects — Lab document with layer effects
//     Tests effect descriptors in Lab color mode
// ==========================================
try{(function(){
    var d = app.documents.add(200, 200, 72, "tmp", NewDocumentMode.LAB, DocumentFill.WHITE);
    var ly = d.artLayers.add(); ly.name = "Lab Content"; d.activeLayer = ly;
    d.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    var c = new SolidColor(); c.lab.l = 50; c.lab.a = 40; c.lab.b = -30;
    d.selection.fill(c); d.selection.deselect();
    var fx = new ActionDescriptor();
    fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
    var og = new ActionDescriptor();
    og.putBoolean(cTID("enab"), true);
    og.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID("Scrn"));
    var labClr = new ActionDescriptor();
    labClr.putDouble(cTID("Lmnc"), 80);
    labClr.putDouble(cTID("A   "), -20);
    labClr.putDouble(cTID("B   "), 40);
    og.putObject(cTID("Clr "), cTID("LbCl"), labClr);
    og.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
    og.putUnitDouble(cTID("Ckmt"), cTID("#Pxl"), 0);
    og.putUnitDouble(cTID("blur"), cTID("#Pxl"), 15);
    og.putUnitDouble(cTID("Nose"), cTID("#Prc"), 0);
    og.putBoolean(cTID("AntA"), true);
    fx.putObject(cTID("OrGl"), cTID("OrGl"), og);
    setLayerEffects(fx);
    savePsd(d, "color_mode/lab_effects"); ok++;
})();}catch(e){fail++; $.writeln("lab_effects: "+e);}

// ==========================================
// 20. effect/all_blend_modes_fx — Effects using uncommon blend modes
//     Tests: ColorBurn, LinearBurn, ColorDodge, LinearDodge, VividLight,
//            LinearLight, PinLight, HardMix
// ==========================================
try {
    var doc = newDoc(400, 400);
    var modes = [
        ["CrBn", "Color Burn"], ["linearBurn", "Linear Burn"],
        ["CDdg", "Color Dodge"], ["linearDodge", "Linear Dodge"],
        ["vividLight", "Vivid Light"], ["linearLight", "Linear Light"],
        ["pinLight", "Pin Light"], ["hardMix", "Hard Mix"]
    ];
    var y = 10;
    for (var i = 0; i < modes.length; i++) {
        var ly = fillRect(doc, 10, y, 180, 40, 128, 128, 200, modes[i][1]);
        var fx = new ActionDescriptor();
        fx.putUnitDouble(cTID("Scl "), cTID("#Prc"), 100);
        var co = new ActionDescriptor();
        co.putBoolean(cTID("enab"), true);
        // Use stringIDToTypeID for string-based modes, charIDToTypeID for 4-char codes
        try {
            co.putEnumerated(cTID("Md  "), cTID("BlnM"), sTID(modes[i][0]));
        } catch(e2) {
            co.putEnumerated(cTID("Md  "), cTID("BlnM"), cTID(modes[i][0]));
        }
        co.putUnitDouble(cTID("Opct"), cTID("#Prc"), 80);
        co.putObject(cTID("Clr "), cTID("RGBC"), makeRGBC(255, 200, 0));
        fx.putObject(cTID("SoFi"), cTID("SoFi"), co);
        setLayerEffects(fx);
        y += 48;
    }
    savePsd(doc, "effect/all_blend_modes_fx");
    ok++;
} catch(e) { try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(x){} fail++; $.writeln("all_blend_modes_fx: "+e); }

"gen_desc6 done: " + ok + " ok, " + fail + " fail";
