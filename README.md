This is an example of one way to generate html from markdeep documents using node.js (without a browser).
The generated HTML code showns a page looking exactly as if it had been using markdeep.js at runtime.

Usage
=====
Download node.js. Run the following in a command prompt/shell when standing in the directory of this repository:
~~~~~~~~~~
npm update
node convert.js
~~~~~~~~~~
This converts test.md into test_converted.html. Make sure that test.md has unix line endings. In sublime text this can be selected via View -> Line Endings -> Unix.

Hints
=====
* If the string going into window.markdeep.format has window line endings (\r\n instead of \n) section headers are not working. In convert.js this is "fixed" by replacing all windows line endings.
* It is not possible to pass a DOM element to window.markdeep.format here since JSDOM does not supply innerHTML. Only affects node.js, nothing wrong with format itself.
* Markdeep needs the global properties document and window. We provide it this by parsing a document using JSDOM.
* Currently the document that document and window is constructed from is a tiny little page containing meta information. I could just as well have taken the real document here but since I couldn't pass that into format anyway due to JSDOM limitations I didn't bother.
* The last line of the document will not be processed so make sure there is an empty line. Not sure if this is always the case or just some patterns that doesn't match on last line.

Changes I did to markdeep.js
============================
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js). I provide the full highlight.js via npm instead so hljs exists.
	* The issue could very well be the issue discussed here [https://github.com/isagalaev/highlight.js/issues/1245](https://github.com/isagalaev/highlight.js/issues/1245) but the simple one word fix by entibo did not work for me...
	* Maybe simply not loading the minified hljs block if hljs is already defined could be a workaround, but making the minified block work would be better.
* The canvas operations in measureFontSize (line 74 markdeep.original.js) requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10.

Things I couldn't reach in markdeep
===================================
* The body-style (BODY_STYLESHEET) could not be accessed from outside of markdeep.js so I copied it into convert.js.

From scratch
============
~~~~~~~~~~
nmp init
nmp install highlight
npm install jsdom
node convert.js
~~~~~~~~~~
