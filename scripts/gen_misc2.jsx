// gen_misc2.jsx - More miscellaneous PSD features
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

// 1. Blend-if sliders (This Layer)
try{(function(){
    var d = app.documents.add(200,200,72,"blend_if_this",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Create gradient layer
    var layer = d.artLayers.add();
    layer.name = "BlendIfThis";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    // Set blend-if via action manager: hide darks on this layer
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    var blndList = new ActionList();
    // Gray channel blend range
    var br = new ActionDescriptor();
    br.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Gry "));
    br.putInteger(charIDToTypeID("SrcB"), 0);   // This layer black
    br.putInteger(charIDToTypeID("Srcl"), 50);   // This layer black feather
    br.putInteger(charIDToTypeID("SrcW"), 255);  // This layer white
    br.putInteger(charIDToTypeID("Srcm"), 255);  // This layer white feather
    br.putInteger(charIDToTypeID("DstB"), 0);
    br.putInteger(charIDToTypeID("Dstl"), 0);
    br.putInteger(charIDToTypeID("DstW"), 255);
    br.putInteger(charIDToTypeID("Dstt"), 255);
    blndList.putObject(charIDToTypeID("Blnd"), br);
    layerDesc.putList(charIDToTypeID("Blnd"), blndList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), layerDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "blend_if_this"); ok++;
})();}catch(e){fail++; $.writeln("blend_if_this: "+e);}

// 2. Blend-if sliders (Underlying Layer)
try{(function(){
    var d = app.documents.add(200,200,72,"blend_if_underlying",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 100, 100, "Base");
    var layer = addColorLayer(d, 200, 50, 50, "BlendIfUnderlying");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    var blndList = new ActionList();
    var br = new ActionDescriptor();
    br.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Gry "));
    br.putInteger(charIDToTypeID("SrcB"), 0);
    br.putInteger(charIDToTypeID("Srcl"), 0);
    br.putInteger(charIDToTypeID("SrcW"), 255);
    br.putInteger(charIDToTypeID("Srcm"), 255);
    br.putInteger(charIDToTypeID("DstB"), 0);    // Underlying black
    br.putInteger(charIDToTypeID("Dstl"), 0);
    br.putInteger(charIDToTypeID("DstW"), 200);  // Underlying white limit
    br.putInteger(charIDToTypeID("Dstt"), 255);  // Underlying white feather
    blndList.putObject(charIDToTypeID("Blnd"), br);
    layerDesc.putList(charIDToTypeID("Blnd"), blndList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), layerDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "blend_if_underlying"); ok++;
})();}catch(e){fail++; $.writeln("blend_if_underlying: "+e);}

// 3. Knockout shallow
try{(function(){
    var d = app.documents.add(200,200,72,"knockout_shallow",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 0, "Base");
    var grp = d.layerSets.add();
    grp.name = "Group";
    var layer = grp.artLayers.add();
    layer.name = "Knockout";
    d.activeLayer = layer;
    var r = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    // Set knockout to shallow
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    layerDesc.putEnumerated(stringIDToTypeID("knockout"), stringIDToTypeID("knockout"), stringIDToTypeID("shallow"));
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), layerDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "knockout_shallow"); ok++;
})();}catch(e){fail++; $.writeln("knockout_shallow: "+e);}

// 4. Knockout deep
try{(function(){
    var d = app.documents.add(200,200,72,"knockout_deep",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 0, 200, 200, "Base");
    var grp = d.layerSets.add();
    grp.name = "Group";
    var layer = grp.artLayers.add();
    layer.name = "Knockout";
    d.activeLayer = layer;
    var r = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    layerDesc.putEnumerated(stringIDToTypeID("knockout"), stringIDToTypeID("knockout"), stringIDToTypeID("deep"));
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), layerDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "knockout_deep"); ok++;
})();}catch(e){fail++; $.writeln("knockout_deep: "+e);}

// 5. Layer comp with visibility
try{(function(){
    var d = app.documents.add(200,200,72,"layer_comp_visibility",NewDocumentMode.RGB,DocumentFill.WHITE);
    var l1 = addColorLayer(d, 255, 0, 0, "Red");
    var l2 = addColorLayer(d, 0, 255, 0, "Green");
    var l3 = addColorLayer(d, 0, 0, 255, "Blue");
    // Create layer comp 1: Red visible
    l1.visible = true; l2.visible = false; l3.visible = false;
    var lc1 = d.layerComps.add("Red Only", "Only red visible", true, false, false);
    // Create layer comp 2: Green visible
    l1.visible = false; l2.visible = true; l3.visible = false;
    var lc2 = d.layerComps.add("Green Only", "Only green visible", true, false, false);
    // Create layer comp 3: All visible
    l1.visible = true; l2.visible = true; l3.visible = true;
    var lc3 = d.layerComps.add("All Visible", "All layers visible", true, false, false);
    savePsd(d, "layer_comp_visibility"); ok++;
})();}catch(e){fail++; $.writeln("layer_comp_visibility: "+e);}

// 6. Layer comp with position
try{(function(){
    var d = app.documents.add(200,200,72,"layer_comp_position",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "Movable";
    d.activeLayer = layer;
    var r = [[50,50],[100,50],[100,100],[50,100]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=128; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    // Comp 1: original position
    var lc1 = d.layerComps.add("Position 1", "Top-left", false, true, false);
    // Move layer
    layer.translate(new UnitValue(50,"px"), new UnitValue(50,"px"));
    var lc2 = d.layerComps.add("Position 2", "Center", false, true, false);
    savePsd(d, "layer_comp_position"); ok++;
})();}catch(e){fail++; $.writeln("layer_comp_position: "+e);}

// 7. Layer comp with appearance (effects)
try{(function(){
    var d = app.documents.add(200,200,72,"layer_comp_appearance",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 150, 200, "Styled");
    d.activeLayer = layer;
    // Comp 1: no effects
    var lc1 = d.layerComps.add("No Effects", "Plain", false, false, true);
    // Add drop shadow
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
    var clr = new ActionDescriptor(); clr.putDouble(charIDToTypeID("Rd  "), 0); clr.putDouble(charIDToTypeID("Grn "), 0); clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    // Comp 2: with effects
    var lc2 = d.layerComps.add("With Effects", "Drop shadow", false, false, true);
    savePsd(d, "layer_comp_appearance"); ok++;
})();}catch(e){fail++; $.writeln("layer_comp_appearance: "+e);}

// 8. Custom shape - Line
try{(function(){
    var d = app.documents.add(200,200,72,"shape_line",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Draw a line shape using action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    // Solid color
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 0);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    // Line shape
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 100);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 100);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 180);
    // Use a thin rect as a line
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 98);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 102);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_line"); ok++;
})();}catch(e){fail++; $.writeln("shape_line: "+e);}

// 9. Shape - Polygon (via action manager)
try{(function(){
    var d = app.documents.add(200,200,72,"shape_polygon",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 50);
    clr.putDouble(charIDToTypeID("Grn "), 150);
    clr.putDouble(charIDToTypeID("Bl  "), 50);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    // Polygon
    var shp = new ActionDescriptor();
    shp.putUnitDouble(stringIDToTypeID("radius"), charIDToTypeID("#Pxl"), 70);
    shp.putInteger(stringIDToTypeID("sides"), 6); // hexagon
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("polygon"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_polygon"); ok++;
})();}catch(e){fail++; $.writeln("shape_polygon: "+e);}

// 10. Duotone mode
try{(function(){
    var d = app.documents.add(200,200,72,"duotone_mode",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 100, 100, "Gray");
    d.flatten();
    d.changeMode(ChangeMode.GRAYSCALE);
    // Now convert to duotone via action manager
    var desc = new ActionDescriptor();
    desc.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("ClrM"), charIDToTypeID("Dtn "));
    // Duotone options
    var dtOpts = new ActionDescriptor();
    dtOpts.putEnumerated(charIDToTypeID("DtnT"), charIDToTypeID("DtnT"), charIDToTypeID("Dtn "));
    // Ink 1 - Black
    var ink1 = new ActionDescriptor();
    var clr1 = new ActionDescriptor();
    clr1.putDouble(charIDToTypeID("Bk  "), 100);
    ink1.putObject(charIDToTypeID("Clr "), charIDToTypeID("CMYC"), clr1);
    ink1.putString(charIDToTypeID("Nm  "), "Black");
    // Ink 1 curve
    var curve1 = new ActionDescriptor();
    curve1.putDouble(stringIDToTypeID("0"), 0);
    curve1.putDouble(stringIDToTypeID("25"), 25);
    curve1.putDouble(stringIDToTypeID("50"), 50);
    curve1.putDouble(stringIDToTypeID("75"), 75);
    curve1.putDouble(stringIDToTypeID("100"), 100);
    ink1.putObject(charIDToTypeID("Crv "), charIDToTypeID("Crv "), curve1);
    dtOpts.putObject(stringIDToTypeID("ink1"), stringIDToTypeID("ink"), ink1);
    // Ink 2 - Blue
    var ink2 = new ActionDescriptor();
    var clr2 = new ActionDescriptor();
    clr2.putDouble(charIDToTypeID("Cyn "), 100);
    clr2.putDouble(charIDToTypeID("Mgnt"), 50);
    clr2.putDouble(charIDToTypeID("Ylw "), 0);
    clr2.putDouble(charIDToTypeID("Bk  "), 0);
    ink2.putObject(charIDToTypeID("Clr "), charIDToTypeID("CMYC"), clr2);
    ink2.putString(charIDToTypeID("Nm  "), "Blue");
    var curve2 = new ActionDescriptor();
    curve2.putDouble(stringIDToTypeID("0"), 0);
    curve2.putDouble(stringIDToTypeID("25"), 20);
    curve2.putDouble(stringIDToTypeID("50"), 40);
    curve2.putDouble(stringIDToTypeID("75"), 60);
    curve2.putDouble(stringIDToTypeID("100"), 80);
    ink2.putObject(charIDToTypeID("Crv "), charIDToTypeID("Crv "), curve2);
    dtOpts.putObject(stringIDToTypeID("ink2"), stringIDToTypeID("ink"), ink2);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("DtnS"), dtOpts);
    executeAction(charIDToTypeID("CnvM"), desc, DialogModes.NO);
    savePsd(d, "duotone_mode"); ok++;
})();}catch(e){fail++; $.writeln("duotone_mode: "+e);}

// 11. Layer locked all
try{(function(){
    var d = app.documents.add(200,200,72,"layer_locked_all",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 150, 100, 200, "LockedAll");
    layer.allLocked = true;
    savePsd(d, "layer_locked_all"); ok++;
})();}catch(e){fail++; $.writeln("layer_locked_all: "+e);}

// 12. Layer locked transparent pixels
try{(function(){
    var d = app.documents.add(200,200,72,"layer_locked_transparent",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "LockedTransparent";
    d.activeLayer = layer;
    var r = [[50,50],[150,50],[150,150],[50,150]];
    d.selection.select(r);
    var c = new SolidColor(); c.rgb.red=100; c.rgb.green=200; c.rgb.blue=100;
    d.selection.fill(c);
    d.selection.deselect();
    layer.transparentPixelsLocked = true;
    savePsd(d, "layer_locked_transparent"); ok++;
})();}catch(e){fail++; $.writeln("layer_locked_transparent: "+e);}

// 13. Multiple guides (horizontal and vertical)
try{(function(){
    var d = app.documents.add(400,400,72,"guides_multiple",NewDocumentMode.RGB,DocumentFill.WHITE);
    d.guides.add(Direction.HORIZONTAL, new UnitValue(50,"px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(100,"px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(200,"px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(300,"px"));
    d.guides.add(Direction.HORIZONTAL, new UnitValue(350,"px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(50,"px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(100,"px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(200,"px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(300,"px"));
    d.guides.add(Direction.VERTICAL, new UnitValue(350,"px"));
    savePsd(d, "guides_multiple"); ok++;
})();}catch(e){fail++; $.writeln("guides_multiple: "+e);}

// 14. Grid layout (using guides)
try{(function(){
    var d = app.documents.add(600,600,72,"guides_grid",NewDocumentMode.RGB,DocumentFill.WHITE);
    for(var i=0;i<=6;i++){
        d.guides.add(Direction.HORIZONTAL, new UnitValue(i*100,"px"));
        d.guides.add(Direction.VERTICAL, new UnitValue(i*100,"px"));
    }
    savePsd(d, "guides_grid"); ok++;
})();}catch(e){fail++; $.writeln("guides_grid: "+e);}

// 15. Annotation (note)
try{(function(){
    var d = app.documents.add(200,200,72,"annotation_note",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 200, "Content");
    // Annotations via action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("annotation"));
    desc.putReference(charIDToTypeID("null"), ref);
    var annDesc = new ActionDescriptor();
    annDesc.putString(charIDToTypeID("Nm  "), "Test Author");
    annDesc.putString(stringIDToTypeID("contents"), "This is a test annotation note.");
    annDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 10);
    annDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 10);
    annDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 50);
    annDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 50);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("annotation"), annDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "annotation_note"); ok++;
})();}catch(e){fail++; $.writeln("annotation_note: "+e);}

// 16. Slices
try{(function(){
    var d = app.documents.add(400,400,72,"slices",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 100, "Content");
    // Create slices via action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("slice"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sliceDesc = new ActionDescriptor();
    sliceDesc.putInteger(charIDToTypeID("Top "), 0);
    sliceDesc.putInteger(charIDToTypeID("Left"), 0);
    sliceDesc.putInteger(charIDToTypeID("Btom"), 200);
    sliceDesc.putInteger(charIDToTypeID("Rght"), 200);
    sliceDesc.putString(charIDToTypeID("Nm  "), "top-left");
    sliceDesc.putString(stringIDToTypeID("url"), "");
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("slice"), sliceDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "slices"); ok++;
})();}catch(e){fail++; $.writeln("slices: "+e);}

// 17. Layer with blend mode + opacity + fill opacity combined
try{(function(){
    var d = app.documents.add(200,200,72,"opacity_fill_blend_combined",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 0, 100, 200, "Base");
    var layer = addColorLayer(d, 255, 0, 0, "Combined");
    layer.blendMode = BlendMode.OVERLAY;
    layer.opacity = 70;
    layer.fillOpacity = 50;
    savePsd(d, "opacity_fill_blend_combined"); ok++;
})();}catch(e){fail++; $.writeln("opacity_fill_blend_combined: "+e);}

// 18. Layer with color overlay using blend mode
try{(function(){
    var d = app.documents.add(200,200,72,"color_overlay_blendmode",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 100, "ColorOverlayBlend");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var co = new ActionDescriptor();
    co.putBoolean(charIDToTypeID("enab"), true);
    co.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Ovrl")); // Overlay
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255);
    clr.putDouble(charIDToTypeID("Grn "), 0);
    clr.putDouble(charIDToTypeID("Bl  "), 128);
    co.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    co.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 80);
    fx.putObject(charIDToTypeID("SoFi"), charIDToTypeID("SoFi"), co);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "color_overlay_blendmode"); ok++;
})();}catch(e){fail++; $.writeln("color_overlay_blendmode: "+e);}

// 19. Gradient overlay effect
try{(function(){
    var d = app.documents.add(200,200,72,"effect_gradient_overlay2",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 150, 150, 150, "GradOverlay");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var go = new ActionDescriptor();
    go.putBoolean(charIDToTypeID("enab"), true);
    go.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    go.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    go.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr ")); // linear
    go.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    go.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    go.putBoolean(charIDToTypeID("Algn"), true);
    // Gradient
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Custom");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    // Colors
    var clrList = new ActionList();
    var c1 = new ActionDescriptor();
    var clr1 = new ActionDescriptor();
    clr1.putDouble(charIDToTypeID("Rd  "), 255); clr1.putDouble(charIDToTypeID("Grn "), 0); clr1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0);
    c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var clr2 = new ActionDescriptor();
    clr2.putDouble(charIDToTypeID("Rd  "), 0); clr2.putDouble(charIDToTypeID("Grn "), 0); clr2.putDouble(charIDToTypeID("Bl  "), 255);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096);
    c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    grad.putList(charIDToTypeID("Clrs"), clrList);
    // Transparency
    var trList = new ActionList();
    var t1 = new ActionDescriptor();
    t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0);
    t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor();
    t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t2.putInteger(charIDToTypeID("Lctn"), 4096);
    t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t2);
    grad.putList(charIDToTypeID("Trns"), trList);
    go.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    fx.putObject(charIDToTypeID("GrFl"), charIDToTypeID("GrFl"), go);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "effect_gradient_overlay2"); ok++;
})();}catch(e){fail++; $.writeln("effect_gradient_overlay2: "+e);}

// 20. Very large canvas
try{(function(){
    var d = app.documents.add(4000,3000,300,"canvas_4000x3000",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 150, 200, "Content");
    savePsd(d, "canvas_4000x3000"); ok++;
})();}catch(e){fail++; $.writeln("canvas_4000x3000: "+e);}

// 21. Canvas with non-standard DPI
try{(function(){
    var d = app.documents.add(200,200,96,"resolution_96dpi",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 100, "Content");
    savePsd(d, "resolution_96dpi"); ok++;
})();}catch(e){fail++; $.writeln("resolution_96dpi: "+e);}

// 22. Grayscale 16-bit
try{(function(){
    var d = app.documents.add(200,200,72,"grayscale_16bit",NewDocumentMode.GRAYSCALE,DocumentFill.WHITE);
    d.bitsPerChannel = BitsPerChannelType.SIXTEEN;
    var layer = d.artLayers.add();
    layer.name = "Gray16";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.gray.gray = 50;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "grayscale_16bit"); ok++;
})();}catch(e){fail++; $.writeln("grayscale_16bit: "+e);}

// 23. CMYK 16-bit
try{(function(){
    var d = app.documents.add(200,200,72,"cmyk_16bit",NewDocumentMode.CMYK,DocumentFill.WHITE);
    d.bitsPerChannel = BitsPerChannelType.SIXTEEN;
    savePsd(d, "cmyk_16bit"); ok++;
})();}catch(e){fail++; $.writeln("cmyk_16bit: "+e);}

// 24. Layer group with blend mode and opacity
try{(function(){
    var d = app.documents.add(200,200,72,"group_blend_mode",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 200, "Base");
    var grp = d.layerSets.add();
    grp.name = "BlendGroup";
    grp.blendMode = BlendMode.MULTIPLY;
    grp.opacity = 80;
    var layer = grp.artLayers.add();
    layer.name = "InGroup";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "group_blend_mode"); ok++;
})();}catch(e){fail++; $.writeln("group_blend_mode: "+e);}

// 25. Nested groups with different blend modes
try{(function(){
    var d = app.documents.add(200,200,72,"nested_groups_blend",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 100, 100, 100, "Base");
    var g1 = d.layerSets.add();
    g1.name = "Outer"; g1.blendMode = BlendMode.SCREEN;
    var g2 = g1.layerSets.add();
    g2.name = "Inner"; g2.blendMode = BlendMode.MULTIPLY;
    var l = g2.artLayers.add();
    l.name = "Content";
    d.activeLayer = l;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=100; c.rgb.blue=50;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "nested_groups_blend"); ok++;
})();}catch(e){fail++; $.writeln("nested_groups_blend: "+e);}

alert("gen_misc2 done: " + ok + " ok, " + fail + " fail");
