This is an example of one way to generate html from markdeep documents using node.js (without a browser).
The generated HTML code showns a page looking exactly as if it had been using markdeep.js at runtime.

Status
======
* Math is still using online MathJAX so result is not fully offline. It would be nice to optionally generate MathJAX locally if that makes sense.
* codeFontSize is not correct due to missing canvas operations. Thus fontSize is wrong!
	* Should maybe add javascript to update css dynamically client-side.
* [docs/features.md](https://breakin.github.io/markdeep-offline/features.md) -> [docs/features_offline.html](https://breakin.github.io/markdeep-offline/features_offline.html) (reference [docs/features.md.html](https://breakin.github.io/markdeep-offline/features.md.html))
	* Only missing feature afaict is that the external document inclusion in section 11 is not doing anything (and not causing an error when not doing so)

Usage
=====
Download node.js. Run the following in a command prompt/shell when standing in the directory of this repository:
~~~~~~~~~~
npm update
node convert.js
~~~~~~~~~~
This converts docs/test.md into docs/test_offline.html and also creates a regular offline version in docs/test_online.html for reference. Also converts features and math. More tests can be added to convert.js.

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
* I don't see how external document inclusion could work with the code as-is. Personally I feel that the node.js version could be more of a open-file/paste-content directly instead of doing iframe and mucking about!

Comments about markdeep itself
==============================
* I moved the "img in gravizo" test after the backtick test. See [gist](https://gist.github.com/breakin/9225ccbf631569aff359efb4e5ce97c1).
	* This has been reported as a bug to Morgan and a solution will hopefulyl be part of markdeep in the future
* The minified version of highlight.js is causing some issues so I removed it (line 87 in markdeep.original.js). I provide the full highlight.js via npm instead so hljs exists.
	* The issue could very well be the issue discussed here [https://github.com/isagalaev/highlight.js/issues/1245](https://github.com/isagalaev/highlight.js/issues/1245) but the simple one word fix by entibo did not work for me...
	* Maybe simply not loading the minified hljs block if hljs is already defined could be a workaround, but making the minified block work would be better. If sometimes using an external hljs block then maybe the set of supported languages could change.
* The canvas operations in measureFontSize (line 74 markdeep.original.js) requires functionality of JSDOM that is hard to install on windows. Thus I made it so the function always returns 10. Is is questionable to access a canvas anyway when running in node.js since there is no browser...
	* It would be nice to turn canvas off since in offline mode we won't know what resolution to use anyway (unless we do markdeep->html conversion for each user)
* If the string going into window.markdeep.format has window line endings (\r\n instead of \n) section headers are not working. In convert.js this is "fixed" by replacing all windows line endings with unix line endings.
* The last line of the document will not be processed so make sure there is an empty line. Not sure if this is always the case or just some patterns that doesn't match on last line. Convert.js adds one extra \n at the end.

Things I couldn't reach in markdeep
-----------------------------------
* The body-style (BODY_STYLESHEET) could not be accessed from outside of markdeep.js so I copied it into convert.js.
* The MATHJAX_CONFIG block was also copied from markdeep.js.
* It would be nice if format could signal if math was needed or not.
