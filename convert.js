hljs = require('highlight.js')
fs = require('fs'); // file system

function local_file_handler(filename) {
	var fn = 'docs/' + filename;
	try {
		var content = fs.readFileSync('docs/' + filename, 'utf8');

		content = content.rp(/<!-- Markdeep: -->[^\n]+\n/g, function(match, filename) {
			return ''
		})

		console.log('  Successfully inserted ' + fn);
		return content;
	} catch (err) {
		console.log('  Failed to insert ' + fn + ', error ' + err);
		return undefined;
	}
}

function entag(tag, content, attribs) {
	return '<' + tag + (attribs ? ' ' + attribs : '') + '>' + content + '</' + tag + '>';
}

var BODY_STYLESHEET = entag('style', 'body{max-width:680px;' +
	'margin:auto;' +
	'padding:20px;' +
	'text-align:justify;' +
	'line-height:140%; ' +
	'-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-smoothing:antialiased;' +
	'color:#222;' +
	'font-family:Palatino,Georgia,"Times New Roman",serif}');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function convert(from_file, to_file, online_file, use_math = true) {
	fs.readFile(from_file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}

		data_org = data

		// If we happen to read a file with window line ending we need to remove those or markdeep formatting will be incorrect
		data = data.replace(/\r\n/g, "\n"); // Remove windows line endings

		// Fix closed img-tags. Browsers remove the closing mark itself but we have to do it ourselves
		// See https://stackoverflow.com/questions/23890716/why-is-the-img-tag-not-closed-in-html/23890817
		// NOTE: This will change img-tags inside backticks (code sections) as well as inside ""-strings
		//       which is probably to aggressive. Should be revised!
		data = data.rp(/<img\s+src=(["'])[\s\S]*?\1\s*\/>/gi, function (match, quote) {
			// Strip the "<img " and ">", and then protect:
			return "<img " + match.ss(5, match.length - 2) + ">";
		});

		console.log("Converting from " + from_file + " to " + to_file);
		if (online_file) {
			console.log("  Saving online version to " + online_file);
			online_version = "                <meta charset=\"utf-8\" emacsmode=\"-*- markdown -*-\">\n" + data_org + "\n<!-- Markdeep: --><script src=\"markdeep.original.js\"></script>\n";
			fs.writeFile(online_file, online_version, function (err,data2) {
				if (err) {
					return console.log(err);
				}
			});
		}

		css = window.markdeep.stylesheet();
		content = window.markdeep.format(data, false, local_file_handler);

		// Construct final html
		str = "<html>\n\t<head>\n";

		if (use_math) {
			// from markdeep.js
			var MATHJAX_CONFIG ='<script type="text/x-mathjax-config">MathJax.Hub.Config({ TeX: { equationNumbers: {autoNumber: "AMS"} } });</script>' +
				'<span style="display:none">' +
				// Custom definitions (NC == \newcommand)
				'$$NC{\\n}{\\hat{n}}NC{\\w}{\\hat{\\omega}}NC{\\wi}{\\w_\\mathrm{i}}NC{\\wo}{\\w_\\mathrm{o}}NC{\\wh}{\\w_\\mathrm{h}}NC{\\Li}{L_\\mathrm{i}}NC{\\Lo}{L_\\mathrm{o}}NC{\\Le}{L_\\mathrm{e}}NC{\\Lr}{L_\\mathrm{r}}NC{\\Lt}{L_\\mathrm{t}}NC{\\O}{\\mathrm{O}}NC{\\degrees}{{^{\\large\\circ}}}NC{\\T}{\\mathsf{T}}NC{\\mathset}[1]{\\mathbb{#1}}NC{\\Real}{\\mathset{R}}NC{\\Integer}{\\mathset{Z}}NC{\\Boolean}{\\mathset{B}}NC{\\Complex}{\\mathset{C}}NC{\\un}[1]{\\,\\mathrm{#1}}$$\n'.rp(/NC/g, '\\newcommand') +
				'</span>\n';
			str = str + "\n\t" + MATHJAX_CONFIG;
			// from markdeep.js
			str = str + "\t<script src=\"https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML\"></script>\n";
		}

		str = str + "\t" + BODY_STYLESHEET + css + "\n\t</head>\n\t<body>\n";

		str = str + content;

		str = str + "</body></html>";
		fs.writeFile(to_file, str, function (err,data2) {
			if (err) {
				return console.log(err);
			}
		});
	});
}

JSDOM.fromFile("metapage.html").then(dom => {
	window = dom.window;
	document = window.document;
	//window.markdeepOptions = {tocStyle: 'short', mode: 'script'};
	window.markdeepOptions = {mode: 'script'};
	window.alreadyProcessedMarkdeep = false;

	// We are ready to require markdeep since we now have global document and window properties
	// markdeep has no exports. Instead it adds functions on window.markdeep
	require('./markdeep');

	convert("docs/features.md", "docs/features_offline.html", "docs/features.md.html");
}, reason => {
	console.log("Could not read file using JSDOM, reason=" + reason);
});


