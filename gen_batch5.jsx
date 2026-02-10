// gen_batch5.jsx - Additional PSD test cases
var basePath = "C:/Users/tasuku/com/github/signal-slot/psd-zoo/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

// --- 1. Layer style copied (multiple layers same style) ---
try {
    var doc = app.documents.add(300, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    for (var i = 0; i < 3; i++) {
        var layer = doc.artLayers.add();
        layer.name = "Styled " + (i + 1);
        doc.activeLayer = layer;
        var c = new SolidColor();
        c.rgb.red = [255, 0, 0][i]; c.rgb.green = [0, 255, 0][i]; c.rgb.blue = [0, 0, 255][i];
        doc.selection.select([[10 + i * 90, 30], [90 + i * 90, 30], [90 + i * 90, 170], [10 + i * 90, 170]]);
        doc.selection.fill(c); doc.selection.deselect();
        // Add drop shadow to each
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
        ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 75);
        ds.putBoolean(charIDToTypeID("uglg"), true);
        ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 120);
        ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 3);
        ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
        ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
        ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
        lfx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
        desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    }
    savePsd(doc, "multiple_styled_layers");
    ok++;
} catch(e) { fail++; }

// --- 2. Blend mode: Pass Through group ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var bg = doc.artLayers.add();
    bg.name = "BG";
    doc.activeLayer = bg;
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 100; c.rgb.blue = 200;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var group = doc.layerSets.add();
    group.name = "Pass Through";
    group.blendMode = BlendMode.PASSTHROUGH;
    var layer = group.artLayers.add();
    layer.name = "Content";
    doc.activeLayer = layer;
    var c2 = new SolidColor(); c2.rgb.red = 255; c2.rgb.green = 128; c2.rgb.blue = 0;
    doc.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    doc.selection.fill(c2); doc.selection.deselect();
    layer.blendMode = BlendMode.MULTIPLY;
    savePsd(doc, "group_passthrough");
    ok++;
} catch(e) { fail++; }

// --- 3. Stroke effect inside ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Stroke Inside";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 200; c.rgb.blue = 100;
    doc.selection.select([[30,30],[170,30],[170,170],[30,170]]);
    doc.selection.fill(c); doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var frDesc = new ActionDescriptor();
    frDesc.putBoolean(charIDToTypeID("enab"), true);
    frDesc.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("InsF"));
    frDesc.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    frDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    frDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    frDesc.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 5);
    var frc = new ActionDescriptor();
    frc.putDouble(charIDToTypeID("Rd  "), 255); frc.putDouble(charIDToTypeID("Grn "), 0); frc.putDouble(charIDToTypeID("Bl  "), 0);
    frDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), frc);
    lfx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), frDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "stroke_inside");
    ok++;
} catch(e) { fail++; }

// --- 4. Stroke effect outside ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Stroke Outside";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 100; c.rgb.blue = 200;
    doc.selection.select([[40,40],[160,40],[160,160],[40,160]]);
    doc.selection.fill(c); doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var frDesc = new ActionDescriptor();
    frDesc.putBoolean(charIDToTypeID("enab"), true);
    frDesc.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    frDesc.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    frDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    frDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    frDesc.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 4);
    var frc = new ActionDescriptor();
    frc.putDouble(charIDToTypeID("Rd  "), 0); frc.putDouble(charIDToTypeID("Grn "), 0); frc.putDouble(charIDToTypeID("Bl  "), 0);
    frDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), frc);
    lfx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), frDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "stroke_outside");
    ok++;
} catch(e) { fail++; }

// --- 5. Satin effect ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Satin";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 50; c.rgb.blue = 50;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var satDesc = new ActionDescriptor();
    satDesc.putBoolean(charIDToTypeID("enab"), true);
    satDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    var satClr = new ActionDescriptor();
    satClr.putDouble(charIDToTypeID("Rd  "), 0); satClr.putDouble(charIDToTypeID("Grn "), 0); satClr.putDouble(charIDToTypeID("Bl  "), 0);
    satDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), satClr);
    satDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 50);
    satDesc.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 19);
    satDesc.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 11);
    satDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 14);
    satDesc.putBoolean(charIDToTypeID("AntA"), true);
    satDesc.putBoolean(charIDToTypeID("Invr"), true);
    lfx.putObject(charIDToTypeID("ChFX"), charIDToTypeID("ChFX"), satDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "effect_satin");
    ok++;
} catch(e) { fail++; }

// --- 6. Inner glow with center source ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Inner Glow Center";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 50; c.rgb.green = 50; c.rgb.blue = 150;
    doc.selection.select([[20,20],[180,20],[180,180],[20,180]]);
    doc.selection.fill(c); doc.selection.deselect();
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var lfx = new ActionDescriptor();
    lfx.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
    var igDesc = new ActionDescriptor();
    igDesc.putBoolean(charIDToTypeID("enab"), true);
    igDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    var igClr = new ActionDescriptor();
    igClr.putDouble(charIDToTypeID("Rd  "), 255); igClr.putDouble(charIDToTypeID("Grn "), 255); igClr.putDouble(charIDToTypeID("Bl  "), 200);
    igDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), igClr);
    igDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 80);
    igDesc.putEnumerated(charIDToTypeID("glwS"), charIDToTypeID("IGSr"), charIDToTypeID("SrcC"));
    igDesc.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 30);
    lfx.putObject(charIDToTypeID("IrGl"), charIDToTypeID("IrGl"), igDesc);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), lfx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "inner_glow_center");
    ok++;
} catch(e) { fail++; }

// --- 7. Text with color per character ---
try {
    var doc = app.documents.add(400, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Bold";
    layer.textItem.size = new UnitValue(36, "pt");
    layer.textItem.contents = "COLOR";
    layer.textItem.position = [30, 120];
    // Set different colors per character via Action Manager
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("TxLr"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    var colors = [[255,0,0],[255,165,0],[0,128,0],[0,0,255],[128,0,128]];
    for (var i = 0; i < 5; i++) {
        var r = new ActionDescriptor();
        r.putInteger(charIDToTypeID("From"), i);
        r.putInteger(charIDToTypeID("T   "), i + 1);
        var style = new ActionDescriptor();
        style.putString(charIDToTypeID("FntN"), "Roboto-Bold");
        style.putString(charIDToTypeID("FntS"), "Bold");
        style.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 36);
        var clr = new ActionDescriptor();
        clr.putDouble(charIDToTypeID("Rd  "), colors[i][0]);
        clr.putDouble(charIDToTypeID("Grn "), colors[i][1]);
        clr.putDouble(charIDToTypeID("Bl  "), colors[i][2]);
        style.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
        r.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), style);
        list.putObject(charIDToTypeID("Txtt"), r);
    }
    txDesc.putList(charIDToTypeID("Txtt"), list);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "text_multicolor");
    ok++;
} catch(e) { fail++; }

// --- 8. Text with mixed sizes ---
try {
    var doc = app.documents.add(400, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.textItem.font = "Roboto-Regular";
    layer.textItem.size = new UnitValue(24, "pt");
    layer.textItem.contents = "Big and small";
    layer.textItem.position = [20, 120];
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("TxLr"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txDesc = new ActionDescriptor();
    var list = new ActionList();
    // "Big" in large
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 3);
    var s1 = new ActionDescriptor();
    s1.putString(charIDToTypeID("FntN"), "Roboto-Bold");
    s1.putString(charIDToTypeID("FntS"), "Bold");
    s1.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 48);
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s1);
    list.putObject(charIDToTypeID("Txtt"), r1);
    // " and " in normal
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 3);
    r2.putInteger(charIDToTypeID("T   "), 8);
    var s2 = new ActionDescriptor();
    s2.putString(charIDToTypeID("FntN"), "Roboto-Regular");
    s2.putString(charIDToTypeID("FntS"), "Regular");
    s2.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 24);
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s2);
    list.putObject(charIDToTypeID("Txtt"), r2);
    // "small" in small italic
    var r3 = new ActionDescriptor();
    r3.putInteger(charIDToTypeID("From"), 8);
    r3.putInteger(charIDToTypeID("T   "), 13);
    var s3 = new ActionDescriptor();
    s3.putString(charIDToTypeID("FntN"), "Roboto-Italic");
    s3.putString(charIDToTypeID("FntS"), "Italic");
    s3.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pnt"), 14);
    r3.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), s3);
    list.putObject(charIDToTypeID("Txtt"), r3);
    txDesc.putList(charIDToTypeID("Txtt"), list);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(doc, "text_mixed_sizes");
    ok++;
} catch(e) { fail++; }

// --- 9. Layer order test (bottom to top: R, G, B) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var red = doc.artLayers.add();
    red.name = "Red Bottom";
    doc.activeLayer = red;
    var c1 = new SolidColor(); c1.rgb.red = 255; c1.rgb.green = 0; c1.rgb.blue = 0;
    doc.selection.select([[20,20],[120,20],[120,120],[20,120]]);
    doc.selection.fill(c1); doc.selection.deselect();
    var green = doc.artLayers.add();
    green.name = "Green Middle";
    doc.activeLayer = green;
    var c2 = new SolidColor(); c2.rgb.red = 0; c2.rgb.green = 255; c2.rgb.blue = 0;
    doc.selection.select([[50,50],[150,50],[150,150],[50,150]]);
    doc.selection.fill(c2); doc.selection.deselect();
    var blue = doc.artLayers.add();
    blue.name = "Blue Top";
    doc.activeLayer = blue;
    var c3 = new SolidColor(); c3.rgb.red = 0; c3.rgb.green = 0; c3.rgb.blue = 255;
    doc.selection.select([[80,80],[180,80],[180,180],[80,180]]);
    doc.selection.fill(c3); doc.selection.deselect();
    savePsd(doc, "layer_order_rgb");
    ok++;
} catch(e) { fail++; }

// --- 10. Adjustment: Color Lookup (3D LUT) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 150; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Create color lookup adjustment
    var adjDesc = new ActionDescriptor();
    var adjRef = new ActionReference();
    adjRef.putClass(charIDToTypeID("AdjL"));
    adjDesc.putReference(charIDToTypeID("null"), adjRef);
    var adjType = new ActionDescriptor();
    var clDesc = new ActionDescriptor();
    clDesc.putString(stringIDToTypeID("lookupType"), "3DLUT");
    clDesc.putString(charIDToTypeID("Nm  "), "3DLUT");
    clDesc.putBoolean(stringIDToTypeID("dither"), true);
    adjType.putObject(charIDToTypeID("Type"), stringIDToTypeID("colorLookup"), clDesc);
    adjDesc.putObject(charIDToTypeID("Usng"), charIDToTypeID("AdjL"), adjType);
    executeAction(charIDToTypeID("Mk  "), adjDesc, DialogModes.NO);
    savePsd(doc, "adjustment_color_lookup");
    ok++;
} catch(e) { fail++; }

// --- 11. Gradient reflected ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gradient Reflected";
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
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), stringIDToTypeID("reflected"));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "gradient_reflected");
    ok++;
} catch(e) { fail++; }

// --- 12. Photoshop Big (PSB) saved as PSD ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Normal Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 200; c.rgb.blue = 128;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "normal_content");
    ok++;
} catch(e) { fail++; }

// --- 13. Layer with blend if (this layer) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var bg = doc.artLayers.add();
    bg.name = "Background";
    doc.activeLayer = bg;
    var cbg = new SolidColor(); cbg.rgb.red = 200; cbg.rgb.green = 200; cbg.rgb.blue = 200;
    doc.selection.selectAll(); doc.selection.fill(cbg); doc.selection.deselect();
    var layer = doc.artLayers.add();
    layer.name = "Blend If This";
    doc.activeLayer = layer;
    // Create gradient for blend-if testing
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
    // Set blend-if: this layer 50-200
    var bDesc = new ActionDescriptor();
    var bRef = new ActionReference();
    bRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    bDesc.putReference(charIDToTypeID("null"), bRef);
    var bTo = new ActionDescriptor();
    var bRange = new ActionList();
    bRange.putInteger(50);
    bRange.putInteger(50);
    bRange.putInteger(200);
    bRange.putInteger(200);
    bTo.putList(stringIDToTypeID("blendRange"), bRange);
    bDesc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), bTo);
    executeAction(charIDToTypeID("setd"), bDesc, DialogModes.NO);
    savePsd(doc, "blend_if_this");
    ok++;
} catch(e) { fail++; }

// --- 14. Guides (horizontal + vertical) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 200; c.rgb.green = 100; c.rgb.blue = 150;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add guides
    doc.guides.add(Direction.HORIZONTAL, new UnitValue(50, "px"));
    doc.guides.add(Direction.HORIZONTAL, new UnitValue(150, "px"));
    doc.guides.add(Direction.VERTICAL, new UnitValue(50, "px"));
    doc.guides.add(Direction.VERTICAL, new UnitValue(100, "px"));
    doc.guides.add(Direction.VERTICAL, new UnitValue(150, "px"));
    savePsd(doc, "guides_hv");
    ok++;
} catch(e) { fail++; }

// --- 15. ICC Profile: sRGB ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    doc.colorProfileType = ColorProfile.CUSTOM;
    doc.colorProfileName = "sRGB IEC61966-2.1";
    var layer = doc.artLayers.add();
    layer.name = "sRGB Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 255; c.rgb.green = 128; c.rgb.blue = 0;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "icc_srgb");
    ok++;
} catch(e) { fail++; }

// --- 16. ICC Profile: Adobe RGB ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    doc.colorProfileType = ColorProfile.CUSTOM;
    doc.colorProfileName = "Adobe RGB (1998)";
    var layer = doc.artLayers.add();
    layer.name = "Adobe RGB Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 0; c.rgb.green = 128; c.rgb.blue = 255;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "icc_adobergb");
    ok++;
} catch(e) { fail++; }

// --- 17. No color profile ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    doc.colorProfileType = ColorProfile.NONE;
    var layer = doc.artLayers.add();
    layer.name = "No Profile";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 128; c.rgb.green = 200; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    savePsd(doc, "icc_none");
    ok++;
} catch(e) { fail++; }

// --- 18. Transparency gradient (partial alpha) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    var layer = doc.artLayers.add();
    layer.name = "Fading Layer";
    doc.activeLayer = layer;
    doc.selection.selectAll();
    // Fill with gradient that includes transparency
    var desc = new ActionDescriptor();
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Custom");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var clrList = new ActionList();
    var c1 = new ActionDescriptor(); var cc1 = new ActionDescriptor();
    cc1.putDouble(charIDToTypeID("Rd  "), 255); cc1.putDouble(charIDToTypeID("Grn "), 0); cc1.putDouble(charIDToTypeID("Bl  "), 0);
    c1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc1);
    c1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c1.putInteger(charIDToTypeID("Lctn"), 0); c1.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c1);
    var c2 = new ActionDescriptor(); var cc2 = new ActionDescriptor();
    cc2.putDouble(charIDToTypeID("Rd  "), 255); cc2.putDouble(charIDToTypeID("Grn "), 0); cc2.putDouble(charIDToTypeID("Bl  "), 0);
    c2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), cc2);
    c2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    c2.putInteger(charIDToTypeID("Lctn"), 4096); c2.putInteger(charIDToTypeID("Mdpn"), 50);
    clrList.putObject(charIDToTypeID("Clrt"), c2);
    gradDesc.putList(charIDToTypeID("Clrs"), clrList);
    var trList = new ActionList();
    var t1 = new ActionDescriptor();
    t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    t1.putInteger(charIDToTypeID("Lctn"), 0);
    t1.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t1);
    var t2 = new ActionDescriptor();
    t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 0);
    t2.putInteger(charIDToTypeID("Lctn"), 4096);
    t2.putInteger(charIDToTypeID("Mdpn"), 50);
    trList.putObject(charIDToTypeID("TrnS"), t2);
    gradDesc.putList(charIDToTypeID("Trns"), trList);
    desc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    desc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
    desc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 0);
    executeAction(charIDToTypeID("Grdn"), desc, DialogModes.NO);
    doc.selection.deselect();
    savePsd(doc, "transparency_gradient");
    ok++;
} catch(e) { fail++; }

// --- 19. Bitmap mode (1-bit) ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.RGB, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    doc.activeLayer = layer;
    var c = new SolidColor(); c.rgb.red = 100; c.rgb.green = 100; c.rgb.blue = 100;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    doc.flatten();
    doc.changeMode(ChangeMode.GRAYSCALE);
    doc.changeMode(ChangeMode.BITMAP, new BitmapConversionOptions());
    savePsd(doc, "bitmap_1bit");
    ok++;
} catch(e) { fail++; }

// --- 20. Grayscale with alpha ---
try {
    var doc = app.documents.add(200, 200, 72, "temp", NewDocumentMode.GRAYSCALE, DocumentFill.WHITE);
    var layer = doc.artLayers.add();
    layer.name = "Gray Content";
    doc.activeLayer = layer;
    var c = new SolidColor(); c.gray.gray = 50;
    doc.selection.selectAll(); doc.selection.fill(c); doc.selection.deselect();
    // Add alpha channel
    var ch = doc.channels.add();
    ch.name = "Alpha 1";
    ch.kind = ChannelType.MASKEDAREA;
    savePsd(doc, "grayscale_alpha");
    ok++;
} catch(e) { fail++; }

"gen_batch5 done: " + ok + " ok, " + fail + " fail";
