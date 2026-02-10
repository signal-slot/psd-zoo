// gen_batch1.jsx - More PSD features: paths, group masks, rasterized layers, etc.
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

// 1. Group with layer mask
try {
    var d = app.documents.add(200,200,72,"group_with_mask",NewDocumentMode.RGB,DocumentFill.WHITE);
    var grp = d.layerSets.add();
    grp.name = "MaskedGroup";
    var layer = grp.artLayers.add();
    layer.name = "Content";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    // Select group and add mask
    d.activeLayer = grp;
    d.selection.select([[0,0],[100,0],[100,200],[0,200]]);
    var maskDesc = new ActionDescriptor();
    maskDesc.putEnumerated(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    maskDesc.putEnumerated(charIDToTypeID("At  "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    maskDesc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), maskDesc, DialogModes.NO);
    d.selection.deselect();
    savePsd(d, "group_with_mask"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 2. Group with vector mask
try {
    var d = app.documents.add(200,200,72,"group_with_vector_mask",NewDocumentMode.RGB,DocumentFill.WHITE);
    var grp = d.layerSets.add();
    grp.name = "VectorMaskedGroup";
    var layer = grp.artLayers.add();
    layer.name = "Content";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    d.activeLayer = grp;
    // Vector mask on group
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("Path"));
    desc.putReference(charIDToTypeID("null"), ref);
    var pathDesc = new ActionDescriptor();
    var subPathList = new ActionList();
    var subPath = new ActionDescriptor();
    subPath.putBoolean(charIDToTypeID("Clsp"), true);
    var points = new ActionList();
    var pts = [[30,30],[170,30],[170,170],[30,170]];
    for(var i=0;i<4;i++){
        var pt = new ActionDescriptor();
        var anc = new ActionDescriptor();
        anc.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), pts[i][0]);
        anc.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), pts[i][1]);
        pt.putObject(charIDToTypeID("Anch"), charIDToTypeID("Pnt "), anc);
        pt.putObject(charIDToTypeID("Fwd "), charIDToTypeID("Pnt "), anc);
        pt.putObject(charIDToTypeID("Bwd "), charIDToTypeID("Pnt "), anc);
        pt.putBoolean(charIDToTypeID("Smoo"), false);
        points.putObject(charIDToTypeID("Pthp"), pt);
    }
    subPath.putList(charIDToTypeID("Pts "), points);
    subPathList.putObject(charIDToTypeID("Sbpl"), subPath);
    pathDesc.putList(charIDToTypeID("SbpL"), subPathList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Path"), pathDesc);
    desc.putEnumerated(charIDToTypeID("At  "), charIDToTypeID("Path"), stringIDToTypeID("vectorMask"));
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(d, "group_with_vector_mask"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 3. Clipping mask on group
try {
    var d = app.documents.add(200,200,72,"clipping_mask_group",NewDocumentMode.RGB,DocumentFill.WHITE);
    var base = d.artLayers.add();
    base.name = "ClipBase";
    d.activeLayer = base;
    d.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=200; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    var grp = d.layerSets.add();
    grp.name = "ClippedGroup";
    var layer = grp.artLayers.add();
    layer.name = "Content";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c2 = new SolidColor(); c2.rgb.red=0; c2.rgb.green=100; c2.rgb.blue=200;
    d.selection.fill(c2);
    d.selection.deselect();
    // Clip group to base
    d.activeLayer = grp;
    var clipDesc = new ActionDescriptor();
    var clipRef = new ActionReference();
    clipRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    clipDesc.putReference(charIDToTypeID("null"), clipRef);
    executeAction(stringIDToTypeID("groupEvent"), clipDesc, DialogModes.NO);
    savePsd(d, "clipping_mask_group"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 4. Rasterized text layer
try {
    var d = app.documents.add(200,200,72,"text_rasterized",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(120,"px")];
    ti.contents = "RASTER";
    layer.rasterize(RasterizeType.TEXTCONTENTS);
    savePsd(d, "text_rasterized"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 5. Rasterized shape layer
try {
    var d = app.documents.add(200,200,72,"shape_rasterized",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(charIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var shapeDesc = new ActionDescriptor();
    var clrContent = new ActionDescriptor();
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 200);
    clr.putDouble(charIDToTypeID("Grn "), 50);
    clr.putDouble(charIDToTypeID("Bl  "), 50);
    clrContent.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    shapeDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), clrContent);
    var shp = new ActionDescriptor();
    shp.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shp.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shp.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putObject(charIDToTypeID("Shp "), charIDToTypeID("Elps"), shp);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), shapeDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.rasterize(RasterizeType.ENTIRELAYER);
    savePsd(d, "shape_rasterized"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 6. Saved path (work path)
try {
    var d = app.documents.add(200,200,72,"saved_path",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 200, "BG");
    // Create a path
    var lineSubPathArray = new Array();
    var lineArray = new Array();
    lineArray[0] = new PathPointInfo();
    lineArray[0].kind = PointKind.CORNERPOINT;
    lineArray[0].anchor = [20, 180];
    lineArray[0].leftDirection = [20, 180];
    lineArray[0].rightDirection = [20, 180];
    lineArray[1] = new PathPointInfo();
    lineArray[1].kind = PointKind.CORNERPOINT;
    lineArray[1].anchor = [100, 20];
    lineArray[1].leftDirection = [100, 20];
    lineArray[1].rightDirection = [100, 20];
    lineArray[2] = new PathPointInfo();
    lineArray[2].kind = PointKind.CORNERPOINT;
    lineArray[2].anchor = [180, 180];
    lineArray[2].leftDirection = [180, 180];
    lineArray[2].rightDirection = [180, 180];
    lineSubPathArray[0] = new SubPathInfo();
    lineSubPathArray[0].operation = ShapeOperation.SHAPEXOR;
    lineSubPathArray[0].closed = true;
    lineSubPathArray[0].entireSubPath = lineArray;
    d.pathItems.add("Triangle Path", lineSubPathArray);
    savePsd(d, "saved_path"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 7. Multiple saved paths
try {
    var d = app.documents.add(200,200,72,"multiple_paths",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 200, "BG");
    // Path 1 - Rectangle
    var sp1 = new Array();
    var pts1 = new Array();
    pts1[0] = new PathPointInfo(); pts1[0].kind = PointKind.CORNERPOINT;
    pts1[0].anchor = [20,20]; pts1[0].leftDirection = [20,20]; pts1[0].rightDirection = [20,20];
    pts1[1] = new PathPointInfo(); pts1[1].kind = PointKind.CORNERPOINT;
    pts1[1].anchor = [80,20]; pts1[1].leftDirection = [80,20]; pts1[1].rightDirection = [80,20];
    pts1[2] = new PathPointInfo(); pts1[2].kind = PointKind.CORNERPOINT;
    pts1[2].anchor = [80,80]; pts1[2].leftDirection = [80,80]; pts1[2].rightDirection = [80,80];
    pts1[3] = new PathPointInfo(); pts1[3].kind = PointKind.CORNERPOINT;
    pts1[3].anchor = [20,80]; pts1[3].leftDirection = [20,80]; pts1[3].rightDirection = [20,80];
    sp1[0] = new SubPathInfo(); sp1[0].operation = ShapeOperation.SHAPEXOR;
    sp1[0].closed = true; sp1[0].entireSubPath = pts1;
    d.pathItems.add("Rectangle", sp1);
    // Path 2 - Triangle
    var sp2 = new Array();
    var pts2 = new Array();
    pts2[0] = new PathPointInfo(); pts2[0].kind = PointKind.CORNERPOINT;
    pts2[0].anchor = [140,20]; pts2[0].leftDirection = [140,20]; pts2[0].rightDirection = [140,20];
    pts2[1] = new PathPointInfo(); pts2[1].kind = PointKind.CORNERPOINT;
    pts2[1].anchor = [180,80]; pts2[1].leftDirection = [180,80]; pts2[1].rightDirection = [180,80];
    pts2[2] = new PathPointInfo(); pts2[2].kind = PointKind.CORNERPOINT;
    pts2[2].anchor = [100,80]; pts2[2].leftDirection = [100,80]; pts2[2].rightDirection = [100,80];
    sp2[0] = new SubPathInfo(); sp2[0].operation = ShapeOperation.SHAPEXOR;
    sp2[0].closed = true; sp2[0].entireSubPath = pts2;
    d.pathItems.add("Triangle", sp2);
    savePsd(d, "multiple_paths"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 8. Smooth curve path (bezier)
try {
    var d = app.documents.add(200,200,72,"path_bezier",NewDocumentMode.RGB,DocumentFill.WHITE);
    addColorLayer(d, 200, 200, 200, "BG");
    var sp = new Array();
    var pts = new Array();
    pts[0] = new PathPointInfo(); pts[0].kind = PointKind.SMOOTHPOINT;
    pts[0].anchor = [20, 100]; pts[0].leftDirection = [20, 50]; pts[0].rightDirection = [20, 150];
    pts[1] = new PathPointInfo(); pts[1].kind = PointKind.SMOOTHPOINT;
    pts[1].anchor = [100, 20]; pts[1].leftDirection = [60, 20]; pts[1].rightDirection = [140, 20];
    pts[2] = new PathPointInfo(); pts[2].kind = PointKind.SMOOTHPOINT;
    pts[2].anchor = [180, 100]; pts[2].leftDirection = [180, 50]; pts[2].rightDirection = [180, 150];
    pts[3] = new PathPointInfo(); pts[3].kind = PointKind.SMOOTHPOINT;
    pts[3].anchor = [100, 180]; pts[3].leftDirection = [140, 180]; pts[3].rightDirection = [60, 180];
    sp[0] = new SubPathInfo(); sp[0].operation = ShapeOperation.SHAPEXOR;
    sp[0].closed = true; sp[0].entireSubPath = pts;
    d.pathItems.add("Bezier Curve", sp);
    savePsd(d, "path_bezier"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 9. Effect disabled but present
try {
    var d = app.documents.add(200,200,72,"effect_disabled",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 150, 200, "WithDisabledEffect");
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), false); // disabled!
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0); clr.putDouble(charIDToTypeID("Grn "), 0); clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 10);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "effect_disabled"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 10. Canvas with transparent background
try {
    var d = app.documents.add(200,200,72,"canvas_transparent",NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
    addColorLayer(d, 255, 0, 0, "Red Square");
    savePsd(d, "canvas_transparent"); ok++;
} catch(e) { fail++; }

// 11. Canvas with black background
try {
    var d = app.documents.add(200,200,72,"canvas_black_bg",NewDocumentMode.RGB,DocumentFill.BLACK);
    var layer = d.artLayers.add();
    layer.name = "White Circle";
    d.activeLayer = layer;
    d.selection.select([[50,50],[150,50],[150,150],[50,150]], SelectionType.REPLACE, 50, false);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=255; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    savePsd(d, "canvas_black_bg"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 12. Layer with applied gaussian blur (non-smart, destructive)
try {
    var d = app.documents.add(200,200,72,"filter_gaussian_blur",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 0, 0, 0, "Blurred");
    d.activeLayer = layer;
    d.selection.select([[80,80],[120,80],[120,120],[80,120]]);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=255; c.rgb.blue=255;
    d.selection.fill(c);
    d.selection.deselect();
    layer.applyGaussianBlur(10);
    savePsd(d, "filter_gaussian_blur"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 13. Layer with unsharp mask applied
try {
    var d = app.documents.add(200,200,72,"filter_unsharp_mask",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 128, 128, 128, "Sharpened");
    layer.applyUnSharpMask(150, 2, 0);
    savePsd(d, "filter_unsharp_mask"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 14. Layer with motion blur applied
try {
    var d = app.documents.add(200,200,72,"filter_motion_blur",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "MotionBlurred";
    d.activeLayer = layer;
    d.selection.select([[70,70],[130,70],[130,130],[70,130]]);
    var c = new SolidColor(); c.rgb.red=255; c.rgb.green=0; c.rgb.blue=0;
    d.selection.fill(c);
    d.selection.deselect();
    layer.applyMotionBlur(45, 20);
    savePsd(d, "filter_motion_blur"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 15. Faux bold text
try {
    var d = app.documents.add(300,200,72,"text_faux_bold",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(30, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "Faux Bold";
    ti.fauxBold = true;
    savePsd(d, "text_faux_bold"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 16. Faux italic text
try {
    var d = app.documents.add(300,200,72,"text_faux_italic",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(30, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "Faux Italic";
    ti.fauxItalic = true;
    savePsd(d, "text_faux_italic"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 17. Text with no-break
try {
    var d = app.documents.add(200,200,72,"text_nobreak",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.kind = TextType.PARAGRAPHTEXT;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(14, "pt");
    ti.position = [new UnitValue(10,"px"), new UnitValue(10,"px")];
    ti.width = new UnitValue(180,"px");
    ti.height = new UnitValue(180,"px");
    ti.noBreak = true;
    ti.contents = "This text should not break across lines if possible";
    savePsd(d, "text_nobreak"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 18. Text justify all
try {
    var d = app.documents.add(300,200,72,"text_justify_all",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.kind = TextType.PARAGRAPHTEXT;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(14, "pt");
    ti.position = [new UnitValue(10,"px"), new UnitValue(10,"px")];
    ti.width = new UnitValue(280,"px");
    ti.height = new UnitValue(180,"px");
    ti.contents = "This text is fully justified including the last line of each paragraph.";
    ti.justification = Justification.FULLYJUSTIFIED;
    savePsd(d, "text_justify_all"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 19. Text left/right indent
try {
    var d = app.documents.add(300,200,72,"text_indent_lr",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.kind = TextType.PARAGRAPHTEXT;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(12, "pt");
    ti.position = [new UnitValue(10,"px"), new UnitValue(10,"px")];
    ti.width = new UnitValue(280,"px");
    ti.height = new UnitValue(180,"px");
    ti.contents = "This paragraph has left and right indentation applied for testing margin parameters.";
    ti.leftIndent = new UnitValue(20, "pt");
    ti.rightIndent = new UnitValue(20, "pt");
    savePsd(d, "text_indent_lr"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 20. Bevel chisel hard technique
try {
    var d = app.documents.add(200,200,72,"bevel_chisel_hard",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 150, 150, 50, "ChiselHard");
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
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("InrB"));
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("Csl ")); // chisel hard
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255); hlClr.putDouble(charIDToTypeID("Grn "), 255); hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0); swClr.putDouble(charIDToTypeID("Grn "), 0); swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_chisel_hard"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 21. Bevel chisel soft technique
try {
    var d = app.documents.add(200,200,72,"bevel_chisel_soft",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 50, 150, 150, "ChiselSoft");
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
    bev.putEnumerated(charIDToTypeID("bvlS"), charIDToTypeID("BESl"), charIDToTypeID("InrB"));
    bev.putEnumerated(charIDToTypeID("bvlT"), charIDToTypeID("bvlT"), charIDToTypeID("SlLt")); // chisel soft
    bev.putUnitDouble(charIDToTypeID("srgR"), charIDToTypeID("#Prc"), 100);
    bev.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    bev.putEnumerated(charIDToTypeID("bvlD"), charIDToTypeID("BESs"), charIDToTypeID("In  "));
    bev.putUnitDouble(charIDToTypeID("Sftn"), charIDToTypeID("#Pxl"), 0);
    bev.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    bev.putUnitDouble(charIDToTypeID("Lald"), charIDToTypeID("#Ang"), 30);
    var hlClr = new ActionDescriptor();
    hlClr.putDouble(charIDToTypeID("Rd  "), 255); hlClr.putDouble(charIDToTypeID("Grn "), 255); hlClr.putDouble(charIDToTypeID("Bl  "), 255);
    bev.putObject(charIDToTypeID("hglC"), charIDToTypeID("RGBC"), hlClr);
    bev.putEnumerated(charIDToTypeID("hglM"), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    bev.putUnitDouble(charIDToTypeID("hglO"), charIDToTypeID("#Prc"), 75);
    var swClr = new ActionDescriptor();
    swClr.putDouble(charIDToTypeID("Rd  "), 0); swClr.putDouble(charIDToTypeID("Grn "), 0); swClr.putDouble(charIDToTypeID("Bl  "), 0);
    bev.putObject(charIDToTypeID("sdwC"), charIDToTypeID("RGBC"), swClr);
    bev.putEnumerated(charIDToTypeID("sdwM"), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    bev.putUnitDouble(charIDToTypeID("sdwO"), charIDToTypeID("#Prc"), 75);
    fx.putObject(charIDToTypeID("ebbl"), charIDToTypeID("ebbl"), bev);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "bevel_chisel_soft"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 22. Drop shadow - layer knocks out shadow
try {
    var d = app.documents.add(200,200,72,"drop_shadow_knockout",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "KnockoutShadow";
    d.activeLayer = layer;
    d.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=100; c.rgb.blue=50;
    d.selection.fill(c);
    d.selection.deselect();
    layer.opacity = 50;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var fx = new ActionDescriptor();
    fx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    fx.putBoolean(stringIDToTypeID("layerConceals"), true); // layer knocks out drop shadow
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var clr = new ActionDescriptor();
    clr.putDouble(charIDToTypeID("Rd  "), 0); clr.putDouble(charIDToTypeID("Grn "), 0); clr.putDouble(charIDToTypeID("Bl  "), 0);
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 15);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 15);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "drop_shadow_knockout"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 23. Layer with noise added
try {
    var d = app.documents.add(200,200,72,"filter_add_noise",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 128, 128, 128, "Noisy");
    layer.applyAddNoise(25, NoiseDistribution.GAUSSIAN, false);
    savePsd(d, "filter_add_noise"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 24. Layer with median filter
try {
    var d = app.documents.add(200,200,72,"filter_median",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = addColorLayer(d, 100, 150, 200, "Median");
    layer.applyMedianNoise(3);
    savePsd(d, "filter_median"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

// 25. Duotone mode
try {
    var d = app.documents.add(200,200,72,"duotone_mode",NewDocumentMode.GRAYSCALE,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.name = "Gray";
    d.activeLayer = layer;
    d.selection.selectAll();
    var c = new SolidColor(); c.gray.gray = 50;
    d.selection.fill(c);
    d.selection.deselect();
    d.flatten();
    // Duotone via action manager
    var desc = new ActionDescriptor();
    desc.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("ClrM"), charIDToTypeID("Dtn "));
    var dtOpts = new ActionDescriptor();
    dtOpts.putEnumerated(charIDToTypeID("DtnT"), charIDToTypeID("DtnT"), charIDToTypeID("Dtn "));
    var ink1 = new ActionDescriptor();
    var clr1 = new ActionDescriptor();
    clr1.putDouble(charIDToTypeID("Bk  "), 100);
    ink1.putObject(charIDToTypeID("Clr "), charIDToTypeID("CMYC"), clr1);
    ink1.putString(charIDToTypeID("Nm  "), "Black");
    var curve1 = new ActionDescriptor();
    curve1.putDouble(stringIDToTypeID("0"), 0);
    curve1.putDouble(stringIDToTypeID("50"), 50);
    curve1.putDouble(stringIDToTypeID("100"), 100);
    ink1.putObject(charIDToTypeID("Crv "), charIDToTypeID("Crv "), curve1);
    dtOpts.putObject(stringIDToTypeID("ink1"), stringIDToTypeID("ink"), ink1);
    var ink2 = new ActionDescriptor();
    var clr2 = new ActionDescriptor();
    clr2.putDouble(charIDToTypeID("Cyn "), 80);
    clr2.putDouble(charIDToTypeID("Mgnt"), 20);
    clr2.putDouble(charIDToTypeID("Ylw "), 0);
    clr2.putDouble(charIDToTypeID("Bk  "), 0);
    ink2.putObject(charIDToTypeID("Clr "), charIDToTypeID("CMYC"), clr2);
    ink2.putString(charIDToTypeID("Nm  "), "Blue");
    var curve2 = new ActionDescriptor();
    curve2.putDouble(stringIDToTypeID("0"), 0);
    curve2.putDouble(stringIDToTypeID("50"), 40);
    curve2.putDouble(stringIDToTypeID("100"), 80);
    ink2.putObject(charIDToTypeID("Crv "), charIDToTypeID("Crv "), curve2);
    dtOpts.putObject(stringIDToTypeID("ink2"), stringIDToTypeID("ink"), ink2);
    desc.putObject(charIDToTypeID("Usng"), charIDToTypeID("DtnS"), dtOpts);
    executeAction(charIDToTypeID("CnvM"), desc, DialogModes.NO);
    savePsd(d, "duotone_mode"); ok++;
} catch(e) { fail++; try{app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}catch(e2){} }

"gen_batch1 done: " + ok + " ok, " + fail + " fail";
