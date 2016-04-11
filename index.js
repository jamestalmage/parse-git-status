'use strict';

function parseStatus(str) {
	var chunks = str.split('\0');
	var ret = [];
	for (var i = 0; i < chunks.length; i++) {
		var chunk = chunks[i];
		if (chunk.length) {
			var x = chunk[0];
			var fileStatus = {
				x: x,
				y: chunk[1],
				to: chunk.substring(3),
				from: null
			};
			if (x === 'R') {
				i++;
				fileStatus.from = chunks[i];
			}
			ret.push(fileStatus);
		}
	}
	return ret;
}

var DESCRIPTIONS = {
	' ': 'unmodified',
	'M': 'modified',
	'A': 'added',
	'D': 'deleted',
	'R': 'renamed',
	'C': 'copied',
	'U': 'umerged',
	'?': 'untracked',
	'!': 'ignored'
};

function describeCode(code) {
	return DESCRIPTIONS[code.toUpperCase()];
}

module.exports = parseStatus;
module.exports.describeCode = describeCode;
