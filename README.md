This is an example of one way to generate html from markdeep documents using node.js (without a browser).
All the work is done on convert.js; all other files are just for testing and documentation purposes.

The generated HTML looks exactly as if it had been using markdeep.js at runtime.
Math expressions are still "online" but at least markdeep processing is 100% server side.

Usage
=====
Download node.js. Run the following in a command prompt/shell when standing in the directory of this repository:
~~~~~~~~~~
npm update
node convert.js --input docs/features.md.html --output docs/features.offline.html --html
~~~~~~~~~~

To recreate package.json run
~~~~~~~~~~
nmp init
nmp install highlight
npm install jsdom
npm install minimist
~~~~~~~~~~

Status
======
* See result here on markdeep features document: [docs/features.md](https://breakin.github.io/markdeep-offline/features.md) -> [docs/features.offline.html](https://breakin.github.io/markdeep-offline/features.offline.html) (reference [docs/features.md.html](https://breakin.github.io/markdeep-offline/features.md.html))
* codeFontSize is not correct due to missing canvas operations. Thus fontSize is wrong!
	* markdeep updated to still work
	* Should maybe add javascript to update css dynamically client-side.
* markdeep.js is modified, see comments below!
	* codeFontSize is not correct due to missing canvas operations. Removed detection and hardcoded a value.
	* Should maybe add javascript to update css dynamically client-side.

Comments about my approach
==========================
* Markdeep needs the global properties document and window. We provide it this by parsing a document using JSDOM.
* Currently the document that document and window is constructed from is a tiny little page containing meta information. This let me reuse one JSDOM document for multiple pages to be converted. This step feels very pointless for the node.js use-case somehow.
* It is not possible to pass a DOM element to window.markdeep.format here since JSDOM does not supply innerHTML. This only affects node.js, nothing wrong with format itself.
* Currently there are issues with starting tags (encoding etc). Avoid!

Comments about markdeep itself
==============================
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js). I provide the full highlight.js via npm instead
	* The issue could very well be the issue discussed here [https://github.com/isagalaev/highlight.js/issues/1245](https://github.com/isagalaev/highlight.js/issues/1245) but the simple one word fix by entibo did not work for me...
	* Maybe simply not loading the minified hljs block if hljs is already defined could be a workaround, but making the minified block work would be better. If sometimes using an external hljs block then maybe the set of supported languages could differ between online and offline conversion.
* The canvas operations in measureFontSize requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10. Is is questionable to access a canvas anyway when running in node.js since there is no browser...
	* It would be nice to turn canvas off since in offline mode we won't know what resolution to use anyway (unless we do markdeep->html conversion for each user)
* If the string going into window.markdeep.format has window line endings (\r\n instead of \n) section headers are not working. In convert.js this is "fixed" by replacing all windows line endings with unix line endings.
* Since markdeep is first parse into a DOM some tags are changed. IMG tags can't be closed so the closing / is removed. convert.js does this to minic the behavior.
* The last line of the document will not be processed so make sure there is an empty line. Not sure if this is always the case or just some patterns that doesn't match on last line. Convert.js adds one extra \n at the end.

Things I couldn't reach in markdeep
-----------------------------------
* The body-style (BODY_STYLESHEET) could not be accessed from outside of markdeep.js so I copied it into convert.js.
* The MATHJAX_CONFIG block was also copied from markdeep.js.
* It would be nice if format could signal if math was needed or not. Also maybe it could accept encoding of text block?
