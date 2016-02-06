'use strict';

var srcPath = './js/';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  return gulp.src([
      srcPath + 'classes/*.js',
      srcPath + 'states/*.js',
      srcPath + 'classes/*/*.js',
      srcPath + 'main.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(srcPath))
    .pipe(uglify({mangle: {toplevel: true}}))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(srcPath))
    .pipe(livereload());
});

gulp.task('default', function() {
  livereload.listen();
  gulp.watch([
    srcPath + '*/*.js',
    srcPath + 'main.js'
  ], ['scripts']);
});