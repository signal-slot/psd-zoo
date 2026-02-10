// === Fill layers, Gradient fills, Pattern fills ===
function savePsd(doc, path) {
    var f = new File(path);
    var o = new PhotoshopSaveOptions(); o.alphaChannels = true; o.layers = true;
    doc.saveAs(f, o, true); doc.close(SaveOptions.DONOTSAVECHANGES);
}
var B = "C:/Users/tasuku/com/github/signal-slot/qtpsd/tests/auto/psdcore/qpsdparser/data/";
var ok = 0, fail = 0;

// fill_gradient_linear
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_gradient_linear", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("linear"));
    gDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), 90);
    // Gradient colors
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Black, White");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    // Color stops
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 0); c1.putDouble(charIDToTypeID("Grn "), 0); c1.putDouble(charIDToTypeID("Bl  "), 0);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 255); c2.putDouble(charIDToTypeID("Grn "), 255); c2.putDouble(charIDToTypeID("Bl  "), 255);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    // Transparency stops
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Linear Gradient";
    savePsd(d, B+"fill_gradient_linear.psd"); ok++;
})(); } catch(e) { fail++; }

// fill_gradient_radial
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_gradient_radial", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("radial"));
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Foreground to Background");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 255); c1.putDouble(charIDToTypeID("Grn "), 0); c1.putDouble(charIDToTypeID("Bl  "), 0);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 0); c2.putDouble(charIDToTypeID("Grn "), 0); c2.putDouble(charIDToTypeID("Bl  "), 255);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Radial Gradient";
    savePsd(d, B+"fill_gradient_radial.psd"); ok++;
})(); } catch(e) { fail++; }

// fill_gradient_angle
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_gradient_angle", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("angle"));
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Angle Grad");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 255); c1.putDouble(charIDToTypeID("Grn "), 255); c1.putDouble(charIDToTypeID("Bl  "), 0);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 0); c2.putDouble(charIDToTypeID("Grn "), 128); c2.putDouble(charIDToTypeID("Bl  "), 0);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Angle Gradient";
    savePsd(d, B+"fill_gradient_angle.psd"); ok++;
})(); } catch(e) { fail++; }

// fill_gradient_reflected
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_gradient_reflected", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("reflected"));
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Reflected");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 255); c1.putDouble(charIDToTypeID("Grn "), 128); c1.putDouble(charIDToTypeID("Bl  "), 0);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 128); c2.putDouble(charIDToTypeID("Grn "), 0); c2.putDouble(charIDToTypeID("Bl  "), 255);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Reflected Gradient";
    savePsd(d, B+"fill_gradient_reflected.psd"); ok++;
})(); } catch(e) { fail++; }

// fill_gradient_diamond
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_gradient_diamond", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var gDesc = new ActionDescriptor();
    gDesc.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("gradientType"), stringIDToTypeID("diamond"));
    var gradDesc = new ActionDescriptor();
    gradDesc.putString(charIDToTypeID("Nm  "), "Diamond");
    gradDesc.putEnumerated(charIDToTypeID("GrdF"), charIDToTypeID("GrdF"), charIDToTypeID("CstS"));
    gradDesc.putDouble(charIDToTypeID("Intr"), 4096);
    var csList = new ActionList();
    var cs1 = new ActionDescriptor();
    var c1 = new ActionDescriptor(); c1.putDouble(charIDToTypeID("Rd  "), 0); c1.putDouble(charIDToTypeID("Grn "), 255); c1.putDouble(charIDToTypeID("Bl  "), 255);
    cs1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c1);
    cs1.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs1.putInteger(charIDToTypeID("Lctn"), 0); cs1.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs1);
    var cs2 = new ActionDescriptor();
    var c2 = new ActionDescriptor(); c2.putDouble(charIDToTypeID("Rd  "), 255); c2.putDouble(charIDToTypeID("Grn "), 0); c2.putDouble(charIDToTypeID("Bl  "), 128);
    cs2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), c2);
    cs2.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("Clry"), charIDToTypeID("UsrS"));
    cs2.putInteger(charIDToTypeID("Lctn"), 4096); cs2.putInteger(charIDToTypeID("Mdpn"), 50);
    csList.putObject(charIDToTypeID("Clrt"), cs2);
    gradDesc.putList(charIDToTypeID("Clrs"), csList);
    var tsList = new ActionList();
    var ts1 = new ActionDescriptor(); ts1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts1.putInteger(charIDToTypeID("Lctn"), 0); ts1.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts1);
    var ts2 = new ActionDescriptor(); ts2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100); ts2.putInteger(charIDToTypeID("Lctn"), 4096); ts2.putInteger(charIDToTypeID("Mdpn"), 50);
    tsList.putObject(charIDToTypeID("TrnS"), ts2);
    gradDesc.putList(charIDToTypeID("Trns"), tsList);
    gDesc.putObject(charIDToTypeID("Grad"), charIDToTypeID("Grdn"), gradDesc);
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("gradientLayer"), gDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Diamond Gradient";
    savePsd(d, B+"fill_gradient_diamond.psd"); ok++;
})(); } catch(e) { fail++; }

// fill_pattern
try { (function() {
    var d = app.documents.add(200, 200, 72, "fill_pattern", NewDocumentMode.RGB, DocumentFill.WHITE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference(); ref.putClass(stringIDToTypeID("contentLayer"));
    desc.putReference(charIDToTypeID("null"), ref);
    var cDesc = new ActionDescriptor();
    var pDesc = new ActionDescriptor();
    // Use default Photoshop pattern
    cDesc.putObject(charIDToTypeID("Type"), stringIDToTypeID("patternLayer"), pDesc);
    desc.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), cDesc);
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
    d.activeLayer.name = "Pattern Fill";
    savePsd(d, B+"fill_pattern.psd"); ok++;
})(); } catch(e) { fail++; }

alert("Fill: ok=" + ok + " fail=" + fail);
