hljs = require('highlight.js')
fs = require('fs'); // file system

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
		css = window.markdeep.stylesheet();
		content = window.markdeep.format(data, false)

		// Construct final html
		str = "<html>\n\t<head>\n" + css + "\n\t</head>\n\t<body>\n" + content + "\t\n</body></html>"

		fs.writeFile('test.html', str, function (err,data2) {
			if (err) {
				return console.log(err);
			}
		});
	});
}, reason => {
	console.log("Could not read file using JSDOM, reason=" + reason)
});


