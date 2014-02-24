var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var express = require('express');
var config = require('./config');

var app = express();

app.get('/document/:document_name.adoc', function (req, res) {
	res.sendfile(req.params.document_name + '.adoc', { root: path.join(config.document_directory, 'src') });
});
app.post('/document/:document_name.adoc', function (req, res) {
	var asciidoctor = child_process.spawn('asciidoctor', ['-']);
	req.pipe(fs.createWriteStream(path.join(config.document_directory, 'src', req.params.document_name + '.adoc')));
	req.pipe(asciidoctor.stdin);
	
	var output = fs.createWriteStream(path.join(config.document_directory, 'rendered', req.params.document_name + '.html'));
	asciidoctor.stdout.pipe(output);
	asciidoctor.stdout.on('end', function () {
		res.send(200);
	});
	asciidoctor.stderr.on('data', function () {
		res.send(500);
	});
});
app.get('/document/:document_name.html', function (req, res) {
	res.sendfile(req.params.document_name + '.html', { root: path.join(config.document_directory, 'rendered') });
});

app.listen(8080);