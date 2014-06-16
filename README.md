# Livereload seed

Seed project for [Grunt][grunt]-based development server. It will watch for
source changes, restart backend and refresh page in the browser.


## Getting started

Install [Grunt][grunt] and node.js packages:

```sh
npm install -g grunt-cli
npm install
```

Then create [virtualenv][virtualenv] and install dependencies for python backend:

```sh
virtualenv python
./python/bin/pip install -r server/requirements.txt
```

To illustrate the approach we use [Tornado][tornado] backend. You can use
[Django][django], [Flask][flask] and other similar frameworks.


## Usage

```sh
grunt serve
```

This will start the backend server behind a proxy with support for automatic
reloading pages in the browser when you change the source files.

[grunt]: http://gruntjs.com/
[virtualenv]: https://pypi.python.org/pypi/virtualenv
[tornado]: http://www.tornadoweb.org/
[django]: https://www.djangoproject.com/
[flask]: http://flask.pocoo.org/
