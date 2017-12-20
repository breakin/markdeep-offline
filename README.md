In this reposity I try to generate markdeep offline using the markdeep javascript API and node.js. No browser involved.
Currently the generated html code is not correct. WIP!

Usage
=====
~~~~~~~~~~
npm update
node convert.js
~~~~~~~~~~
This converts test.md into test.html.

Issues
======
* There is no table of content
* Not all section headers work (the #-ones work)

Workarounds
===========
* Markdeep needs the global properties document and window. We provide it this by parsing a document using JSDOM.
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js).
* The canvas operations in measureFontSize (line 74 markdeep.original.js) requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10.
* Currently the document that document and window is constructed from is a tiny little page. Loading up full test.md doesn't change anything.

From scratch
============
~~~~~~~~~~
nmp init
nmp install highlight
npm install jsdom
node convert.js
~~~~~~~~~~
