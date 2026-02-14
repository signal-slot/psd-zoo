// === Shape variations, path operations, rounded rect ===
function savePsd(doc, path) {
    var f = new File(path); var o = new PhotoshopSaveOptions(); o.alphaChannels=true; o.layers=true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
function makeShape(doc, name, colorR, colorG, colorB, shapeType, shapeDesc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "), colorR); cd.putDouble(charIDToTypeID("Grn "), colorG); cd.putDouble(charIDToTypeID("Bl  "), colorB);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    sd.putObject(charIDToTypeID("Shp "), shapeType, shapeDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    doc.activeLayer.name = name;
}
var B = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok=0, fail=0;

// shape_rect_small
try{(function(){
    var d = app.documents.add(200,200,72,"shape_rect_small",NewDocumentMode.RGB,DocumentFill.WHITE);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),80);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),80);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),120);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),120);
    makeShape(d,"Small Rect",255,0,0,charIDToTypeID("Rctn"),r);
    savePsd(d,B+"shape_rect_small.psd"); ok++;
})();}catch(e){fail++;}

// shape_rect_full
try{(function(){
    var d = app.documents.add(200,200,72,"shape_rect_full",NewDocumentMode.RGB,DocumentFill.WHITE);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),0);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),0);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),200);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),200);
    makeShape(d,"Full Rect",0,128,255,charIDToTypeID("Rctn"),r);
    savePsd(d,B+"shape_rect_full.psd"); ok++;
})();}catch(e){fail++;}

// shape_ellipse_wide
try{(function(){
    var d = app.documents.add(300,200,72,"shape_ellipse_wide",NewDocumentMode.RGB,DocumentFill.WHITE);
    var e2 = new ActionDescriptor();
    e2.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),50);
    e2.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),20);
    e2.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),150);
    e2.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),280);
    makeShape(d,"Wide Ellipse",255,128,0,charIDToTypeID("Elps"),e2);
    savePsd(d,B+"shape_ellipse_wide.psd"); ok++;
})();}catch(e){fail++;}

// shape_ellipse_tall
try{(function(){
    var d = app.documents.add(200,300,72,"shape_ellipse_tall",NewDocumentMode.RGB,DocumentFill.WHITE);
    var e2 = new ActionDescriptor();
    e2.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),20);
    e2.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),50);
    e2.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),280);
    e2.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),150);
    makeShape(d,"Tall Ellipse",0,200,128,charIDToTypeID("Elps"),e2);
    savePsd(d,B+"shape_ellipse_tall.psd"); ok++;
})();}catch(e){fail++;}

// shape_circle_perfect
try{(function(){
    var d = app.documents.add(200,200,72,"shape_circle",NewDocumentMode.RGB,DocumentFill.WHITE);
    var e2 = new ActionDescriptor();
    e2.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),10);
    e2.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),10);
    e2.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),190);
    e2.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),190);
    makeShape(d,"Circle",128,0,255,charIDToTypeID("Elps"),e2);
    savePsd(d,B+"shape_circle.psd"); ok++;
})();}catch(e){fail++;}

// shape_square_perfect
try{(function(){
    var d = app.documents.add(200,200,72,"shape_square",NewDocumentMode.RGB,DocumentFill.WHITE);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),25);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),25);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),175);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),175);
    makeShape(d,"Square",0,180,0,charIDToTypeID("Rctn"),r);
    savePsd(d,B+"shape_square.psd"); ok++;
})();}catch(e){fail++;}

// shape_gradient_fill (shape with gradient instead of solid)
try{(function(){
    var d = app.documents.add(200,200,72,"shape_gradient_fill",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    // Gradient fill
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("linear"));
    gDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 45);
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "ShapeGrad");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor(); var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "),255); c1.putDouble(charIDToTypeID("Grn "),0); c1.putDouble(charIDToTypeID("Bl  "),0);
    cs1.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c1); cs1.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"),0); cs1.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs1);
    var cs2 = new ActionDescriptor(); var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "),0); c2.putDouble(charIDToTypeID("Grn "),0); c2.putDouble(charIDToTypeID("Bl  "),255);
    cs2.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c2); cs2.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"),4096); cs2.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs2);
    gradDesc.putList(charIDToTypeID("Clrs"),csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts1.putInteger(charIDToTypeID("Lctn"),0); ts1.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts2.putInteger(charIDToTypeID("Lctn"),4096); ts2.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts2);
    gradDesc.putList(charIDToTypeID("Trns"),tsList);
    gDesc.putObject(charIDToTypeID("Grad"),charIDToTypeID("Grdn"),gradDesc);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),170);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Gradient Shape";
    savePsd(d,B+"shape_gradient_fill.psd"); ok++;
})();}catch(e){fail++;}

// shape_no_fill (stroke only, no fill)
try{(function(){
    var d = app.documents.add(200,200,72,"shape_no_fill",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),0); cd.putDouble(charIDToTypeID("Grn "),0); cd.putDouble(charIDToTypeID("Bl  "),0);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),170);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    var stk = new ActionDescriptor();
    stk.putBoolean(stringIDToTypeID("fillEnabled"), false);
    stk.putBoolean(stringIDToTypeID("strokeEnabled"), true);
    var skClr = new ActionDescriptor(); skClr.putDouble(charIDToTypeID("Rd  "),255); skClr.putDouble(charIDToTypeID("Grn "),0); skClr.putDouble(charIDToTypeID("Bl  "),0);
    var skCnt = new ActionDescriptor(); skCnt.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),skClr);
    stk.putObject(stringIDToTypeID("strokeStyleContent"),stringIDToTypeID("solidColorLayer"),skCnt);
    stk.putUnitDouble(stringIDToTypeID("strokeStyleLineWidth"),charIDToTypeID("#Pxl"),3);
    sd.putObject(stringIDToTypeID("strokeStyle"),stringIDToTypeID("strokeStyle"),stk);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "No Fill Stroke Only";
    savePsd(d,B+"shape_no_fill.psd"); ok++;
})();}catch(e){fail++;}

// shape_dashed_stroke
try{(function(){
    var d = app.documents.add(200,200,72,"shape_dashed_stroke",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),200); cd.putDouble(charIDToTypeID("Grn "),220); cd.putDouble(charIDToTypeID("Bl  "),255);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),170);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    var stk = new ActionDescriptor();
    stk.putBoolean(stringIDToTypeID("fillEnabled"), true);
    stk.putBoolean(stringIDToTypeID("strokeEnabled"), true);
    var skClr = new ActionDescriptor(); skClr.putDouble(charIDToTypeID("Rd  "),0); skClr.putDouble(charIDToTypeID("Grn "),0); skClr.putDouble(charIDToTypeID("Bl  "),0);
    var skCnt = new ActionDescriptor(); skCnt.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),skClr);
    stk.putObject(stringIDToTypeID("strokeStyleContent"),stringIDToTypeID("solidColorLayer"),skCnt);
    stk.putUnitDouble(stringIDToTypeID("strokeStyleLineWidth"),charIDToTypeID("#Pxl"),2);
    stk.putEnumerated(stringIDToTypeID("strokeStyleLineDashSet"),stringIDToTypeID("strokeStyleLineDashSet"),stringIDToTypeID("strokeStyleLineDashSet1"));
    sd.putObject(stringIDToTypeID("strokeStyle"),stringIDToTypeID("strokeStyle"),stk);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Dashed Stroke";
    savePsd(d,B+"shape_dashed_stroke.psd"); ok++;
})();}catch(e){fail++;}

// shape_stroke_gradient
try{(function(){
    var d = app.documents.add(200,200,72,"shape_stroke_gradient",NewDocumentMode.RGB,DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var sd = new ActionDescriptor();
    var cd = new ActionDescriptor(); cd.putDouble(charIDToTypeID("Rd  "),230); cd.putDouble(charIDToTypeID("Grn "),230); cd.putDouble(charIDToTypeID("Bl  "),230);
    var sol = new ActionDescriptor(); sol.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd);
    sd.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol);
    var r = new ActionDescriptor();
    r.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),30);
    r.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),170);
    sd.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r);
    var stk = new ActionDescriptor();
    stk.putBoolean(stringIDToTypeID("fillEnabled"), true);
    stk.putBoolean(stringIDToTypeID("strokeEnabled"), true);
    // Gradient stroke content
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"),stringIDToTypeID("gradientType"),stringIDToTypeID("linear"));
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "),"StrokeGrad");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"),charIDToTypeID("GrdF"),charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"),4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor(); var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "),255); c1.putDouble(charIDToTypeID("Grn "),0); c1.putDouble(charIDToTypeID("Bl  "),0);
    cs1.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c1); cs1.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"),0); cs1.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs1);
    var cs2 = new ActionDescriptor(); var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "),0); c2.putDouble(charIDToTypeID("Grn "),255); c2.putDouble(charIDToTypeID("Bl  "),0);
    cs2.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),c2); cs2.putEnumerated(charIDToTypeID("Type"),charIDToTypeID("Clry"),charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"),4096); cs2.putInteger(charIDToTypeID("Mdpn"),50); csList.putObject(charIDToTypeID("Clrt"),cs2);
    gradDesc.putList(charIDToTypeID("Clrs"),csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts1.putInteger(charIDToTypeID("Lctn"),0); ts1.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"),charIDToTypeID("#Prc"),100); ts2.putInteger(charIDToTypeID("Lctn"),4096); ts2.putInteger(charIDToTypeID("Mdpn"),50); tsList.putObject(charIDToTypeID("TrnS"),ts2);
    gradDesc.putList(charIDToTypeID("Trns"),tsList);
    gDesc.putObject(charIDToTypeID("Grad"),charIDToTypeID("Grdn"),gradDesc);
    stk.putObject(stringIDToTypeID("strokeStyleContent"),stringIDToTypeID("gradientLayer"),gDesc);
    stk.putUnitDouble(stringIDToTypeID("strokeStyleLineWidth"),charIDToTypeID("#Pxl"),5);
    sd.putObject(stringIDToTypeID("strokeStyle"),stringIDToTypeID("strokeStyle"),stk);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Gradient Stroke";
    savePsd(d,B+"shape_stroke_gradient.psd"); ok++;
})();}catch(e){fail++;}

// shape_multiple_on_layer (two rects on same shape layer via path combine)
try{(function(){
    var d = app.documents.add(300,200,72,"shape_multiple_on_layer",NewDocumentMode.RGB,DocumentFill.WHITE);
    // First rect
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference(); ref1.putClass(stringIDToTypeID("contentLayer"));
    desc1.putReference(charIDToTypeID("null"), ref1);
    var sd1 = new ActionDescriptor();
    var cd1 = new ActionDescriptor(); cd1.putDouble(charIDToTypeID("Rd  "),255); cd1.putDouble(charIDToTypeID("Grn "),128); cd1.putDouble(charIDToTypeID("Bl  "),0);
    var sol1 = new ActionDescriptor(); sol1.putObject(charIDToTypeID("Clr "),charIDToTypeID("RGBC"),cd1);
    sd1.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), sol1);
    var r1 = new ActionDescriptor();
    r1.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),30);
    r1.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),20);
    r1.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),170);
    r1.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),140);
    sd1.putObject(charIDToTypeID("Shp "),charIDToTypeID("Rctn"),r1);
    desc1.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), sd1);
    executeAction(charIDToTypeID("Mk  "), desc1, DialogModes.NO);
    d.activeLayer.name = "Two Rects";
    // Add second rect to same layer
    var desc2 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(charIDToTypeID("Path"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc2.putReference(charIDToTypeID("null"), ref2);
    var r2 = new ActionDescriptor();
    r2.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),50);
    r2.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),160);
    r2.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),150);
    r2.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),280);
    desc2.putObject(charIDToTypeID("T   "), charIDToTypeID("Rctn"), r2);
    executeAction(stringIDToTypeID("addTo"), desc2, DialogModes.NO);
    savePsd(d,B+"shape_multiple_on_layer.psd"); ok++;
})();}catch(e){fail++;}

alert("Shapes: ok="+ok+" fail="+fail);
