// === Deep nesting, many layers, stress tests, mask variants ===
function savePsd(doc, path) {
    var f = new File(path); var o = new PhotoshopSaveOptions(); o.alphaChannels=true; o.layers=true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
function fillLayer(doc, name, r, g, b, region) {
    var layer = doc.artLayers.add(); layer.name = name; doc.activeLayer = layer;
    if(region) doc.selection.select(region); else doc.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=r; c.rgb.green=g; c.rgb.blue=b;
    doc.selection.fill(c); doc.selection.deselect();
    return layer;
}
var B = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok=0, fail=0;

// deep_nesting_10
try{(function(){
    var d = app.documents.add(200,200,72,"deep_nesting_10",NewDocumentMode.RGB,DocumentFill.WHITE);
    var parent = null;
    for(var i=0;i<10;i++){
        var g;
        if(parent===null) g = d.layerSets.add();
        else g = parent.layerSets.add();
        g.name = "Level "+(i+1);
        parent = g;
    }
    var leaf = parent.artLayers.add(); leaf.name = "Deepest"; d.activeLayer = leaf;
    d.selection.selectAll(); var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c); d.selection.deselect();
    savePsd(d,B+"deep_nesting_10.psd"); ok++;
})();}catch(e){fail++;}

// layers_50
try{(function(){
    var d = app.documents.add(500,500,72,"layers_50",NewDocumentMode.RGB,DocumentFill.WHITE);
    for(var i=0;i<50;i++){
        var layer = d.artLayers.add(); layer.name = "Layer "+(i+1); d.activeLayer = layer;
        var x = (i%10)*50; var y = Math.floor(i/10)*100;
        var region = [[x,y],[x+50,y],[x+50,y+100],[x,y+100]];
        d.selection.select(region);
        var c = new SolidColor();
        c.rgb.red = Math.floor(Math.random()*256);
        c.rgb.green = Math.floor(Math.random()*256);
        c.rgb.blue = Math.floor(Math.random()*256);
        d.selection.fill(c); d.selection.deselect();
    }
    savePsd(d,B+"layers_50.psd"); ok++;
})();}catch(e){fail++;}

// layers_100
try{(function(){
    var d = app.documents.add(500,500,72,"layers_100",NewDocumentMode.RGB,DocumentFill.WHITE);
    for(var i=0;i<100;i++){
        var layer = d.artLayers.add(); layer.name = "L"+(i+1); d.activeLayer = layer;
        var x = (i%10)*50; var y = Math.floor(i/10)*50;
        var region = [[x,y],[x+50,y],[x+50,y+50],[x,y+50]];
        d.selection.select(region);
        var c = new SolidColor();
        c.rgb.red = (i*7)%256; c.rgb.green = (i*13)%256; c.rgb.blue = (i*23)%256;
        d.selection.fill(c); d.selection.deselect();
    }
    savePsd(d,B+"layers_100.psd"); ok++;
})();}catch(e){fail++;}

// layer_long_name
try{(function(){
    var d = app.documents.add(200,200,72,"layer_long_name",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "This is a very long layer name that tests the maximum length handling of layer names in the PSD file format specification which should support quite long names via the luni additional layer information block", 128, 128, 255);
    savePsd(d,B+"layer_long_name.psd"); ok++;
})();}catch(e){fail++;}

// layer_name_special_chars
try{(function(){
    var d = app.documents.add(200,200,72,"layer_name_special_chars",NewDocumentMode.RGB,DocumentFill.WHITE);
    var l1 = fillLayer(d, "Layer / Slash", 255, 0, 0, [[0,0],[200,0],[200,50],[0,50]]);
    var l2 = fillLayer(d, "Layer \\ Backslash", 0, 255, 0, [[0,50],[200,50],[200,100],[0,100]]);
    var l3 = fillLayer(d, "Layer <angle> brackets", 0, 0, 255, [[0,100],[200,100],[200,150],[0,150]]);
    var l4 = fillLayer(d, "Layer \"quotes\"", 255, 255, 0, [[0,150],[200,150],[200,200],[0,200]]);
    savePsd(d,B+"layer_name_special_chars.psd"); ok++;
})();}catch(e){fail++;}

// layer_name_empty
try{(function(){
    var d = app.documents.add(200,200,72,"layer_name_empty",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "", 200, 100, 50);
    savePsd(d,B+"layer_name_empty.psd"); ok++;
})();}catch(e){fail++;}

// mask_feather
try{(function(){
    var d = app.documents.add(200,200,72,"mask_feather",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "Feathered Mask", 255, 0, 0);
    var region = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region);
    var mkDesc = new ActionDescriptor();
    mkDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mkRef = new ActionReference(); mkRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mkDesc.putReference(charIDToTypeID("At  "), mkRef);
    mkDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Set mask feather
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var ldesc = new ActionDescriptor();
    ldesc.putUnitDouble(stringIDToTypeID("userMaskFeather"), charIDToTypeID("#Pxl"), 10);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), ldesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d,B+"mask_feather.psd"); ok++;
})();}catch(e){fail++;}

// mask_density
try{(function(){
    var d = app.documents.add(200,200,72,"mask_density",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = fillLayer(d, "Density Mask", 0, 0, 255);
    var region = [[30,30],[170,30],[170,170],[30,170]];
    d.selection.select(region);
    var mkDesc = new ActionDescriptor();
    mkDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mkRef = new ActionReference(); mkRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mkDesc.putReference(charIDToTypeID("At  "), mkRef);
    mkDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), mkDesc, DialogModes.NO);
    d.selection.deselect();
    // Set mask density
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var ldesc = new ActionDescriptor();
    ldesc.putUnitDouble(stringIDToTypeID("userMaskDensity"), charIDToTypeID("#Prc"), 50);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), ldesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d,B+"mask_density.psd"); ok++;
})();}catch(e){fail++;}

// vector_mask_feather
try{(function(){
    var d = app.documents.add(200,200,72,"vector_mask_feather",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),255); cd.putDouble(charIDToTypeID("Grn "),0); cd.putDouble(charIDToTypeID("Bl  "),128);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),170);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Feathered Vector";
    // Set vector mask feather
    var setDesc = new ActionDescriptor();
    var setRef = new ActionReference();
    setRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    setDesc.putReference(charIDToTypeID("null"), setRef);
    var lDesc = new ActionDescriptor();
    lDesc.putUnitDouble(stringIDToTypeID("vectorMaskFeather"), charIDToTypeID("#Pxl"), 15);
    setDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
    executeAction(charIDToTypeID("setd"), setDesc, DialogModes.NO);
    savePsd(d,B+"vector_mask_feather.psd"); ok++;
})();}catch(e){fail++;}

// vector_mask_density
try{(function(){
    var d = app.documents.add(200,200,72,"vector_mask_density",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),0); cd.putDouble(charIDToTypeID("Grn "),128); cd.putDouble(charIDToTypeID("Bl  "),255);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),20);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),20);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),180);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),180);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Density Vector";
    var setDesc = new ActionDescriptor();
    var setRef = new ActionReference();
    setRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    setDesc.putReference(charIDToTypeID("null"), setRef);
    var lDesc = new ActionDescriptor();
    lDesc.putUnitDouble(stringIDToTypeID("vectorMaskDensity"), charIDToTypeID("#Prc"), 50);
    setDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
    executeAction(charIDToTypeID("setd"), setDesc, DialogModes.NO);
    savePsd(d,B+"vector_mask_density.psd"); ok++;
})();}catch(e){fail++;}

// multiple_alpha_channels
try{(function(){
    var d = app.documents.add(200,200,72,"multiple_alpha_channels",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "Base", 128, 128, 128);
    // Alpha 1
    var ch1 = d.channels.add(); ch1.name = "Alpha 1";
    d.activeChannels = [ch1];
    var region1 = [[0,0],[100,0],[100,200],[0,200]];
    d.selection.select(region1);
    var white = new SolidColor(); white.rgb.red=255; white.rgb.green=255; white.rgb.blue=255;
    d.selection.fill(white); d.selection.deselect();
    // Alpha 2
    d.activeChannels = [d.channels[0],d.channels[1],d.channels[2]];
    var ch2 = d.channels.add(); ch2.name = "Alpha 2";
    d.activeChannels = [ch2];
    var region2 = [[0,0],[200,0],[200,100],[0,100]];
    d.selection.select(region2);
    d.selection.fill(white); d.selection.deselect();
    // Alpha 3
    d.activeChannels = [d.channels[0],d.channels[1],d.channels[2]];
    var ch3 = d.channels.add(); ch3.name = "Alpha 3";
    d.activeChannels = [ch3];
    var region3 = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(region3);
    d.selection.fill(white); d.selection.deselect();
    d.activeChannels = [d.channels[0],d.channels[1],d.channels[2]];
    savePsd(d,B+"multiple_alpha_channels.psd"); ok++;
})();}catch(e){fail++;}

// smart_filter_sharpen
try{(function(){
    var d = app.documents.add(200,200,72,"smart_filter_sharpen",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "Base", 128, 128, 128);
    executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    var desc = new ActionDescriptor();
    desc.putUnitDouble(charIDToTypeID("Amnt"), charIDToTypeID("#Prc"), 100);
    desc.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 2.0);
    desc.putInteger(charIDToTypeID("Thsh"), 0);
    executeAction(charIDToTypeID("UnsM"), desc, DialogModes.NO);
    savePsd(d,B+"smart_filter_sharpen.psd"); ok++;
})();}catch(e){fail++;}

// smart_filter_multiple
try{(function(){
    var d = app.documents.add(200,200,72,"smart_filter_multiple",NewDocumentMode.RGB,DocumentFill.WHITE);
    fillLayer(d, "Base", 200, 100, 50);
    executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    // Blur
    var gbd = new ActionDescriptor();
    gbd.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 3.0);
    executeAction(charIDToTypeID("GsnB"), gbd, DialogModes.NO);
    // Sharpen
    var usd = new ActionDescriptor();
    usd.putUnitDouble(charIDToTypeID("Amnt"), charIDToTypeID("#Prc"), 50);
    usd.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 1.0);
    usd.putInteger(charIDToTypeID("Thsh"), 0);
    executeAction(charIDToTypeID("UnsM"), usd, DialogModes.NO);
    savePsd(d,B+"smart_filter_multiple.psd"); ok++;
})();}catch(e){fail++;}

// clipping_mask_chain (3 layers clipped)
try{(function(){
    var d = app.documents.add(200,200,72,"clipping_mask_chain",NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    var base = fillLayer(d, "Base", 255, 255, 0, [[30,30],[170,30],[170,170],[30,170]]);
    var clip1 = fillLayer(d, "Clip 1", 255, 0, 0);
    clip1.grouped = true; clip1.move(base, ElementPlacement.PLACEBEFORE);
    var clip2 = fillLayer(d, "Clip 2", 0, 0, 255, [[0,0],[200,0],[200,100],[0,100]]);
    clip2.grouped = true; clip2.move(clip1, ElementPlacement.PLACEBEFORE);
    clip2.opacity = 50;
    savePsd(d,B+"clipping_mask_chain.psd"); ok++;
})();}catch(e){fail++;}

// blend_interior_effects
try{(function(){
    var d = app.documents.add(200,200,72,"blend_interior_effects",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[30,30],[170,30],[170,170],[30,170]];
    var layer = fillLayer(d, "Interior FX", 100, 150, 200, region);
    // Add inner glow + set blend interior effects as group
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ig = new ActionDescriptor();
    ig.putBoolean(charIDToTypeID("enab"), true);
    ig.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var clr = new ActionDescriptor(); clr.putDouble(charIDToTypeID("Rd  "),255); clr.putDouble(charIDToTypeID("Grn "),255); clr.putDouble(charIDToTypeID("Bl  "),255);
    ig.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ig.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ig.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    lfx.putObject(charIDToTypeID("IrGl"), charIDToTypeID("IrGl"), ig);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    // Set blend interior effects as group
    var setDesc = new ActionDescriptor();
    var setRef = new ActionReference();
    setRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    setDesc.putReference(charIDToTypeID("null"), setRef);
    var lDesc = new ActionDescriptor();
    lDesc.putBoolean(stringIDToTypeID("layerFXVisible"), true);
    lDesc.putBoolean(stringIDToTypeID("blendInterior"), true);
    setDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
    executeAction(charIDToTypeID("setd"), setDesc, DialogModes.NO);
    savePsd(d,B+"blend_interior_effects.psd"); ok++;
})();}catch(e){fail++;}

// transparency_shapes_layer
try{(function(){
    var d = app.documents.add(200,200,72,"transparency_shapes_layer",NewDocumentMode.RGB,DocumentFill.WHITE);
    var region = [[30,30],[170,30],[170,170],[30,170]];
    var layer = fillLayer(d, "TransShapes", 255, 128, 0, region);
    // Add drop shadow + disable transparency shapes layer
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var dsClr = new ActionDescriptor(); dsClr.putDouble(charIDToTypeID("Rd  "),0); dsClr.putDouble(charIDToTypeID("Grn "),0); dsClr.putDouble(charIDToTypeID("Bl  "),0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), dsClr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    lfx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    // Set transparency shapes layer off
    var setDesc = new ActionDescriptor();
    var setRef = new ActionReference();
    setRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    setDesc.putReference(charIDToTypeID("null"), setRef);
    var lDesc = new ActionDescriptor();
    lDesc.putBoolean(stringIDToTypeID("transparencyShapesLayer"), false);
    setDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
    executeAction(charIDToTypeID("setd"), setDesc, DialogModes.NO);
    savePsd(d,B+"transparency_shapes_layer.psd"); ok++;
})();}catch(e){fail++;}

// gradient_three_stops
try{(function(){
    var d = app.documents.add(300,200,72,"gradient_three_stops",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("linear"));
    gDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Three Stops");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor(); var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "),255); c1.putDouble(charIDToTypeID("Grn "),0); c1.putDouble(charIDToTypeID("Bl  "),0);
    cs1.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c1); cs1.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"),0); cs1.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs1);
    var cs2 = new ActionDescriptor(); var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "),0); c2.putDouble(charIDToTypeID("Grn "),255); c2.putDouble(charIDToTypeID("Bl  "),0);
    cs2.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c2); cs2.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"),2048); cs2.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs2);
    var cs3 = new ActionDescriptor(); var c3 = new ActionDescriptor(); c3.putDouble(charIDToTypeID("Rd  "),0); c3.putDouble(charIDToTypeID("Grn "),0); c3.putDouble(charIDToTypeID("Bl  "),255);
    cs3.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c3); cs3.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs3.putInteger(charIDToTypeID("Lctn"),4096); cs3.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs3);
    gradDesc.putList(charIDToTypeID("Clrs"),csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts1.putInteger(charIDToTypeID("Lctn"),0); ts1.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts2.putInteger(charIDToTypeID("Lctn"),4096); ts2.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts2);
    gradDesc.putList(charIDToTypeID("Trns"),tsList);
    gDesc.putObject(charIDToTypeID("Grad"),charIDToTypeID("Grdn"),gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "3 Color Stops";
    savePsd(d,B+"gradient_three_stops.psd"); ok++;
})();}catch(e){fail++;}

// gradient_opacity_stops
try{(function(){
    var d = app.documents.add(300,200,72,"gradient_opacity_stops",NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("linear"));
    gDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "OpacityGrad");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor(); var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "),255); c1.putDouble(charIDToTypeID("Grn "),0); c1.putDouble(charIDToTypeID("Bl  "),0);
    cs1.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c1); cs1.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"),0); cs1.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs1);
    var cs2 = new ActionDescriptor(); var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "),255); c2.putDouble(charIDToTypeID("Grn "),0); c2.putDouble(charIDToTypeID("Bl  "),0);
    cs2.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c2); cs2.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"),4096); cs2.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs2);
    gradDesc.putList(charIDToTypeID("Clrs"),csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts1.putInteger(charIDToTypeID("Lctn"),0); ts1.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),0); ts2.putInteger(charIDToTypeID("Lctn"),4096); ts2.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts2);
    gradDesc.putList(charIDToTypeID("Trns"),tsList);
    gDesc.putObject(charIDToTypeID("Grad"),charIDToTypeID("Grdn"),gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Opacity Gradient";
    savePsd(d,B+"gradient_opacity_stops.psd"); ok++;
})();}catch(e){fail++;}

// text_on_shape_layer (text + shape on different layers)
try{(function(){
    var d = app.documents.add(300,200,72,"text_on_shape",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Shape
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),0); cd.putDouble(charIDToTypeID("Grn "),100); cd.putDouble(charIDToTypeID("Bl  "),200);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),20);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),20);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),180);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),280);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Button BG";
    // Text
    var tl = d.artLayers.add(); tl.kind = LayerKind.TEXT; tl.name = "Button Label";
    tl.textItem.contents = "CLICK ME"; tl.textItem.font = "Roboto-Bold"; tl.textItem.size = new UnitValue(24,"pt");
    tl.textItem.position = [new UnitValue(75,"px"), new UnitValue(115,"px")];
    var tc = new SolidColor(); tc.rgb.red=255; tc.rgb.green=255; tc.rgb.blue=255; tl.textItem.color = tc;
    tl.textItem.justification = Justification.CENTER;
    savePsd(d,B+"text_on_shape.psd"); ok++;
})();}catch(e){fail++;}

// complex_layout (groups + effects + text + shapes)
try{(function(){
    var d = app.documents.add(400,300,72,"complex_layout",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Background group
    var bgGroup = d.layerSets.add(); bgGroup.name = "Background";
    var bg = bgGroup.artLayers.add(); bg.name = "BG Color"; d.activeLayer = bg;
    d.selection.selectAll(); var bgc = new SolidColor(); bgc.rgb.red=240; bgc.rgb.green=240; bgc.rgb.blue=245;
    d.selection.fill(bgc); d.selection.deselect();
    // Content group
    var cGroup = d.layerSets.add(); cGroup.name = "Content";
    // Card shape
    var cdesc = new ActionDescriptor();
    var cref = new ActionReference(); cref.putClass(stringIDToTypeID("contentLayer"));
    cdesc.putReference(charIDToTypeID("null"), cref);
    var csd = new ActionDescriptor();
    var ccd = new ActionDescriptor(); ccd.putDouble(charIDToTypeID("Rd  "),255); ccd.putDouble(charIDToTypeID("Grn "),255); ccd.putDouble(charIDToTypeID("Bl  "),255);
    var csol = new ActionDescriptor(); csol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),ccd);
    csd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), csol);
    var cr = new ActionDescriptor();
    cr.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    cr.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),50);
    cr.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),270);
    cr.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),350);
    csd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),cr);
    cdesc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), csd);
    executeAction(charIDToTypeID("Mk  "), cdesc, DialogModes.NO);
    d.activeLayer.name = "Card"; d.activeLayer.move(cGroup, ElementPlacement.INSIDE);
    // Title
    var title = d.artLayers.add(); title.kind = LayerKind.TEXT; title.name = "Title";
    title.textItem.contents = "Card Title"; title.textItem.font = "Roboto-Bold"; title.textItem.size = new UnitValue(20,"pt");
    title.textItem.position = [new UnitValue(80,"px"), new UnitValue(80,"px")];
    var titleC = new SolidColor(); titleC.rgb.red=30; titleC.rgb.green=30; titleC.rgb.blue=30; title.textItem.color = titleC;
    title.move(cGroup, ElementPlacement.INSIDE);
    // Body
    var body = d.artLayers.add(); body.kind = LayerKind.TEXT; body.name = "Body";
    body.textItem.kind = TextType.PARAGRAPHTEXT;
    body.textItem.width = new UnitValue(250,"px"); body.textItem.height = new UnitValue(120,"px");
    body.textItem.position = [new UnitValue(80,"px"), new UnitValue(110,"px")];
    body.textItem.contents = "This is body text in a card layout with multiple layers and groups.";
    body.textItem.font = "Roboto-Regular"; body.textItem.size = new UnitValue(12,"pt");
    var bodyC = new SolidColor(); bodyC.rgb.red=80; bodyC.rgb.green=80; bodyC.rgb.blue=80; body.textItem.color = bodyC;
    body.move(cGroup, ElementPlacement.INSIDE);
    savePsd(d,B+"complex_layout.psd"); ok++;
})();}catch(e){fail++;}

alert("Deep: ok="+ok+" fail="+fail);
