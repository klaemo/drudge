# Drudge

**drudge** - *NOUN* someone who has to do a lot of boring and unpleasant work

Drudge watches and serves your files while also acting as a [LiveReload](http://livereload.com/) server.

File watching and live reloading are hard. I haven't had any luck with the existing solutions. So, I perused [npm](https://www.npmjs.org) and pulled together the most popular modules for the respective jobs:

- [tiny-lr](https://www.npmjs.org/package/tiny-lr) for the LiveReload server
- [chokidar](https://www.npmjs.org/package/chokidar) for the file watcher
- [st](https://www.npmjs.org/package/st) for the static file server

They work really well together! Yay, UNIX philosophy!

As for the livereload client, you need to install the [browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) or add the livereload script tag [manually](http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-).

## Installation

Drudge is a [node.js](http://nodejs.org) program, so you want to to install that first.

```
npm install [-g] drudge
```

## Usage (CLI)

```
drudge -h 

Usage: bin [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -d, --dir [DIRECTORY]  Serve the contents of DIRECTORY (default=cwd)
    -i, --index [INDEX]    Use the specified INDEX filename as the result when a directory is requested. (default=index.html)
    -p, --port [PORT]      Listen on PORT (default=3000)
    -t, --passthrough      Return INDEX for missing files instead of 404.
    -q, --quiet            Turn off logging
```

The `passthrough` options is especially useful when your developing a "Single Page Application" where you do all the routing on the client. The server simply returns your app instead of a `404 Not Found`.

### Example

```
drudge -d static -p 1337 -t
  server Watching /Users/clemens/Projects/drudge/static +0ms
  server LiveReload listening on http://localhost:35729 +10ms
  server HTTP Server listening on http://localhost:1337 +1ms
```

or combine it with watchify to reload your bundled javascript:
```
watchify index.js -o public/bundle.js & drudge -d public
```
Now everytime you change a file in your project, watchify will update the bundle and drudge will subsequently trigger a reload in the browser.

## Usage as a module

```
var drudge = require('drudge')
```

## TODO
- expose more options
- expose proper node.js API

Issues, requests and PRs welcome! :)

## License

ISC
