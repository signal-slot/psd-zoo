var d = app.documents.add(100,100,72,"test",NewDocumentMode.RGB,DocumentFill.WHITE);
var f = new File(File($.fileName).parent.parent.fsName.replace(/\\/g, "/") + "/test_ping.psd");
var o = new PhotoshopSaveOptions();
o.alphaChannels = true; o.layers = true;
d.saveAs(f, o, true);
d.close(SaveOptions.DONOTSAVECHANGES);
"done";
