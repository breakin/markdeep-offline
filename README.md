In this repository I try to generate markdeep offline using the markdeep javascript API and node.js. No browser involved.
The generated HTML code mostly works but the stylesheet is not working quite yet.

Usage
=====
~~~~~~~~~~
npm update
node convert.js
~~~~~~~~~~
This converts test.md into test_converted.html. Make sure that test.md has unix line endings. In sublime text this can be selected via View -> Line Endings -> Unix.

Hints
=====
* If the string going into window.markdeep.format has window line endings (\r\n instead of \n) section headers are not working.
* It is not possible to pass a DOM element to window.markdeep.format here since JSDOM does not supply innerHTML. Only affects node.js, nothing wrong with format itself.
* Markdeep needs the global properties document and window. We provide it this by parsing a document using JSDOM.
* Currently the document that document and window is constructed from is a tiny little page containing meta information. I could just as well have taken the real document here but since I couldn't pass that into format anyway due to JSDOM limitations I didn't bother.

Changes I did to markdeep.js
============================
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js).
* The canvas operations in measureFontSize (line 74 markdeep.original.js) requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10.

From scratch
============
~~~~~~~~~~
nmp init
nmp install highlight
npm install jsdom
node convert.js
~~~~~~~~~~
