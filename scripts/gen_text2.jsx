// gen_text2.jsx - More text formatting features
var basePath = File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/";
var ok = 0, fail = 0;

function savePsd(doc, name) {
    var f = new File(basePath + name + ".psd");
    var o = new PhotoshopSaveOptions();
    o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true);
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

// 1. Text superscript
try{(function(){
    var d = app.documents.add(300,200,72,"text_superscript",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(24, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "E=mc2";
    // Use action manager to set superscript on "2"
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("TxLr"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txObj = new ActionDescriptor();
    var txStyleList = new ActionList();
    // First range normal
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 4);
    var ts1 = new ActionDescriptor();
    ts1.putDouble(charIDToTypeID("Sz  "), 24);
    ts1.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts1);
    txStyleList.putObject(charIDToTypeID("Txtt"), r1);
    // Second range superscript
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 4);
    r2.putInteger(charIDToTypeID("T   "), 5);
    var ts2 = new ActionDescriptor();
    ts2.putDouble(charIDToTypeID("Sz  "), 24);
    ts2.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    ts2.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("superScript"));
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts2);
    txStyleList.putObject(charIDToTypeID("Txtt"), r2);
    txObj.putList(charIDToTypeID("Txtt"), txStyleList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txObj);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_superscript"); ok++;
})();}catch(e){fail++; $.writeln("superscript: "+e);}

// 2. Text subscript
try{(function(){
    var d = app.documents.add(300,200,72,"text_subscript",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(24, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "H2O";
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("TxLr"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txObj = new ActionDescriptor();
    var txStyleList = new ActionList();
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 1);
    var ts1 = new ActionDescriptor();
    ts1.putDouble(charIDToTypeID("Sz  "), 24);
    ts1.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts1);
    txStyleList.putObject(charIDToTypeID("Txtt"), r1);
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 1);
    r2.putInteger(charIDToTypeID("T   "), 2);
    var ts2 = new ActionDescriptor();
    ts2.putDouble(charIDToTypeID("Sz  "), 24);
    ts2.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    ts2.putEnumerated(stringIDToTypeID("baseline"), stringIDToTypeID("baseline"), stringIDToTypeID("subScript"));
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts2);
    txStyleList.putObject(charIDToTypeID("Txtt"), r2);
    var r3 = new ActionDescriptor();
    r3.putInteger(charIDToTypeID("From"), 2);
    r3.putInteger(charIDToTypeID("T   "), 3);
    var ts3 = new ActionDescriptor();
    ts3.putDouble(charIDToTypeID("Sz  "), 24);
    ts3.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    r3.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts3);
    txStyleList.putObject(charIDToTypeID("Txtt"), r3);
    txObj.putList(charIDToTypeID("Txtt"), txStyleList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txObj);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_subscript"); ok++;
})();}catch(e){fail++; $.writeln("subscript: "+e);}

// 3. Text with multiple colors (rich text)
try{(function(){
    var d = app.documents.add(400,200,72,"text_multicolor",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(30, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "RAINBOW";
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("TxLr"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txObj = new ActionDescriptor();
    var txStyleList = new ActionList();
    var colors = [
        [255,0,0],[255,128,0],[255,255,0],[0,255,0],[0,0,255],[75,0,130],[148,0,211]
    ];
    for(var i=0;i<7;i++){
        var r = new ActionDescriptor();
        r.putInteger(charIDToTypeID("From"), i);
        r.putInteger(charIDToTypeID("T   "), i+1);
        var ts = new ActionDescriptor();
        ts.putDouble(charIDToTypeID("Sz  "), 30);
        ts.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Bold");
        var clr = new ActionDescriptor();
        clr.putDouble(charIDToTypeID("Rd  "), colors[i][0]);
        clr.putDouble(charIDToTypeID("Grn "), colors[i][1]);
        clr.putDouble(charIDToTypeID("Bl  "), colors[i][2]);
        ts.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr);
        r.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts);
        txStyleList.putObject(charIDToTypeID("Txtt"), r);
    }
    txObj.putList(charIDToTypeID("Txtt"), txStyleList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txObj);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_multicolor"); ok++;
})();}catch(e){fail++; $.writeln("multicolor: "+e);}

// 4. Text with multiple sizes
try{(function(){
    var d = app.documents.add(400,200,72,"text_multisizes",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(12, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(120,"px")];
    ti.contents = "Small Medium Large Huge";
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("TxLr"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txObj = new ActionDescriptor();
    var txStyleList = new ActionList();
    var ranges = [[0,6,12],[6,13,18],[13,19,30],[19,23,48]];
    for(var i=0;i<ranges.length;i++){
        var r = new ActionDescriptor();
        r.putInteger(charIDToTypeID("From"), ranges[i][0]);
        r.putInteger(charIDToTypeID("T   "), ranges[i][1]);
        var ts = new ActionDescriptor();
        ts.putDouble(charIDToTypeID("Sz  "), ranges[i][2]);
        ts.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
        r.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts);
        txStyleList.putObject(charIDToTypeID("Txtt"), r);
    }
    txObj.putList(charIDToTypeID("Txtt"), txStyleList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txObj);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_multisizes"); ok++;
})();}catch(e){fail++; $.writeln("multisizes: "+e);}

// 5. Text warp - Bulge
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_bulge",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "BULGE";
    ti.warpStyle = WarpStyle.BULGE;
    ti.warpBend = 50;
    savePsd(d, "text_warp_bulge"); ok++;
})();}catch(e){fail++; $.writeln("warp_bulge: "+e);}

// 6. Text warp - Shell Upper
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_shell",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "SHELL";
    ti.warpStyle = WarpStyle.SHELLUPPER;
    ti.warpBend = 50;
    savePsd(d, "text_warp_shell"); ok++;
})();}catch(e){fail++; $.writeln("warp_shell: "+e);}

// 7. Text warp - Twist
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_twist",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "TWIST";
    ti.warpStyle = WarpStyle.TWIST;
    ti.warpBend = 50;
    savePsd(d, "text_warp_twist"); ok++;
})();}catch(e){fail++; $.writeln("warp_twist: "+e);}

// 8. Text warp - Fish
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_fish",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "FISH";
    ti.warpStyle = WarpStyle.FISH;
    ti.warpBend = 50;
    savePsd(d, "text_warp_fish"); ok++;
})();}catch(e){fail++; $.writeln("warp_fish: "+e);}

// 9. Text warp - Rise
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_rise",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "RISE";
    ti.warpStyle = WarpStyle.RISE;
    ti.warpBend = 50;
    savePsd(d, "text_warp_rise"); ok++;
})();}catch(e){fail++; $.writeln("warp_rise: "+e);}

// 10. Text warp - Inflate
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_inflate",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "INFLATE";
    ti.warpStyle = WarpStyle.INFLATE;
    ti.warpBend = 50;
    savePsd(d, "text_warp_inflate"); ok++;
})();}catch(e){fail++; $.writeln("warp_inflate: "+e);}

// 11. Text warp - Squeeze
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_squeeze",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "SQUEEZE";
    ti.warpStyle = WarpStyle.SQUEEZE;
    ti.warpBend = 50;
    savePsd(d, "text_warp_squeeze"); ok++;
})();}catch(e){fail++; $.writeln("warp_squeeze: "+e);}

// 12. Text warp - Fisheye
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_fisheye",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "FISHEYE";
    ti.warpStyle = WarpStyle.FISHEYE;
    ti.warpBend = 50;
    savePsd(d, "text_warp_fisheye"); ok++;
})();}catch(e){fail++; $.writeln("warp_fisheye: "+e);}

// 13. Text with negative warp bend
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_negative",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "NEGATIVE";
    ti.warpStyle = WarpStyle.ARC;
    ti.warpBend = -50;
    savePsd(d, "text_warp_negative"); ok++;
})();}catch(e){fail++; $.writeln("warp_negative: "+e);}

// 14. Text warp with horizontal distortion
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_hdistort",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(28, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "DISTORT";
    ti.warpStyle = WarpStyle.ARC;
    ti.warpBend = 30;
    ti.warpHorizontalDistortion = 50;
    savePsd(d, "text_warp_hdistort"); ok++;
})();}catch(e){fail++; $.writeln("warp_hdistort: "+e);}

// 15. Text warp with vertical distortion
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_vdistort",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(28, "pt");
    ti.position = [new UnitValue(50,"px"), new UnitValue(120,"px")];
    ti.contents = "VDISTORT";
    ti.warpStyle = WarpStyle.ARC;
    ti.warpBend = 30;
    ti.warpVerticalDistortion = 50;
    savePsd(d, "text_warp_vdistort"); ok++;
})();}catch(e){fail++; $.writeln("warp_vdistort: "+e);}

// 16. Text paragraph indent
try{(function(){
    var d = app.documents.add(400,300,72,"text_paragraph_indent",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.kind = TextType.PARAGRAPHTEXT;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(14, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(20,"px")];
    ti.width = new UnitValue(360,"px");
    ti.height = new UnitValue(260,"px");
    ti.contents = "First paragraph with indent. This is a longer text to test paragraph formatting with first line indent.\r\rSecond paragraph. Also with indent applied.";
    ti.firstLineIndent = new UnitValue(30, "pt");
    savePsd(d, "text_paragraph_indent"); ok++;
})();}catch(e){fail++; $.writeln("paragraph_indent: "+e);}

// 17. Text paragraph space before/after
try{(function(){
    var d = app.documents.add(400,300,72,"text_paragraph_spacing",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.kind = TextType.PARAGRAPHTEXT;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(14, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(20,"px")];
    ti.width = new UnitValue(360,"px");
    ti.height = new UnitValue(260,"px");
    ti.contents = "First paragraph.\r\rSecond paragraph with space before.\r\rThird paragraph.";
    ti.spaceBefore = new UnitValue(20, "pt");
    ti.spaceAfter = new UnitValue(10, "pt");
    savePsd(d, "text_paragraph_spacing"); ok++;
})();}catch(e){fail++; $.writeln("paragraph_spacing: "+e);}

// 18. Text with layer effect (styled text)
try{(function(){
    var d = app.documents.add(300,200,72,"text_with_effect",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(48, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(140,"px")];
    ti.contents = "STYLED";
    var c = new SolidColor(); c.rgb.red=200; c.rgb.green=50; c.rgb.blue=50;
    ti.color = c;
    d.activeLayer = layer;
    // Add drop shadow to text
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
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), 5);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), 5);
    fx.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
    // Stroke on text
    var strk = new ActionDescriptor();
    strk.putBoolean(charIDToTypeID("enab"), true);
    strk.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    strk.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    strk.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    strk.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
    strk.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 2);
    var clr2 = new ActionDescriptor(); clr2.putDouble(charIDToTypeID("Rd  "), 50); clr2.putDouble(charIDToTypeID("Grn "), 0); clr2.putDouble(charIDToTypeID("Bl  "), 0);
    strk.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), clr2);
    fx.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strk);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), fx);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_with_effect"); ok++;
})();}catch(e){fail++; $.writeln("text_with_effect: "+e);}

// 19. Text with Roboto Bold Italic (mixed fonts)
try{(function(){
    var d = app.documents.add(400,200,72,"text_mixed_fonts",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Regular";
    ti.size = new UnitValue(24, "pt");
    ti.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    ti.contents = "Regular Bold Italic";
    d.activeLayer = layer;
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("TxLr"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    var txObj = new ActionDescriptor();
    var txStyleList = new ActionList();
    // Regular
    var r1 = new ActionDescriptor();
    r1.putInteger(charIDToTypeID("From"), 0);
    r1.putInteger(charIDToTypeID("T   "), 8);
    var ts1 = new ActionDescriptor();
    ts1.putDouble(charIDToTypeID("Sz  "), 24);
    ts1.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Regular");
    r1.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts1);
    txStyleList.putObject(charIDToTypeID("Txtt"), r1);
    // Bold
    var r2 = new ActionDescriptor();
    r2.putInteger(charIDToTypeID("From"), 8);
    r2.putInteger(charIDToTypeID("T   "), 13);
    var ts2 = new ActionDescriptor();
    ts2.putDouble(charIDToTypeID("Sz  "), 24);
    ts2.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Bold");
    r2.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts2);
    txStyleList.putObject(charIDToTypeID("Txtt"), r2);
    // Italic
    var r3 = new ActionDescriptor();
    r3.putInteger(charIDToTypeID("From"), 13);
    r3.putInteger(charIDToTypeID("T   "), 19);
    var ts3 = new ActionDescriptor();
    ts3.putDouble(charIDToTypeID("Sz  "), 24);
    ts3.putString(stringIDToTypeID("fontPostScriptName"), "Roboto-Italic");
    r3.putObject(charIDToTypeID("TxtS"), charIDToTypeID("TxtS"), ts3);
    txStyleList.putObject(charIDToTypeID("Txtt"), r3);
    txObj.putList(charIDToTypeID("Txtt"), txStyleList);
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("TxLr"), txObj);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    savePsd(d, "text_mixed_fonts"); ok++;
})();}catch(e){fail++; $.writeln("mixed_fonts: "+e);}

// 20. Text warp - ArcLower
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_arclower",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(40,"px"), new UnitValue(120,"px")];
    ti.contents = "LOWER";
    ti.warpStyle = WarpStyle.ARCLOWER;
    ti.warpBend = 50;
    savePsd(d, "text_warp_arclower"); ok++;
})();}catch(e){fail++; $.writeln("warp_arclower: "+e);}

// 21. Text warp - ArcUpper
try{(function(){
    var d = app.documents.add(300,200,72,"text_warp_arcupper",NewDocumentMode.RGB,DocumentFill.WHITE);
    var layer = d.artLayers.add();
    layer.kind = LayerKind.TEXT;
    var ti = layer.textItem;
    ti.font = "Roboto-Bold";
    ti.size = new UnitValue(36, "pt");
    ti.position = [new UnitValue(40,"px"), new UnitValue(120,"px")];
    ti.contents = "UPPER";
    ti.warpStyle = WarpStyle.ARCUPPER;
    ti.warpBend = 50;
    savePsd(d, "text_warp_arcupper"); ok++;
})();}catch(e){fail++; $.writeln("warp_arcupper: "+e);}

alert("gen_text2 done: " + ok + " ok, " + fail + " fail");
