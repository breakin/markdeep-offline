hljs = require('highlight.js')
fs = require('fs'); // file system

function entag(tag, content, attribs) {
    return '<' + tag + (attribs ? ' ' + attribs : '') + '>' + content + '</' + tag + '>';
}

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
JSDOM.fromFile("metapage.html").then(dom => {
	window = dom.window;
	document = window.document;

	window.markdeepOptions = {tocStyle: 'short', mode: 'script'}
	window.alreadyProcessedMarkdeep = false;

	// We are ready to require markdeep since we now have global document and window properties
	// markdeep has no exports. Instead it adds functions on window.markdeep
	require('./markdeep');

	fs.readFile('test.md', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		// If we happen to read a file with window line ending we need to remove those!
		data = data.replace(/\r\n/g, "\n"); // Remove window line endings

		css = window.markdeep.stylesheet();
		content = window.markdeep.format(data, false)		

		var BODY_STYLESHEET = entag('style', 'body{max-width:680px;' +
		    'margin:auto;' +
		    'padding:20px;' +
		    'text-align:justify;' +
		    'line-height:140%; ' +
		    '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-smoothing:antialiased;' +
		    'color:#222;' +
		    'font-family:Palatino,Georgia,"Times New Roman",serif}');		

		// Construct final html
		str = "<html>\n\t<head>\n" + BODY_STYLESHEET + css + "\n\t</head>\n\t<body>\n" + content + "\t\n</body></html>"

		fs.writeFile('test_converted.html', str, function (err,data2) {
			if (err) {
				return console.log(err);
			}
		});
	});
}, reason => {
	console.log("Could not read file using JSDOM, reason=" + reason)
});


