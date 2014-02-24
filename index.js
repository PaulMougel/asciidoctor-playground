var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var express = require('express');
var config = require('./config');

var app = express();

app.use('/document/', express.static(config.document_directory));
app.post('/document/:document_name', function (req, res, next) {
	var asciidoctor = child_process.spawn('asciidoctor', ['-']);
	req.pipe(asciidoctor.stdin);
	
	var output = fs.createWriteStream(path.join(config.document_directory, req.params.document_name + '.html'));
	asciidoctor.stdout.pipe(output);
	asciidoctor.stdout.on('end', function () {
		res.send(200);
	});
	asciidoctor.stderr.on('data', function () {
		res.send(500);
	});
});

app.listen(8080);