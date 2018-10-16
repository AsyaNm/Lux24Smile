// TO INSTALL ALL MODULES:
// npm install --global gulp
// npm i gulp gulp-debug gulp-changed gulp-cached gulp-if gulp-filter gulp-autoprefixer gulp-sass gulp-pug gulp-pug-inheritance gulp-sass-inheritance browser-sync gulp-connect-php --save-dev

'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sassInheritance = require('gulp-sass-inheritance');
var browserSync = require('browser-sync');
var connectPHP = require('gulp-connect-php');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app',
			directory: true
		},
		files: 'app/pages/*.html',
		notify: false,
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**.scss')
		.pipe(changed('app/sass/*', {
			extension: '.scss'
		}))
		.pipe(gulpif(global.isWatching, cached('sass')))
		.pipe(sassInheritance({dir: 'app/sass/'}))
		.pipe(debug({title: 'Changed style-file'}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 5%', 'iOS 7'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('setWatch', function() {
	global.isWatching = true;
});

gulp.task('watch', ['setWatch', 'sass', 'browser-sync'], function() {
	gulp.watch('app/sass/*.scss', ['sass']);
	gulp.watch('app/pages/**/*.*', browserSync.reload);
	gulp.watch('app/js/*.*', browserSync.reload);
});