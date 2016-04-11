import test from 'ava';
import execa from 'execa';
import fn from './';

function parseResult(x, y, to, from = null) {
	return {
		x,
		y,
		from,
		to
	};
}

function testParse(string, ...resultArgs) {
	test('parseLine:' + string, t =>
		t.deepEqual(fn(string), [parseResult(...resultArgs)])
	);
}

testParse('A  foo.bar\0', 'A', ' ', 'foo.bar');
testParse('A  foo.bar\0', 'A', ' ', 'foo.bar');
testParse('RM bar\0foo\0', 'R', 'M', 'bar', 'foo');
testParse('?? not-tracking\0', '?', '?', 'not-tracking');
testParse('!! ignored\0', '!', '!', 'ignored');
testParse('A  foo -> bar\0', 'A', ' ', 'foo -> bar');

test('describe', t => {
	t.is(fn.describeCode('m'), 'modified');
	t.is(fn.describeCode(' '), 'unmodified');
	t.is(fn.describeCode('A'), 'added');
	t.is(fn.describeCode('D'), 'deleted');
});

test('parse', t => {
	var actual = fn(['A  foo.bar', 'RM bar\0foo', '!! ignored'].join('\0'));

	t.deepEqual(actual, [
		parseResult('A', ' ', 'foo.bar'),
		parseResult('R', 'M', 'bar', 'foo'),
		parseResult('!', '!', 'ignored')
	]);
});

if (!/0\.10\./.test(process.version)) {
	test('practical example', async () => {
		const {stdout} = await execa('git', ['status', '--porcelain', '-z']);
		console.log(JSON.stringify(fn(stdout).map(
			({x, y, to, from}) => ({
				x: fn.describeCode(x),
				y: fn.describeCode(y),
				to,
				from
			})
		), null, 4));
	});
}
