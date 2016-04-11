# parse-git-status [![Build Status](https://travis-ci.org/jamestalmage/parse-git-status.svg?branch=master)](https://travis-ci.org/jamestalmage/parse-git-status)

> Parse the output of `git status --porcelain -z`


## Install

```
$ npm install --save parse-git-status
```


## Usage

```js
const parseGitStatus = require('parse-git-status');
const execa = require('execa');

execa('git', ['status', '--porcelain'])
	.then(({stdout}) => {
		console.log(parseGitStatus(stdout));
	});
```


## API

### parseGitStatus(gitStatus)

Parses `gitStatus` and returns an array of `StatusObject`s.

#### gitStatus

Type: `string`

The output of the command `git status --porcelain`.

--

#### StatusObject

Each status object in the array has the following format:

```js
let statusObj = {
  x: 'A', // status code character
  y: 'A', // status code character
  to: 'bar.js', // the destination path (or just the path if not renamed)
  from: 'foo.js', // the source path if a rename (null otherwise)
}
```

See https://git-scm.com/docs/git-status for a list of available status codes and what each status code means.


### parseGitStatus.describeCode(code)

Returns a descriptive name for each of the status codes.

```js
parseGitStatus.describeCode('M')
// => "modified"
parseGitStatus.describeCode('A')
// => "added"
```

#### code

Type: `string` of length one (a single character)

Legal values are `M`, `A`, `D`, `R`, `C`, `U`, `!`, `?` and ` ` (`space` character).

See https://git-scm.com/docs/git-status for more details.

## License

MIT © [James Talmage](http://github.com/jamestalmage)
