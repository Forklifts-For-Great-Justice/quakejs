var _ = require('underscore');
var async = require('async');
var crc32 = require('buffer-crc32');
var express = require('express');
var fs = require('fs');
var logger = require('winston');
var path = require('path');
var wrench = require('wrench');
var zlib = require('zlib');

logger.cli();
logger.level = 'debug';

var config = { "root": "./assets", "output": "./assets/manifest.json" };
var validAssets = ['.pk3', '.run', '.sh'];
var currentManifestTimestamp;
var currentManifest;

function getAssets() {
	return wrench.readdirSyncRecursive(config.root).filter(function (file) {
		var ext = path.extname(file);
		return validAssets.indexOf(ext) !== -1;
	}).map(function (file) {
		return path.join(config.root, file);
	});
}

function generateManifest(callback) {
	logger.info('generating manifest from ' + config.root);

	var assets = getAssets();
	var start = Date.now();

	async.map(assets, function (file, cb) {
		logger.info('processing ' + file);

		var name = path.relative(config.root, file);
		var crc = crc32.unsigned('');
		var compressed = 0;
		var size = 0;

		// stream each file in, generating a hash for it's original
		// contents, and gzip'ing the buffer to determine the compressed
		// length for the client so it can present accurate progress info
		var stream = fs.createReadStream(file);

		// gzip the file contents to determine the compressed length
		// of the file so the client can present correct progress info
		var gzip = zlib.createGzip();

		stream.on('error', function (err) {
			callback(err);
		});
		stream.on('data', function (data) {
			crc = crc32.unsigned(data, crc);
			size += data.length;
			gzip.write(data);
		});
		stream.on('end', function () {
			gzip.end();
		});

		gzip.on('data', function (data) {
			compressed += data.length;
		});
		gzip.on('end', function () {
			cb(null, {
				name: name,
				compressed: compressed,
				checksum: crc
			});
		});
	}, function (err, entries) {
		if (err) return callback(err);
		logger.info('generated manifest (' + entries.length + ' entries) in ' + ((Date.now() - start) / 1000) + ' seconds');

		callback(err, entries);
	});
}

(function main() {
	generateManifest(function (err, manifest) {
		if (err) throw err;

		console.log(manifest)

		var fs = require("fs");
		fs.writeFile(config.output, JSON.stringify(manifest), err => {
			if (err) {
				logger.error("Error writing manifest.json: " + err);
			}
		});
	});
})();
