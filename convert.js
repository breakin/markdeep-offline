hljs = require('highlight.js')
fs = require('fs'); // file system

function read_file_and_remove_markdeep(filename) {
	// TODO: Make files relative to source document path
	var content = fs.readFileSync(filename, 'utf8');

	// We don't want to handle (insert)-statements using iframe so resolve them right now right here
	content = resolve_local_files(content)

	content = content.rp(/<!-- Markdeep: -->[^\n]+(\n|$)/g, function(match, filename) {
		return ''
	})
	return content;	
}

function local_file_handler(filename) {
	// TODO: Get the path of the root document instead of hard-coding docs/ here
	var fn = 'docs/' + filename;
	try {
		var content = read_file_and_remove_markdeep(fn)
		console.log('  Successfully inserted ' + fn);
		return content;
	} catch (err) {
		console.log('  Failed to insert ' + fn + ', error ' + err);
		return undefined;
	}
}

function resolve_local_files(str) {
  str = str.rp(/(?:^|\s)\(insert[ \t]+(\S+\.\S*)[ \t]+here\)\s/g, function(match, filename) {
    var content = local_file_handler(filename);
    if (content) {
      return resolve_local_files(content, local_file_handler);
    } else {
      // Leave this insert to be handled client-side
      return match;
    }
  });
  return str;
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

function convert(from_file) {
	var data = read_file_and_remove_markdeep(from_file);

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

	var content = window.markdeep.format(data, false, local_file_handler);

	return content;
}

var argv = require('minimist')(process.argv.slice(2));

var input_file = argv["input"]
var output_file = argv["output"]
var write_html = argv["html"]
var write_inline = argv["inline"]
var write_css = argv["css"]

var use_math = true;

JSDOM.fromFile("metapage.html").then(dom => {
	window = dom.window;
	document = window.document;
	//window.markdeepOptions = {tocStyle: 'short', mode: 'script'};
	window.markdeepOptions = {mode: 'script'};
	window.alreadyProcessedMarkdeep = false;

	// We are ready to require markdeep since we now have global document and window properties
	// markdeep has no exports. Instead it adds functions on window.markdeep
	require('./markdeep');

	var str

	var css_str = ""

	css_str = css_str + "\t" + BODY_STYLESHEET + window.markdeep.stylesheet();
	
	if (write_css) {
		str = css_str;
	} else if (write_html) {
	
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
		str = str + css_str + "\n\t</head>\n\t<body>\n";		

		str = str + convert(input_file);

		str = str + "</body></html>";
	} else if (write_inline) {
		str = convert(input_file);
	}

	fs.writeFile(output_file, str, function (err,data2) {
		if (err) {
			return console.log(err);
		}
	});	
}, reason => {
	console.log("Could not read file using JSDOM, reason=" + reason);
});


