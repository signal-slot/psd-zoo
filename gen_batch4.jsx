// gen_batch4.jsx - Even more PSD test cases
var basePath = "C:/Users/tasuku/com/github/signal-slot/psd-zoo/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

// --- 1. Text vertical ---
try {
    var doc = app.documents.add(200, 400, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "Vertical";
    layer.textItem.position = [100, 50];
    layer.textItem.direction = Direction.VERTICAL;
    savePsd(doc, "text_vertical");
    ok++;
} catch(e) { fail++; }

// --- 2. Shape ellipse ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    var rgbDesc = new ActionDescriptor();
    rgbDesc.putDouble(charIDToTypeID("Rd  "), 200);
    rgbDesc.putDouble(charIDToTypeID("Grn "), 50);
    rgbDesc.putDouble(charIDToTypeID("Bl  "), 100);
    colorDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc);
    layerDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), colorDesc);
    var shapeDesc = new ActionDescriptor();
    shapeDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 180);
    shapeDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 180);
    layerDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Elps"), shapeDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), layerDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, "shape_ellipse");
    ok++;
} catch(e) { fail++; }

// --- 3. Shape triangle (custom polygon) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Create triangle using pen tool path
    var lineArray = [[100, 20], [180, 180], [20, 180]];
    var lineSubPathArray = new SubPathInfo();
    lineSubPathArray.operation = ShapeOperation.SHAPEADD;
    lineSubPathArray.closed = true;
    lineSubPathArray.entireSubPath = [];
    for (var i = 0; i < lineArray.length; i++) {
        var pp = new PathPointInfo();
        pp.kind = PointKind.CORNERPOINT;
        pp.anchor = lineArray[i];
        pp.leftDirection = lineArray[i];
        pp.rightDirection = lineArray[i];
        lineSubPathArray.entireSubPath.push(pp);
    }
    var path = doc.pathItems.add("Triangle", [lineSubPathArray]);
    // Make selection from path and fill on new layer
    path.makeSelection();
    var layer = doc.artLayers.add();
    layer.name = "Triangle";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 200; c.rgb.blue = 100;
    doc.selection.fill(c);
    doc.selection.deselect();
    savePsd(doc, "shape_triangle");
    ok++;
} catch(e) { fail++; }

// --- 4. Noise gradient fill ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Noise Gradient";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    // Fill with noise gradient
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("ClNs"));
    gradDesc.putInteger(charIDToTypeID("Smth"), 2048);
    gradDesc.putInteger(charIDToTypeID("RndS"), 12345);
    gradDesc.putBoolean(stringIDToTypeID("vectorColor"), false);
    gradDesc.putEnumerated(charIDToTypeID("ClrS"), charIDToTypeID("ClrS"), charIDToTypeID("RGBC"));
    var mn1 = new ActionDescriptor(); mn1.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 0);
    var mn2 = new ActionDescriptor(); mn2.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 0);
    var mn3 = new ActionDescriptor(); mn3.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 0);
    var mx1 = new ActionDescriptor(); mx1.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 100);
    var mx2 = new ActionDescriptor(); mx2.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 100);
    var mx3 = new ActionDescriptor(); mx3.putUnitDouble(charIDToTypeID("Lctn"), charIDToTypeID("#Prc"), 100);
    var mnList = new ActionList();
    mnList.putObject(charIDToTypeID("Clrt"), mn1);
    mnList.putObject(charIDToTypeID("Clrt"), mn2);
    mnList.putObject(charIDToTypeID("Clrt"), mn3);
    var mxList = new ActionList();
    mxList.putObject(charIDToTypeID("Clrt"), mx1);
    mxList.putObject(charIDToTypeID("Clrt"), mx2);
    mxList.putObject(charIDToTypeID("Clrt"), mx3);
    gradDesc.putList(charIDToTypeID("Mnm "), mnList);
    gradDesc.putList(charIDToTypeID("Mxm "), mxList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_noise");
    ok++;
} catch(e) { fail++; }

// --- 5. Layer with pattern fill ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Create a simple pattern: checkerboard
    var patDoc = app.documents.add(20, 20, 72, "pattern", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = patDoc.artLayers.add();
    doc.activeLayer = layer;
    var black = new SolidColor(); black.rgb.red = 0; black.rgb.green = 0; black.rgb.blue = 0;
    patDoc.selection.select([[0,0],[10,0],[10,10],[0,10]]);
    patDoc.selection.fill(black);
    patDoc.selection.select([[10,10],[20,10],[20,20],[10,20]]);
    patDoc.selection.fill(black);
    patDoc.selection.deselect();
    // Define pattern
    var defDesc = new ActionDescriptor();
    var refDesc = new ActionReference();
    refDesc.putClass(charIDToTypeID("Ptrn"));
    defDesc.putReference(charIDToTypeID("null"), refDesc);
    defDesc.putString(charIDToTypeID("Nm  "), "Checkerboard");
    var usRef = new ActionReference();
    usRef.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("fsel"));
    usRef.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    executeAction(charIDToTypeID("Mk  "), defDesc, DialogModes.NO);
    patDoc.close(SaveOptions.DONOTSAVECHANGES);
    // Fill layer in main doc with pattern
    doc.activeLayer = doc.artLayers[0];
    doc.selection.selectAll();
    var fillDesc = new ActionDescriptor();
    fillDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("FlCn"), charIDToTypeID("Ptrn"));
    var patRef = new ActionDescriptor();
    patRef.putString(charIDToTypeID("Nm  "), "Checkerboard");
    fillDesc.putObject(charIDToTypeID("Ptrn"), charIDToTypeID("Ptrn"), patRef);
    executeAction(charIDToTypeID("Fl  "), fillDesc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "pattern_checkerboard");
    ok++;
} catch(e) { fail++; }

// --- 6. Adjustment: Vibrance ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 150; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var vibDesc = new ActionDescriptor();
    vibDesc.putInteger(stringIDToTypeID("vibrance"), 50);
    vibDesc.putInteger(charIDToTypeID("Strt"), 20);
    adjType.putObject(charIDToTypeID("Type"), stringIDToTypeID("vibrance"), vibDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_vibrance");
    ok++;
} catch(e) { fail++; }

// --- 7. Adjustment: Exposure ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 128; c.rgb.blue = 128;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var expDesc = new ActionDescriptor();
    expDesc.putDouble(stringIDToTypeID("presetKind"), 1);
    expDesc.putDouble(stringIDToTypeID("exposure"), 1.5);
    expDesc.putDouble(stringIDToTypeID("offset"), 0.0);
    expDesc.putDouble(stringIDToTypeID("gammaCorrection"), 1.0);
    adjType.putObject(charIDToTypeID("Type"), stringIDToTypeID("exposure"), expDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_exposure");
    ok++;
} catch(e) { fail++; }

// --- 8. Gradient with multiple stops ---
try {
    var doc = app.documents.add(300, 100, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Rainbow";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Rainbow");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var colors = [[255,0,0],[255,165,0],[255,255,0],[0,128,0],[0,0,255],[128,0,128]];
    for (var i = 0; i < colors.length; i++) {
        var cs = new ActionDescriptor();
        var cc = new ActionDescriptor();
        cc.putDouble(charIDToTypeID("Rd  "), colors[i][0]);
        cc.putDouble(charIDToTypeID("Grn "), colors[i][1]);
        cc.putDouble(charIDToTypeID("Bl  "), colors[i][2]);
        cs.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc);
        cs.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
        cs.putInteger(charIDToTypeID("Lctn"), Math.round(i * 4096 / (colors.length - 1)));
        cs.putInteger(charIDToTypeID("Mdpn"), 50);
        clrList.putObject(charIDToTypeID("Clrt"), cs);
    }
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor(); t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor(); t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t2);
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_rainbow");
    ok++;
} catch(e) { fail++; }

// --- 9. Smart object (embedded) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "To Smart Object";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 128; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Convert to smart object
    var desc = new ActionDescriptor();
    executeAction(stringIDToTypeID("newPlacedLayer"), desc, DialogModes.NO);
    savePsd(doc, "smart_object_embedded");
    ok++;
} catch(e) { fail++; }

// --- 10. Clipping mask chain (3 layers) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Base layer
    var base = doc.artLayers.add();
    base.name = "Clip Base";
    doc.activeLayer = base;
    doc.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var c1 = new SolidColor(); c1.rgb.red = 128; c1.rgb.green = 128; c1.rgb.blue = 128;
    doc.selection.fill(c1); doc.selection.deselect();
    // Clipped layer 1
    var clip1 = doc.artLayers.add();
    clip1.name = "Clipped 1";
    doc.activeLayer = clip1;
    var c2 = new SolidColor(); c2.rgb.red = 255; c2.rgb.green = 0; c2.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c2); doc.selection.deselect();
    clip1.grouped = true;
    // Clipped layer 2
    var clip2 = doc.artLayers.add();
    clip2.name = "Clipped 2";
    doc.activeLayer = clip2;
    var c3 = new SolidColor(); c3.rgb.red = 0; c3.rgb.green = 0; c3.rgb.blue = 255;
    doc.selection.select([[0,0],[200,0],[200,100],[0,100]]);
    doc.selection.fill(c3); doc.selection.deselect();
    clip2.grouped = true;
    savePsd(doc, "clipping_chain");
    ok++;
} catch(e) { fail++; }

// --- 11. Large number of layers (50) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    for (var i = 0; i < 50; i++) {
        var layer = doc.artLayers.add();
        layer.name = "Layer " + (i + 1);
        layer.opacity = 10 + Math.round(Math.random() * 80);
    }
    savePsd(doc, "layers_50");
    ok++;
} catch(e) { fail++; }

// --- 12. Canvas 4000x4000 (large) ---
try {
    var doc = app.documents.add(4000, 4000, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Big Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 100; c.rgb.blue = 50;
    doc.selection.select([[500,500],[3500,500],[3500,3500],[500,3500]]);
    doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "canvas_4000");
    ok++;
} catch(e) { fail++; }

// --- 13. 300 DPI document ---
try {
    var doc = app.documents.add(600, 600, 300, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(12, "pt");
    layer.textItem.contents = "300 DPI";
    layer.textItem.position = [50, 100];
    savePsd(doc, "dpi_300");
    ok++;
} catch(e) { fail++; }

// --- 14. Group with opacity ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var group = doc.layerSets.add();
    group.name = "Semi-transparent Group";
    group.opacity = 50;
    var layer = group.artLayers.add();
    layer.name = "Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "group_opacity");
    ok++;
} catch(e) { fail++; }

// --- 15. Group with blend mode ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Background color
    var bg = doc.artLayers.add();
    bg.name = "BG Color";
    doc.activeLayer = bg;
    var c1 = new SolidColor(); c1.rgb.red = 100; c1.rgb.green = 100; c1.rgb.blue = 255;
    doc.selection.selectAll(); doc.selection.fill(c1); doc.selection.deselect();
    var group = doc.layerSets.add();
    group.name = "Multiply Group";
    group.blendMode = BlendMode.MULTIPLY;
    var layer = group.artLayers.add();
    layer.name = "Content";
    doc.activeLayer = layer;
    var c2 = new SolidColor(); c2.rgb.red = 255; c2.rgb.green = 128; c2.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c2); doc.selection.deselect();
    savePsd(doc, "group_blend_multiply");
    ok++;
} catch(e) { fail++; }

// --- 16. Flattened to background ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Color";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 50; c.rgb.green = 150; c.rgb.blue = 200;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    doc.flatten();
    savePsd(doc, "flattened_bg");
    ok++;
} catch(e) { fail++; }

// --- 17. Layer with vector mask and layer mask ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Dual Masked";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 200; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add layer mask
    doc.selection.select([[20,20],[180,20],[180,180],[20,180]]);
    var mDesc = new ActionDescriptor();
    mDesc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var mRef = new ActionReference();
    mRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    mDesc.putReference(charIDToTypeID("At  "), mRef);
    mDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), mDesc, DialogModes.NO);
    doc.selection.deselect();
    // Add vector mask (ellipse)
    var vDesc = new ActionDescriptor();
    var vRef = new ActionReference();
    vRef.putClass(charIDToTypeID("Path"));
    vDesc.putReference(charIDToTypeID("null"), vRef);
    var atRef = new ActionReference();
    atRef.putEnumerated(charIDToTypeID("Path"), charIDToTypeID("Path"), stringIDToTypeID("vectorMask"));
    vDesc.putReference(charIDToTypeID("At  "), atRef);
    var shDesc = new ActionDescriptor();
    shDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    vDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Elps"), shDesc);
    executeAction(charIDToTypeID("Mk  "), vDesc, DialogModes.NO);
    savePsd(doc, "dual_mask");
    ok++;
} catch(e) { fail++; }

// --- 18. Different canvas colors ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);
    // Set background to specific color first
    app.backgroundColor.rgb.red = 128;
    app.backgroundColor.rgb.green = 0;
    app.backgroundColor.rgb.blue = 128;
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);
    var layer = doc.artLayers.add();
    layer.name = "Content";
    savePsd(doc, "canvas_purple_bg");
    ok++;
} catch(e) { fail++; }

// --- 19. Linked layers (aligned) ---
try {
    var doc = app.documents.add(300, 300, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var l1 = doc.artLayers.add();
    l1.name = "Link A";
    doc.activeLayer = l1;
    var c1 = new SolidColor(); c1.rgb.red = 255; c1.rgb.green = 0; c1.rgb.blue = 0;
    doc.selection.select([[10,10],[100,10],[100,100],[10,100]]);
    doc.selection.fill(c1); doc.selection.deselect();
    var l2 = doc.artLayers.add();
    l2.name = "Link B";
    doc.activeLayer = l2;
    var c2 = new SolidColor(); c2.rgb.red = 0; c2.rgb.green = 0; c2.rgb.blue = 255;
    doc.selection.select([[150,150],[250,150],[250,250],[150,250]]);
    doc.selection.fill(c2); doc.selection.deselect();
    // Link layers via Action Manager
    var desc = new ActionDescriptor();
    var refList = new ActionList();
    var r1 = new ActionReference();
    r1.putName(charIDToTypeID("Lyr "), "Link A");
    refList.putReference(r1);
    var r2 = new ActionReference();
    r2.putName(charIDToTypeID("Lyr "), "Link B");
    refList.putReference(r2);
    desc.putList(charIDToTypeID("null"), refList);
    executeAction(stringIDToTypeID("linkSelectedLayers"), desc, DialogModes.NO);
    savePsd(doc, "linked_layers");
    ok++;
} catch(e) { fail++; }

// --- 20. Layer comp ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var l1 = doc.artLayers.add();
    l1.name = "Red";
    doc.activeLayer = l1;
    var c1 = new SolidColor(); c1.rgb.red = 255; c1.rgb.green = 0; c1.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c1); doc.selection.deselect();
    var l2 = doc.artLayers.add();
    l2.name = "Blue";
    doc.activeLayer = l2;
    var c2 = new SolidColor(); c2.rgb.red = 0; c2.rgb.green = 0; c2.rgb.blue = 255;
    doc.selection.selectAll(); doc.selection.fill(c2); doc.selection.deselect();
    l2.visible = false;
    // Add layer comp "Red visible"
    var comp1 = doc.layerComps.add("Red Visible", "Shows red layer", true, true, true);
    // Switch to show blue
    l1.visible = false;
    l2.visible = true;
    var comp2 = doc.layerComps.add("Blue Visible", "Shows blue layer", true, true, true);
    savePsd(doc, "layer_comps");
    ok++;
} catch(e) { fail++; }

// --- 21. Background layer (locked) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Background layer is already locked by default
    // Add content on top
    var layer = doc.artLayers.add();
    layer.name = "Overlay";
    layer.opacity = 70;
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 200; c.rgb.blue = 0;
    doc.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "background_locked");
    ok++;
} catch(e) { fail++; }

// --- 22. Text with drop shadow effect ---
try {
    var doc = app.documents.add(300, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Bold";
    layer.textItem.size = new UnitValue(36, "pt");
    layer.textItem.contents = "Shadow";
    layer.textItem.position = [30, 120];
    layer.textItem.color.rgb.red = 255;
    layer.textItem.color.rgb.green = 255;
    layer.textItem.color.rgb.blue = 255;
    // Fill background dark
    var bg = doc.artLayers.add();
    bg.name = "Dark BG";
    bg.move(layer, ElementPlacement.PLACEAFTER);
    doc.activeLayer = bg;
    var c = new SolidColor(); c.rgb.red = 30; c.rgb.green = 30; c.rgb.blue = 30;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add drop shadow to text
    doc.activeLayer = layer;
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
    var dsc = new ActionDescriptor();
    dsc.putDouble(charIDToTypeID("Rd  "), 0); dsc.putDouble(charIDToTypeID("Grn "), 0); dsc.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), dsc);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 90);
    ds.putBoolean(charIDToTypeID("uglg"), true);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 135);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 4);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 8);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    lfx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "text_drop_shadow");
    ok++;
} catch(e) { fail++; }

// --- 23. Layer style: Gradient Overlay ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Overlay Target";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 128; c.rgb.blue = 128;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add gradient overlay effect
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var goDesc = new ActionDescriptor();
    goDesc.putBoolean(charIDToTypeID("enab"), true);
    goDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    goDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    // Gradient
    var grad = new ActionDescriptor();
    grad.putString(charIDToTypeID("Nm  "), "Custom");
    grad.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    grad.putDouble(charIDToTypeID("Intr"), 4096);
    var gClrs = new ActionList();
    var gc1 = new ActionDescriptor(); var gcc1 = new ActionDescriptor();
    gcc1.putDouble(charIDToTypeID("Rd  "), 255); gcc1.putDouble(charIDToTypeID("Grn "), 0); gcc1.putDouble(charIDToTypeID("Bl  "), 0);
    gc1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), gcc1);
    gc1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    gc1.putInteger(charIDToTypeID("Lctn"), 0); gc1.putInteger(charIDToTypeID("Mdpn"), 50);
    gClrs.putObject(charIDToTypeID("Clrt"), gc1);
    var gc2 = new ActionDescriptor(); var gcc2 = new ActionDescriptor();
    gcc2.putDouble(charIDToTypeID("Rd  "), 0); gcc2.putDouble(charIDToTypeID("Grn "), 0); gcc2.putDouble(charIDToTypeID("Bl  "), 255);
    gc2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), gcc2);
    gc2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    gc2.putInteger(charIDToTypeID("Lctn"), 4096); gc2.putInteger(charIDToTypeID("Mdpn"), 50);
    gClrs.putObject(charIDToTypeID("Clrt"), gc2);
    grad.putList(charIDToTypeID("Clrs"), gClrs);
    var gTrns = new ActionList();
    var gt1 = new ActionDescriptor(); gt1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); gt1.putInteger(charIDToTypeID("Lctn"), 0); gt1.putInteger(charIDToTypeID("Mdpn"), 50); gTrns.putObject(charIDToTypeID("TrnS"), gt1);
    var gt2 = new ActionDescriptor(); gt2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); gt2.putInteger(charIDToTypeID("Lctn"), 4096); gt2.putInteger(charIDToTypeID("Mdpn"), 50); gTrns.putObject(charIDToTypeID("TrnS"), gt2);
    grad.putList(charIDToTypeID("Trns"), gTrns);
    goDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), grad);
    goDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    goDesc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    lfx.putObject(charIDToTypeID("GrFl"), charIDToTypeID("GrFl"), goDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "effect_gradient_overlay");
    ok++;
} catch(e) { fail++; }

// --- 24. Mixed content: text + shape + raster ---
try {
    var doc = app.documents.add(400, 300, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Raster layer
    var raster = doc.artLayers.add();
    raster.name = "Raster Circle";
    doc.activeLayer = raster;
    doc.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    var c1 = new SolidColor(); c1.rgb.red = 255; c1.rgb.green = 200; c1.rgb.blue = 0;
    doc.selection.fill(c1); doc.selection.deselect();
    // Text layer
    var text = doc.artLayers.add();
    text.kind = LayerKind.TEXT;
    text.textItem.font = "Roboto-Bold";
    text.textItem.size = new UnitValue(28, "pt");
    text.textItem.contents = "Mixed Content";
    text.textItem.position = [50, 250];
    // Shape layer (rectangle)
    var shDesc = new ActionDescriptor();
    var shRef = new ActionReference();
    shRef.putClass(stringIDToTypeID("contentLayer"));
    shDesc.putReference(charIDToTypeID("null"), shRef);
    var shLayer = new ActionDescriptor();
    var shColor = new ActionDescriptor();
    var shRgb = new ActionDescriptor();
    shRgb.putDouble(charIDToTypeID("Rd  "), 0);
    shRgb.putDouble(charIDToTypeID("Grn "), 100);
    shRgb.putDouble(charIDToTypeID("Bl  "), 200);
    shColor.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), shRgb);
    shLayer.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), shColor);
    var rect = new ActionDescriptor();
    rect.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 50);
    rect.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 200);
    rect.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 200);
    rect.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 370);
    shLayer.putObject(charIDToTypeID("Shp "), charIDToTypeID("Rctn"), rect);
    shDesc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shLayer);
    executeAction(charIDToTypeID("Mk  "), shDesc, DialogModes.NO);
    savePsd(doc, "mixed_text_shape_raster");
    ok++;
} catch(e) { fail++; }

// --- 25. CMYK with adjustment ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.CMYK, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "CMYK Color";
    doc.activeLayer = layer;
    var c = new SolidColor();
    c.cmyk.cyan = 80; c.cmyk.magenta = 20; c.cmyk.yellow = 0; c.cmyk.black = 10;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "cmyk_with_color");
    ok++;
} catch(e) { fail++; }

"gen_batch4 done: " + ok + " ok, " + fail + " fail";
