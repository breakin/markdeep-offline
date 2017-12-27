This is an example of one way to generate html from markdeep documents using node.js (without a browser).
The generated HTML code showns a page looking exactly as if it had been using markdeep.js at runtime.
Note that math is still using online MathJAX so result is not fully offline (at least not yet).

Status
======
Works for simpler documents but something is still not working for the full features.md.

Usage
=====
Download node.js. Run the following in a command prompt/shell when standing in the directory of this repository:
~~~~~~~~~~
npm update
node convert.js
~~~~~~~~~~
This converts data/*.md into data/*_offline.html and also creates a regular offline version in data/*_online.html for reference. Note that the paths are hard-coded, add more in convert.js.

To recreate package.json run
~~~~~~~~~~
nmp init
nmp install highlight
npm install jsdom
~~~~~~~~~~

Comments about my approach
==========================
* Markdeep needs the global properties document and window. We provide it this by parsing a document using JSDOM.
* Currently the document that document and window is constructed from is a tiny little page containing meta information. This let me reuse one JSDOM document for multiple pages to be converted. This step feels very pointless for the node.js use-case somehow.
* It is not possible to pass a DOM element to window.markdeep.format here since JSDOM does not supply innerHTML. This only affects node.js, nothing wrong with format itself.

Comments about markdeep itself
==============================
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js). I provide the full highlight.js via npm instead so hljs exists.
	* The issue could very well be the issue discussed here [https://github.com/isagalaev/highlight.js/issues/1245](https://github.com/isagalaev/highlight.js/issues/1245) but the simple one word fix by entibo did not work for me...
	* Maybe simply not loading the minified hljs block if hljs is already defined could be a workaround, but making the minified block work would be better. If sometimes using an external hljs block then maybe the set of supported languages could change.
* The canvas operations in measureFontSize (line 74 markdeep.original.js) requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10. Is is questionable to access a canvas anyway when running in node.js since there is no browser...
* If the string going into window.markdeep.format has window line endings (\r\n instead of \n) section headers are not working. In convert.js this is "fixed" by replacing all windows line endings with unix line endings.
* The last line of the document will not be processed so make sure there is an empty line. Not sure if this is always the case or just some patterns that doesn't match on last line.

Things I couldn't reach in markdeep
-----------------------------------
* The body-style (BODY_STYLESHEET) could not be accessed from outside of markdeep.js so I copied it into convert.js.
* The MATHJAX_CONFIG block was also copied from markdeep.js.
* It would be nice if format could signal if math was needed or not.
