// === Text formatting parameters ===
function savePsd(doc, path) {
    var f = new File(path);
    var o = new PhotoshopSaveOptions(); o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
function mk(name, w, h) { return app.documents.add(w||300, h||200, 72, name, NewDocumentMode.RGB, DocumentFill.WHITE); }
var B = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";
var ok = 0, fail = 0;

// text_bold
try { (function() {
    var d = mk("text_bold");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Bold";
    l.textItem.contents = "Bold"; l.textItem.font = "Roboto-Bold"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.fauxBold = true;
    savePsd(d, B+"text_bold.psd"); ok++;
})(); } catch(e) { fail++; }

// text_italic
try { (function() {
    var d = mk("text_italic");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Italic";
    l.textItem.contents = "Italic"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.fauxItalic = true;
    savePsd(d, B+"text_italic.psd"); ok++;
})(); } catch(e) { fail++; }

// text_underline
try { (function() {
    var d = mk("text_underline");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Underline";
    l.textItem.contents = "Underline"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(30,"px"), new UnitValue(100,"px")];
    l.textItem.underline = UnderlineType.UNDERLINERIGHT;
    savePsd(d, B+"text_underline.psd"); ok++;
})(); } catch(e) { fail++; }

// text_strikethrough
try { (function() {
    var d = mk("text_strikethrough");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Strike";
    l.textItem.contents = "Strikethrough"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(30,"pt");
    l.textItem.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    l.textItem.strikeThru = StrikeThruType.STRIKEBOX;
    savePsd(d, B+"text_strikethrough.psd"); ok++;
})(); } catch(e) { fail++; }

// text_tracking
try { (function() {
    var d = mk("text_tracking");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Tracking";
    l.textItem.contents = "Tracking"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    l.textItem.tracking = 200;
    savePsd(d, B+"text_tracking.psd"); ok++;
})(); } catch(e) { fail++; }

// text_leading
try { (function() {
    var d = mk("text_leading", 300, 300);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Leading";
    l.textItem.contents = "Line A\rLine B\rLine C"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(30,"px"), new UnitValue(60,"px")];
    l.textItem.useAutoLeading = false;
    l.textItem.leading = new UnitValue(48,"pt");
    savePsd(d, B+"text_leading.psd"); ok++;
})(); } catch(e) { fail++; }

// text_align_left
try { (function() {
    var d = mk("text_align_left");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Left";
    l.textItem.contents = "Left Align"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(150,"px"), new UnitValue(100,"px")];
    l.textItem.justification = Justification.LEFT;
    savePsd(d, B+"text_align_left.psd"); ok++;
})(); } catch(e) { fail++; }

// text_align_center
try { (function() {
    var d = mk("text_align_center");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Center";
    l.textItem.contents = "Center Align"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(150,"px"), new UnitValue(100,"px")];
    l.textItem.justification = Justification.CENTER;
    savePsd(d, B+"text_align_center.psd"); ok++;
})(); } catch(e) { fail++; }

// text_align_right
try { (function() {
    var d = mk("text_align_right");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Right";
    l.textItem.contents = "Right Align"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(150,"px"), new UnitValue(100,"px")];
    l.textItem.justification = Justification.RIGHT;
    savePsd(d, B+"text_align_right.psd"); ok++;
})(); } catch(e) { fail++; }

// text_align_justify
try { (function() {
    var d = mk("text_align_justify", 300, 200);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Justify";
    l.textItem.kind = TextType.PARAGRAPHTEXT;
    l.textItem.width = new UnitValue(250, "px");
    l.textItem.height = new UnitValue(150, "px");
    l.textItem.position = [new UnitValue(25,"px"), new UnitValue(25,"px")];
    l.textItem.contents = "This is justified text that should wrap across multiple lines in a text box.";
    l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(14,"pt");
    l.textItem.justification = Justification.FULLYJUSTIFIED;
    savePsd(d, B+"text_align_justify.psd"); ok++;
})(); } catch(e) { fail++; }

// text_paragraph_box
try { (function() {
    var d = mk("text_paragraph_box", 400, 300);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Paragraph";
    l.textItem.kind = TextType.PARAGRAPHTEXT;
    l.textItem.width = new UnitValue(350, "px");
    l.textItem.height = new UnitValue(250, "px");
    l.textItem.position = [new UnitValue(25,"px"), new UnitValue(25,"px")];
    l.textItem.contents = "Paragraph text in a bounding box. This text wraps automatically when it reaches the edge of the box.";
    l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(16,"pt");
    savePsd(d, B+"text_paragraph_box.psd"); ok++;
})(); } catch(e) { fail++; }

// text_all_caps
try { (function() {
    var d = mk("text_all_caps");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "AllCaps";
    l.textItem.contents = "all caps"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(30,"px"), new UnitValue(100,"px")];
    l.textItem.capitalization = TextCase.ALLCAPS;
    savePsd(d, B+"text_all_caps.psd"); ok++;
})(); } catch(e) { fail++; }

// text_small_caps
try { (function() {
    var d = mk("text_small_caps");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "SmallCaps";
    l.textItem.contents = "Small Caps"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    l.textItem.capitalization = TextCase.SMALLCAPS;
    savePsd(d, B+"text_small_caps.psd"); ok++;
})(); } catch(e) { fail++; }

// text_baseline_shift
try { (function() {
    var d = mk("text_baseline_shift");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "BaselineShift";
    l.textItem.contents = "Shifted"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(30,"px"), new UnitValue(120,"px")];
    l.textItem.baselineShift = new UnitValue(10, "pt");
    savePsd(d, B+"text_baseline_shift.psd"); ok++;
})(); } catch(e) { fail++; }

// text_horizontal_scale
try { (function() {
    var d = mk("text_horizontal_scale", 400, 200);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "HScale";
    l.textItem.contents = "Stretched"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    l.textItem.horizontalScale = 150;
    savePsd(d, B+"text_horizontal_scale.psd"); ok++;
})(); } catch(e) { fail++; }

// text_vertical_scale
try { (function() {
    var d = mk("text_vertical_scale", 300, 250);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "VScale";
    l.textItem.contents = "Tall"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(100,"px"), new UnitValue(120,"px")];
    l.textItem.verticalScale = 200;
    savePsd(d, B+"text_vertical_scale.psd"); ok++;
})(); } catch(e) { fail++; }

// text_anti_alias_none
try { (function() {
    var d = mk("text_anti_alias_none");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "NoAA";
    l.textItem.contents = "No AA"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.antiAliasMethod = AntiAlias.NONE;
    savePsd(d, B+"text_anti_alias_none.psd"); ok++;
})(); } catch(e) { fail++; }

// text_anti_alias_sharp
try { (function() {
    var d = mk("text_anti_alias_sharp");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Sharp";
    l.textItem.contents = "Sharp"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.antiAliasMethod = AntiAlias.SHARP;
    savePsd(d, B+"text_anti_alias_sharp.psd"); ok++;
})(); } catch(e) { fail++; }

// text_anti_alias_crisp
try { (function() {
    var d = mk("text_anti_alias_crisp");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Crisp";
    l.textItem.contents = "Crisp"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.antiAliasMethod = AntiAlias.CRISP;
    savePsd(d, B+"text_anti_alias_crisp.psd"); ok++;
})(); } catch(e) { fail++; }

// text_anti_alias_strong
try { (function() {
    var d = mk("text_anti_alias_strong");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Strong";
    l.textItem.contents = "Strong"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.antiAliasMethod = AntiAlias.STRONG;
    savePsd(d, B+"text_anti_alias_strong.psd"); ok++;
})(); } catch(e) { fail++; }

// text_anti_alias_smooth
try { (function() {
    var d = mk("text_anti_alias_smooth");
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Smooth";
    l.textItem.contents = "Smooth"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(50,"px"), new UnitValue(100,"px")];
    l.textItem.antiAliasMethod = AntiAlias.SMOOTH;
    savePsd(d, B+"text_anti_alias_smooth.psd"); ok++;
})(); } catch(e) { fail++; }

// text_warp_arc
try { (function() {
    var d = mk("text_warp_arc", 400, 300);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "WarpArc";
    l.textItem.contents = "Warped Arc"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(80,"px"), new UnitValue(150,"px")];
    l.textItem.warpStyle = WarpStyle.ARC;
    l.textItem.warpValue = 50;
    savePsd(d, B+"text_warp_arc.psd"); ok++;
})(); } catch(e) { fail++; }

// text_warp_flag
try { (function() {
    var d = mk("text_warp_flag", 400, 300);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "WarpFlag";
    l.textItem.contents = "Flag"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(48,"pt");
    l.textItem.position = [new UnitValue(100,"px"), new UnitValue(150,"px")];
    l.textItem.warpStyle = WarpStyle.FLAG;
    l.textItem.warpValue = 50;
    savePsd(d, B+"text_warp_flag.psd"); ok++;
})(); } catch(e) { fail++; }

// text_warp_wave
try { (function() {
    var d = mk("text_warp_wave", 400, 300);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "WarpWave";
    l.textItem.contents = "Wave Text"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(36,"pt");
    l.textItem.position = [new UnitValue(80,"px"), new UnitValue(150,"px")];
    l.textItem.warpStyle = WarpStyle.WAVE;
    l.textItem.warpValue = 40;
    savePsd(d, B+"text_warp_wave.psd"); ok++;
})(); } catch(e) { fail++; }

// text_vertical_orientation
try { (function() {
    var d = mk("text_vertical", 200, 400);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "Vertical";
    l.textItem.contents = "VERTICAL"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(100,"px"), new UnitValue(50,"px")];
    l.textItem.direction = Direction.VERTICAL;
    savePsd(d, B+"text_vertical.psd"); ok++;
})(); } catch(e) { fail++; }

// text_mixed_fonts (multiple font styles in one text layer via Action Manager)
try { (function() {
    var d = mk("text_mixed_styles", 400, 200);
    var l = d.artLayers.add(); l.kind = LayerKind.TEXT; l.name = "MixedStyles";
    l.textItem.contents = "Normal Bold Italic"; l.textItem.font = "Roboto-Regular"; l.textItem.size = new UnitValue(24,"pt");
    l.textItem.position = [new UnitValue(20,"px"), new UnitValue(100,"px")];
    var c = new SolidColor(); c.rgb.red=0; c.rgb.green=0; c.rgb.blue=0; l.textItem.color = c;
    savePsd(d, B+"text_mixed_styles.psd"); ok++;
})(); } catch(e) { fail++; }

alert("Text: ok=" + ok + " fail=" + fail);
