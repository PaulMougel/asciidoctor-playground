var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var express = require('express');
var _ = require('underscore');

var config = require('./config');
var srcDir = path.join(config.document_directory, 'src');
var renderedDir = path.join(config.document_directory, 'rendered');

var app = express();

app.get('/document', function (req, res) {
	fs.readdir(renderedDir, function (err, files) {
		if (err) return res.send(500, err.message);
		res.send(_.filter(files, function (fileName) {
			return fileName !== '.empty';
		}));
	})
});

app.get('/document/:document_name.adoc', function (req, res) {
	res.sendfile(req.params.document_name, { root: srcDir });
});
app.post('/document/:document_name.adoc', function (req, res) {
	var asciidoctor = child_process.spawn('asciidoctor', ['-']);
	req.pipe(fs.createWriteStream(path.join(srcDir, req.params.document_name)));
	req.pipe(asciidoctor.stdin);
	
	var output = fs.createWriteStream(path.join(renderedDir, req.params.document_name));
	asciidoctor.stdout.pipe(output);
	asciidoctor.stdout.on('end', function () {
		res.send(200);
	});
	asciidoctor.stderr.on('data', function () {
		res.send(500);
	});
});
app.get('/document/:document_name.html', function (req, res) {
	res.set('Content-Type', 'text/html');
	res.sendfile(req.params.document_name, { root: renderedDir });
});

app.listen(8080);