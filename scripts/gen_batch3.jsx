// gen_batch3.jsx - More PSD test cases
var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

// --- 1. Layer mask from selection (feathered) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Masked Layer";
    doc.selection.select([[20,20],[180,20],[180,180],[20,180]]);
    doc.selection.feather(15);
    layer.applyAdd();  // fill with something
    // Fill selection with red
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    doc.selection.fill(c);
    // Add mask from selection
    var desc = new ActionDescriptor();
    desc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    desc.putReference(charIDToTypeID("At  "), ref);
    desc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, "mask_feathered");
    ok++;
} catch(e) { fail++; }

// --- 2. Layer mask disabled ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Mask Disabled";
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 128; c.rgb.blue = 255;
    doc.selection.selectAll();
    doc.selection.fill(c);
    doc.selection.deselect();
    // Add mask
    doc.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    var desc = new ActionDescriptor();
    desc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    desc.putReference(charIDToTypeID("At  "), ref);
    desc.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    // Disable mask
    var descDis = new ActionDescriptor();
    var refDis = new ActionReference();
    refDis.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    descDis.putReference(charIDToTypeID("null"), refDis);
    var descTo = new ActionDescriptor();
    descTo.putBoolean(charIDToTypeID("UsrM"), false);
    descDis.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), descTo);
    executeAction(charIDToTypeID("setd"), descDis, DialogModes.NO);
    savePsd(doc, "mask_disabled");
    ok++;
} catch(e) { fail++; }

// --- 3. Fill opacity different from layer opacity ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Fill vs Opacity";
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 0;
    doc.selection.selectAll();
    doc.selection.fill(c);
    doc.selection.deselect();
    layer.opacity = 80;
    layer.fillOpacity = 30;
    savePsd(doc, "fill_vs_opacity");
    ok++;
} catch(e) { fail++; }

// --- 4. Layer with multiple effects combined ---
try {
    var doc = app.documents.add(300, 300, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Multi Effects";
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 150; c.rgb.blue = 200;
    doc.selection.select([[50,50],[250,50],[250,250],[50,250]]);
    doc.selection.fill(c);
    doc.selection.deselect();
    // Drop shadow + inner shadow + outer glow + bevel via Action Manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfxDesc = new ActionDescriptor();
    lfxDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    // Drop shadow
    var dsDesc = new ActionDescriptor();
    dsDesc.putBoolean(charIDToTypeID("enab"), true);
    dsDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var dsColor = new ActionDescriptor();
    dsColor.putDouble(charIDToTypeID("Rd  "), 0);
    dsColor.putDouble(charIDToTypeID("Grn "), 0);
    dsColor.putDouble(charIDToTypeID("Bl  "), 0);
    dsDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), dsColor);
    dsDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
    dsDesc.putBoolean(charIDToTypeID("uglg"), true);
    dsDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    dsDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    dsDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    dsDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 10);
    dsDesc.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    lfxDesc.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), dsDesc);
    // Inner shadow
    var isDesc = new ActionDescriptor();
    isDesc.putBoolean(charIDToTypeID("enab"), true);
    isDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var isColor = new ActionDescriptor();
    isColor.putDouble(charIDToTypeID("Rd  "), 0);
    isColor.putDouble(charIDToTypeID("Grn "), 0);
    isColor.putDouble(charIDToTypeID("Bl  "), 0);
    isDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), isColor);
    isDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    isDesc.putBoolean(charIDToTypeID("uglg"), true);
    isDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
    isDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 3);
    isDesc.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    isDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    lfxDesc.putObject(charIDToTypeID("IrSh"), charIDToTypeID("IrSh"), isDesc);
    // Outer glow
    var ogDesc = new ActionDescriptor();
    ogDesc.putBoolean(charIDToTypeID("enab"), true);
    ogDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var ogColor = new ActionDescriptor();
    ogColor.putDouble(charIDToTypeID("Rd  "), 255);
    ogColor.putDouble(charIDToTypeID("Grn "), 255);
    ogColor.putDouble(charIDToTypeID("Bl  "), 0);
    ogDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), ogColor);
    ogDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 60);
    ogDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 15);
    lfxDesc.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), ogDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfxDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "effects_combined_3");
    ok++;
} catch(e) { fail++; }

// --- 5. Text with superscript ---
try {
    var doc = app.documents.add(300, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "E=mc2";
    layer.textItem.position = [20, 100];
    // Set superscript on "2" via Action Manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("TxLr"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    // Full range normal
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 3);
    var style1 = new ActionDescriptor();
    style1.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    style1.putString(charIDToTypeID("FntS"), "Regular");
    style1.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    style1.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("normal"));
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), style1);
    list.putObject(charIDToTypeID("Txtt"), r1);
    // Superscript range
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 4);
    r2.putInteger(charIDToTypeID("T   "), 5);
    var style2 = new ActionDescriptor();
    style2.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    style2.putString(charIDToTypeID("FntS"), "Regular");
    style2.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    style2.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("superScript"));
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), style2);
    list.putObject(charIDToTypeID("Txtt"), r2);
    txDesc.putList(charIDToTypeID("Txtt"), list);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "text_superscript");
    ok++;
} catch(e) { fail++; }

// --- 6. Text with subscript ---
try {
    var doc = app.documents.add(300, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "H2O";
    layer.textItem.position = [20, 100];
    // subscript on "2"
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("TxLr"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 1);
    var s1 = new ActionDescriptor();
    s1.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    s1.putString(charIDToTypeID("FntS"), "Regular");
    s1.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    s1.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("normal"));
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s1);
    list.putObject(charIDToTypeID("Txtt"), r1);
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 1);
    r2.putInteger(charIDToTypeID("T   "), 2);
    var s2 = new ActionDescriptor();
    s2.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    s2.putString(charIDToTypeID("FntS"), "Regular");
    s2.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    s2.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("subScript"));
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s2);
    list.putObject(charIDToTypeID("Txtt"), r2);
    var r3 = new ActionDescriptor();
    r3.putInteger(charIDToTypeID("From"), 2);
    r3.putInteger(charIDToTypeID("T   "), 3);
    var s3 = new ActionDescriptor();
    s3.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    s3.putString(charIDToTypeID("FntS"), "Regular");
    s3.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    s3.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("normal"));
    r3.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s3);
    list.putObject(charIDToTypeID("Txtt"), r3);
    txDesc.putList(charIDToTypeID("Txtt"), list);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "text_subscript");
    ok++;
} catch(e) { fail++; }

// --- 7. Gradient layer (linear) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Linear";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    // Apply gradient via Action Manager
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    // Stop 1: red
    var c1 = new ActionDescriptor();
    var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 255);
    cc1.putDouble(charIDToTypeID("Grn "), 0);
    cc1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0);
    c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    // Stop 2: blue
    var c2 = new ActionDescriptor();
    var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 0);
    cc2.putDouble(charIDToTypeID("Grn "), 0);
    cc2.putDouble(charIDToTypeID("Bl  "), 255);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096);
    c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
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
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_linear");
    ok++;
} catch(e) { fail++; }

// --- 8. Gradient radial ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Radial";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor();
    var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 255); cc1.putDouble(charIDToTypeID("Grn "), 255); cc1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor();
    var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 128); cc2.putDouble(charIDToTypeID("Grn "), 0); cc2.putDouble(charIDToTypeID("Bl  "), 128);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor(); t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor(); t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t2);
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Rdl "));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_radial");
    ok++;
} catch(e) { fail++; }

// --- 9. Gradient angle ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Angle";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor(); var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 0); cc1.putDouble(charIDToTypeID("Grn "), 200); cc1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor(); var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 200); cc2.putDouble(charIDToTypeID("Grn "), 100); cc2.putDouble(charIDToTypeID("Bl  "), 0);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor(); t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor(); t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t2);
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Angl"));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_angle");
    ok++;
} catch(e) { fail++; }

// --- 10. Gradient diamond ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Diamond";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor(); var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 255); cc1.putDouble(charIDToTypeID("Grn "), 255); cc1.putDouble(charIDToTypeID("Bl  "), 255);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor(); var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 0); cc2.putDouble(charIDToTypeID("Grn "), 0); cc2.putDouble(charIDToTypeID("Bl  "), 0);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor(); t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t1.putInteger(charIDToTypeID("Lctn"), 0); t1.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor(); t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); t2.putInteger(charIDToTypeID("Lctn"), 4096); t2.putInteger(charIDToTypeID("Mdpn"), 50); trList.putObject(charIDToTypeID("TrnS"), t2);
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Dmnd"));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_diamond");
    ok++;
} catch(e) { fail++; }

// --- 11. Shape with rounded corners (rounded rect) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Use Action Manager for rounded rectangle shape
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var layerDesc = new ActionDescriptor();
    var colorDesc = new ActionDescriptor();
    var rgbDesc = new ActionDescriptor();
    rgbDesc.putDouble(charIDToTypeID("Rd  "), 50);
    rgbDesc.putDouble(charIDToTypeID("Grn "), 150);
    rgbDesc.putDouble(charIDToTypeID("Bl  "), 250);
    colorDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc);
    layerDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), colorDesc);
    var shapeDesc = new ActionDescriptor();
    shapeDesc.putUnitDouble(charIDToTypeID("unitValueQuadVersion"), charIDToTypeID("#Pxl"), 1);
    shapeDesc.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 30);
    shapeDesc.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 30);
    shapeDesc.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 170);
    shapeDesc.putUnitDouble(stringIDToTypeID("topLeft"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putUnitDouble(stringIDToTypeID("topRight"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putUnitDouble(stringIDToTypeID("bottomLeft"), charIDToTypeID("#Pxl"), 20);
    shapeDesc.putUnitDouble(stringIDToTypeID("bottomRight"), charIDToTypeID("#Pxl"), 20);
    layerDesc.putObject(charIDToTypeID("Shp "), stringIDToTypeID("roundedRect"), shapeDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), layerDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    savePsd(doc, "shape_rounded_rect");
    ok++;
} catch(e) { fail++; }

// --- 12. Layer name with special characters ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Layer (copy) #2 @special!";
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 100; c.rgb.blue = 50;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "layer_name_special");
    ok++;
} catch(e) { fail++; }

// --- 13. Layer name with unicode ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "\u2605 Star \u2764 Heart \u266B Music";
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 200; c.rgb.blue = 150;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "layer_name_unicode");
    ok++;
} catch(e) { fail++; }

// --- 14. Very deep nesting (5 levels) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var g1 = doc.layerSets.add(); g1.name = "Level 1";
    var g2 = g1.layerSets.add(); g2.name = "Level 2";
    var g3 = g2.layerSets.add(); g3.name = "Level 3";
    var g4 = g3.layerSets.add(); g4.name = "Level 4";
    var g5 = g4.layerSets.add(); g5.name = "Level 5";
    var layer = g5.artLayers.add(); layer.name = "Deep Layer";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 128; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "nesting_5_levels");
    ok++;
} catch(e) { fail++; }

// --- 15. Multiple layer masks ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    // Layer 1 with mask
    var l1 = doc.artLayers.add(); l1.name = "Red Masked";
    doc.activeLayer = l1;
    var c1 = new SolidColor(); c1.rgb.red = 255; c1.rgb.green = 0; c1.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c1); doc.selection.deselect();
    doc.selection.select([[10,10],[100,10],[100,100],[10,100]]);
    var d1 = new ActionDescriptor();
    d1.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var r1 = new ActionReference();
    r1.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    d1.putReference(charIDToTypeID("At  "), r1);
    d1.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), d1, DialogModes.NO);
    // Layer 2 with mask
    var l2 = doc.artLayers.add(); l2.name = "Blue Masked";
    doc.activeLayer = l2;
    var c2 = new SolidColor(); c2.rgb.red = 0; c2.rgb.green = 0; c2.rgb.blue = 255;
    doc.selection.selectAll(); doc.selection.fill(c2); doc.selection.deselect();
    doc.selection.select([[100,100],[190,100],[190,190],[100,190]]);
    var d2 = new ActionDescriptor();
    d2.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
    var r2 = new ActionReference();
    r2.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
    d2.putReference(charIDToTypeID("At  "), r2);
    d2.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
    executeAction(charIDToTypeID("Mk  "), d2, DialogModes.NO);
    savePsd(doc, "multiple_layer_masks");
    ok++;
} catch(e) { fail++; }

// --- 16. Alpha channel (spot color) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Content";
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 64; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add a spot color channel
    var spotColor = new SolidColor();
    spotColor.rgb.red = 255; spotColor.rgb.green = 0; spotColor.rgb.blue = 0;
    var channel = doc.channels.add();
    channel.name = "Spot Red";
    channel.kind = ChannelType.SPOTCOLOR;
    channel.color = spotColor;
    savePsd(doc, "spot_color_channel");
    ok++;
} catch(e) { fail++; }

// --- 17. Multiple alpha channels ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 100; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add alpha channels
    var ch1 = doc.channels.add(); ch1.name = "Alpha 1"; ch1.kind = ChannelType.MASKEDAREA;
    var ch2 = doc.channels.add(); ch2.name = "Alpha 2"; ch2.kind = ChannelType.MASKEDAREA;
    var ch3 = doc.channels.add(); ch3.name = "Alpha 3"; ch3.kind = ChannelType.SELECTEDAREA;
    savePsd(doc, "multiple_alpha_channels");
    ok++;
} catch(e) { fail++; }

// --- 18. Text with rotation ---
try {
    var doc = app.documents.add(300, 300, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Bold";
    layer.textItem.size = new UnitValue(30, "pt");
    layer.textItem.contents = "Rotated";
    layer.textItem.position = [80, 150];
    // Rotate via transform
    layer.rotate(45, AnchorPosition.MIDDLECENTER);
    savePsd(doc, "text_rotated");
    ok++;
} catch(e) { fail++; }

// --- 19. Layer with transform (scale + rotate) ---
try {
    var doc = app.documents.add(300, 300, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Transformed";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 180; c.rgb.blue = 180;
    doc.selection.select([[50,50],[250,50],[250,250],[50,250]]);
    doc.selection.fill(c);
    doc.selection.deselect();
    layer.resize(75, 75, AnchorPosition.MIDDLECENTER);
    layer.rotate(30, AnchorPosition.MIDDLECENTER);
    savePsd(doc, "layer_transformed");
    ok++;
} catch(e) { fail++; }

// --- 20. Empty layer (transparent) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Empty Layer";
    // Don't fill anything - layer is completely transparent
    savePsd(doc, "empty_layer");
    ok++;
} catch(e) { fail++; }

// --- 21. Layer at canvas edge (partially outside) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Outside Canvas";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 0; c.rgb.blue = 128;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Move partially outside canvas
    layer.translate(-100, -50);
    savePsd(doc, "layer_outside_canvas");
    ok++;
} catch(e) { fail++; }

// --- 22. Adjustment: Posterize ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var bg = doc.artLayers.add();
    bg.name = "Background Color";
    doc.activeLayer = bg;
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 150; c.rgb.blue = 200;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Create gradient content to posterize
    var layer = doc.artLayers.add();
    layer.name = "Gradient Base";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor(); var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 0); cc1.putDouble(charIDToTypeID("Grn "), 0); cc1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor(); var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 255); cc2.putDouble(charIDToTypeID("Grn "), 255); cc2.putDouble(charIDToTypeID("Bl  "), 255);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
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
    // Add posterize adjustment layer
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var postDesc = new ActionDescriptor();
    postDesc.putInteger(charIDToTypeID("Lvls"), 4);
    adjType.putObject(charIDToTypeID("Type"), charIDToTypeID("Pstr"), postDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_posterize");
    ok++;
} catch(e) { fail++; }

// --- 23. Adjustment: Threshold ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 128; c.rgb.blue = 128;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var threshDesc = new ActionDescriptor();
    threshDesc.putInteger(charIDToTypeID("Lvl "), 128);
    adjType.putObject(charIDToTypeID("Type"), charIDToTypeID("Thrs"), threshDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_threshold");
    ok++;
} catch(e) { fail++; }

// --- 24. Adjustment: Invert ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Colored";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 100; c.rgb.blue = 50;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    adjType.putClass(charIDToTypeID("Type"), charIDToTypeID("Invr"));
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_invert");
    ok++;
} catch(e) { fail++; }

// --- 25. Adjustment: Black & White ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Colored Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 150; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var bwDesc = new ActionDescriptor();
    bwDesc.putUnitDouble(charIDToTypeID("Rd  "), charIDToTypeID("#Prc"), 40);
    bwDesc.putUnitDouble(charIDToTypeID("Yllw"), charIDToTypeID("#Prc"), 60);
    bwDesc.putUnitDouble(charIDToTypeID("Grn "), charIDToTypeID("#Prc"), 40);
    bwDesc.putUnitDouble(charIDToTypeID("Cyn "), charIDToTypeID("#Prc"), 60);
    bwDesc.putUnitDouble(charIDToTypeID("Bl  "), charIDToTypeID("#Prc"), 20);
    bwDesc.putUnitDouble(charIDToTypeID("Mgnt"), charIDToTypeID("#Prc"), 80);
    bwDesc.putBoolean(stringIDToTypeID("useTint"), false);
    adjType.putObject(charIDToTypeID("Type"), stringIDToTypeID("blackAndWhite"), bwDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_black_white");
    ok++;
} catch(e) { fail++; }

"gen_batch3 done: " + ok + " ok, " + fail + " fail";
