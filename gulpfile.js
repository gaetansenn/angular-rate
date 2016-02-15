var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var eslint = require('gulp-eslint');
var streamqueue = require('streamqueue');
var htmlmin = require('gulp-htmlmin');
var ngtemplates = require('gulp-angular-templatecache');
var less = require('gulp-less');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

// tests
var testDirectory = path.join(rootDirectory, './test/unit');

var sourceFiles = [

  // Make sure module files are handled first
  path.join(sourceDirectory, '/**/*.module.js'),

  // Then add all JavaScript files
  path.join(sourceDirectory, '/**/*.js')
];

var partialsFiles = [
  { root: 'template/rate', files: [
    sourceDirectory + '/**/*.html'
  ] }
];

var styleFiles = [
  sourceDirectory + '/**/*.less'
];

function handleError(err) {
  console.warn(err.message);
  this.emit('end');
}

var lintFiles = [
  // Karma configuration
  'karma-*.conf.js'
].concat(sourceFiles);

var transformUrl = function (url) {
  return url.replace('angular-rate/', '');
};

gulp.task('styles', [], function () {
  var stream = streamqueue({ objectMode: true });

  stream.queue(
    gulp.src(styleFiles)
      .pipe(concat('styles.less'))
      .pipe(less().on('error', handleError))
  );

  stream.on('error', handleError);

  return stream.done()
    .pipe(concat('rate.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', function() {
  var stream = streamqueue({ objectMode: true });

  stream.queue(
    gulp.src(sourceFiles)
      .pipe(concat('src.js'))
  );

  partialsFiles.forEach(function (partials) {
    stream.queue(
      gulp.src(partials.files)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }).on('error', handleError))
        .pipe(ngtemplates({ module: 'angularRate', root: partials.root, transformUrl: transformUrl}))
    );
  });

  return stream.done()
    .pipe(concat('angular-rate.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename('angular-rate.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('lint', 'test-src', 'styles', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch(sourceFiles, ['process-all']);

  // watch test files and re-run unit tests when changed
  gulp.watch(path.join(testDirectory, '/**/*.js'), ['test-src']);
});

/**
 * Validate source JavaScript
 */
gulp.task('lint', function () {
  return gulp.src(lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', function () {
  runSequence('process-all', 'watch');
});
