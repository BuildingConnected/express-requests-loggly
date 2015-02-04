/*!
 * express-requests-loggly
 * https://github.com/BuildingConnected/express-requests-loggly
 */

'use strict';

var gulp = require('gulp-help')(require('gulp'));
var mocha = require('gulp-mocha');
var instrument = require('gulp-instrument');
var jsdoc2md = require('jsdoc-to-markdown');
var fs = require('fs');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');

gulp.task('jshint', 'Lint code semantics with JSHint.', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('jscs', 'Lint code style with JSCS.', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jscs());
});

gulp.task('lint', 'Lint code semantics and style.', ['jshint', 'jscs']);

gulp.task('test', 'Run tests.', function () {
  return gulp.src('test/**/*.js')
    .pipe(mocha({
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }));
});

gulp.task('instrument', 'Instrument code using jscoverage.', function () {
  return gulp.src('lib/**/*.js')
    .pipe(instrument())
    .pipe(gulp.dest('lib-cov'));
});

gulp.task('docs', 'Generate documentation.', function(done) {
  jsdoc2md.render('./lib/*.js', {
    template: './lib/readme.hbs'
  })
  .on('error', done)
  .on('end', done)
  .pipe(fs.createWriteStream('README.md'))
});

gulp.task(
  'coverage',
  'Generate test coverage.html report.',
  ['instrument'],
  function() {
    process.env.JSCOV = true;
    return spawn('./node_modules/gulp-mocha/node_modules/mocha/bin/mocha', [
      'test', '--reporter', 'html-cov'
    ]).stdout
      .pipe(source('coverage.html'))
      .pipe(gulp.dest('./'));
  });


gulp.task(
  'watch',
  'Watch for code changes and run linters and tests',
  ['jshint', 'jscs', 'test'],
  function () {
    gulp.watch(['lib/**/*.js', 'test/**/*.js'], ['jshint', 'jscs', 'test']);
  });

gulp.task('clean', 'Clean-up generated files.', function () {
  return gulp.src(['lib-cov', 'coverage.html', 'npm-debug.log']).pipe(clean());
});

gulp.task('default', [process.env.NODE_ENV === 'production' ? 'dist' : 'watch']);
