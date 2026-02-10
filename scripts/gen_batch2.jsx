// gen_batch2.jsx - Even more PSD features
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

// 1. Rounded rectangle shape
try {
    var d = app.documents.add(200,200,72,"shape_rounded_rect",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 100);
    clr.putDouble(charIDToTypeID("Grn "), 150);
    clr.putDouble(charIDToTypeID("Bl  "), 200);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(stringIDToTypeID("topLeft"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("topRight"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("bottomLeft"), charIDToTypeID("#Pxl"), 20);
    shp.putUnitDouble(stringIDToTypeID("bottomRight"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("roundedRect"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_rounded_rect"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 2. Rounded rect with different corner radii
try {
    var d = app.documents.add(200,200,72,"shape_rounded_rect_uneven",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 200); clr.putDouble(charIDToTypeID("Grn "), 100); clr.putDouble(charIDToTypeID("Bl  "), 50);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(stringIDToTypeID("topLeft"), charIDToTypeID("#Pxl"), 40);
    shp.putUnitDouble(stringIDToTypeID("topRight"), charIDToTypeID("#Pxl"), 10);
    shp.putUnitDouble(stringIDToTypeID("bottomLeft"), charIDToTypeID("#Pxl"), 0);
    shp.putUnitDouble(stringIDToTypeID("bottomRight"), charIDToTypeID("#Pxl"), 30);
    shapeDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("roundedRect"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_rounded_rect_uneven"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 3. Shape with stroke and fill
try {
    var d = app.documents.add(200,200,72,"shape_fill_and_stroke",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 255); clr.putDouble(charIDToTypeID("Grn "), 200); clr.putDouble(charIDToTypeID("Bl  "), 0);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    // Stroke style
    var strokeDesc = new ActionDescriptor();
    strokeDesc.putUnitDouble(stringIDToTypeID("strokeStyleLineWidth"), charIDToTypeID("#Pxl"), 5);
    strokeDesc.putBoolean(stringIDToTypeID("strokeEnabled"), true);
    strokeDesc.putBoolean(stringIDToTypeID("fillEnabled"), true);
    var strokeClr = new ActionDescriptor();
    strokeClr.putDouble(charIDToTypeID("Rd  "), 0); strokeClr.putDouble(charIDToTypeID("Grn "), 0); strokeClr.putDouble(charIDToTypeID("Bl  "), 200);
    var strokeContent = new ActionDescriptor();
    strokeContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), strokeClr);
    strokeDesc.putObject(stringIDToTypeID("strokeStyleContent"), stringIDToTypeID("solidColorLayer"), strokeContent);
    shapeDesc.putObject(stringIDToTypeID("strokeStyle"), stringIDToTypeID("strokeStyle"), strokeDesc);
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "shape_fill_and_stroke"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 4. Multiple artboards
try {
    var d = app.documents.add(400,200,72,"multiple_artboards",NewDocumentMode.RGB,DocumentFill.WHITE);
    // Create artboard via action manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("artboardSection"));
    desc.putReference(charIDToTypeID("null"), ref);
    var abDesc = new ActionDescriptor();
    abDesc.putString(charIDToTypeID("Nm  "), "Artboard 1");
    var bounds = new ActionDescriptor();
    bounds.putDouble(charIDToTypeID("Top "), 0);
    bounds.putDouble(charIDToTypeID("Left"), 0);
    bounds.putDouble(charIDToTypeID("Btom"), 200);
    bounds.putDouble(charIDToTypeID("Rght"), 180);
    abDesc.putObject(stringIDToTypeID("artboardRect"), charIDToTypeID("classFloatRect"), bounds);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("artboardSection"), abDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    // Second artboard
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putClass(stringIDToTypeID("artboardSection"));
    desc2.putReference(charIDToTypeID("null"), ref2);
    var abDesc2 = new ActionDescriptor();
    abDesc2.putString(charIDToTypeID("Nm  "), "Artboard 2");
    var bounds2 = new ActionDescriptor();
    bounds2.putDouble(charIDToTypeID("Top "), 0);
    bounds2.putDouble(charIDToTypeID("Left"), 210);
    bounds2.putDouble(charIDToTypeID("Btom"), 200);
    bounds2.putDouble(charIDToTypeID("Rght"), 390);
    abDesc2.putObject(stringIDToTypeID("artboardRect"), charIDToTypeID("classFloatRect"), bounds2);
    desc2.putObject(charIDToTypeID("Usng"), stringIDToTypeID("artboardSection"), abDesc2);
    executeAction(charIDToTypeID("Mk  "), desc2, DialogModes.NO);
    savePsd(d, "multiple_artboards"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 5. Indexed color mode (via flatten + convert)
try {
    var d = app.documents.add(200,200,72,"indexed_color",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 50, "Red");
    addColorLayer(d, 50, 200, 100, "Green");
    d.flatten();
    var opts = new IndexedConversionOptions();
    opts.colors = 256;
    opts.dither = Dither.DIFFUSION;
    opts.ditherAmount = 75;
    opts.palette = Palette.LOCALADAPTIVE;
    d.changeMode(ChangeMode.INDEXEDCOLOR, opts);
    savePsd(d, "indexed_color"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 6. Multichannel mode
try {
    var d = app.documents.add(200,200,72,"multichannel_mode",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 128, 64, 32, "Content");
    d.flatten();
    d.changeMode(ChangeMode.MULTICHANNEL);
    savePsd(d, "multichannel_mode"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 7-11. Color tags (all colors)
var colorTags = [
    ["red", "Rd  "],
    ["orange", "Orng"],
    ["yellow", "Ylw "],
    ["green", "Grn "],
    ["blue", "Bl  "],
    ["violet", "Vlt "],
    ["gray", "Gry "]
];
for (var ct = 0; ct < colorTags.length; ct++) {
    try {
        var d = app.documents.add(200,200,72,"layer_color_" + colorTags[ct][0],NewDocumentMode.RGB,DocumentFill.WHITE);
        var layer = addColorLayer(d, 150, 150, 150, "Tagged");
        d.activeLayer = layer;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        var lDesc = new ActionDescriptor();
        lDesc.putEnumerated(charIDToTypeID("Clr "), charIDToTypeID("Clr "), charIDToTypeID(colorTags[ct][1]));
        desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), lDesc);
        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
        savePsd(d, "layer_color_" + colorTags[ct][0]); ok++;
    } catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }
}

// 12. Stroke with gradient fill type
try {
    var d = app.documents.add(200,200,72,"stroke_gradient",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 150, 200, "GradStroke");
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
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("GrFl")); // gradient fill
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 5);
    strk.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    strk.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    strk.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    strk.putBoolean(charIDToTypeID("Algn"), true);
    // Gradient
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Custom");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    var clrs = new ActionList();
    var c1 = new ActionDescriptor();
    var cl1 = new ActionDescriptor(); cl1.putDouble(charIDToTypeID("Rd  "), 255); cl1.putDouble(charIDToTypeID("Grn "), 0); cl1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cl1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var cl2 = new ActionDescriptor(); cl2.putDouble(charIDToTypeID("Rd  "), 0); cl2.putDouble(charIDToTypeID("Grn "), 0); cl2.putDouble(charIDToTypeID("Bl  "), 255);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cl2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrs.putObject(charIDToTypeID("Clrt"), c2);
    grad.putList(charIDToTypeID("Clrs"), clrs);
    var trns = new ActionList();
    var t1 = new ActionDescriptor(); t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor(); t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trns.putObject(charIDToTypeID("TrnS"), t2);
    grad.putList(charIDToTypeID("Trns"), trns);
    strk.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "stroke_gradient"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 13. Layer with radial blur filter
try {
    var d = app.documents.add(200,200,72,"filter_radial_blur",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 50, "RadialBlurred");
    d.activeLayer = layer;
    d.selection.select([[80,80],[120,80],[120,120],[80,120]]);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=255; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    layer.applyRadialBlur(20, RadialBlurMethod.SPIN, RadialBlurQuality.GOOD);
    savePsd(d, "filter_radial_blur"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 14. Layer with twirl filter
try {
    var d = app.documents.add(200,200,72,"filter_twirl",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "Twirled";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    d.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    var c2 = new SolidColor(); c2.rgb.red=255; c2.rgb.green=128; c2.rgb.blue=0;
    d.selection.fill(c2);
    d.selection.deselect();
    layer.applyTwirl(120);
    savePsd(d, "filter_twirl"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 15. Layer with spherize filter
try {
    var d = app.documents.add(200,200,72,"filter_spherize",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 100, 200, "Spherized");
    d.activeLayer = layer;
    d.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=200; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    layer.applySpherize(75, SpherizeMode.NORMAL);
    savePsd(d, "filter_spherize"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 16. Layer with emboss/relief filter
try {
    var d = app.documents.add(200,200,72,"filter_emboss",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 128, 128, 128, "Embossed");
    d.activeLayer = layer;
    d.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=200; c.rgb.blue=200;
    d.selection.fill(c);
    d.selection.deselect();
    // Emboss filter via action manager
    var desc = new ActionDescriptor();
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 135);
    desc.putInteger(charIDToTypeID("Hght"), 3);
    desc.putUnitDouble(charIDToTypeID("Amnt"), charIDToTypeID("#Prc"), 100);
    executeAction(charIDToTypeID("Embs"), desc, DialogModes.NO);
    savePsd(d, "filter_emboss"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 17. Smart object with multiple filters stacked
try {
    var d = app.documents.add(200,200,72,"smart_filter_stack",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 200, 100, 50, "Content");
    d.activeLayer = layer;
    d.selection.select([[60,60],[140,60],[140,140],[60,140]]);
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=100; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    // Convert to smart object
    executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    // Apply multiple filters
    var gb = new ActionDescriptor();
    gb.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 3);
    executeAction(charIDToTypeID("GsnB"), gb, DialogModes.NO);
    // USM
    var usm = new ActionDescriptor();
    usm.putUnitDouble(charIDToTypeID("Amnt"), charIDToTypeID("#Prc"), 100);
    usm.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), 1);
    usm.putInteger(charIDToTypeID("Thsh"), 0);
    executeAction(charIDToTypeID("UnsM"), usm, DialogModes.NO);
    savePsd(d, "smart_filter_stack"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 18. 16-bit RGB with layers
try {
    var d = app.documents.add(200,200,72,"depth_16bit_layers",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 100, 50, "Red");
    addColorLayer(d, 50, 100, 200, "Blue");
    d.bitsPerChannel = BitsPerChannelType.SIXTEEN;
    savePsd(d, "depth_16bit_layers"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 19. Linked smart object
try {
    var d = app.documents.add(200,200,72,"smart_object_linked",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 200, 100, "Content");
    d.activeLayer = layer;
    // Convert to smart object and save externally
    executeAction(stringIDToTypeID("newPlacedLayer"), new ActionDescriptor(), DialogModes.NO);
    savePsd(d, "smart_object_linked"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 20. Layer with color range selection preserved in channels
try {
    var d = app.documents.add(200,200,72,"channel_selection",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 50, 50, "Red Area");
    d.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    // Save selection as channel
    d.selection.store(d.channels.add());
    d.channels[d.channels.length-1].name = "Saved Selection";
    d.selection.deselect();
    savePsd(d, "channel_selection"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

"gen_batch2 done: " + ok + " ok, " + fail + " fail";
