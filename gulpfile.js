/***************************
  Vars
***************************/
var gulp         = require('gulp'),
	//util         = require('gulp-util'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify'), //For JS
	cleanCSS     = require('gulp-clean-css'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	include      = require('gulp-file-include');

/***************************
  Browser Sync
***************************/
gulp.task('browser-sync', function() {
	browserSync.init({
		server: { baseDir: 'app' },
		//proxy: 'yourlocal.dev',
		notify: false
	});
});

/***************************
  JS
***************************/
gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/imagesloaded/imagesloaded.pkgd.min.js',
		'app/js/common.js'
	])
	.pipe(concat('scripts.js'))
	//.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream());
});

/***************************
  Sass
***************************/
gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({
		outputStyle: 'expanded'
	}).on('error', sass.logError))
	//.pipe(rename({suffix: '.min'}))
	.pipe(autoprefixer())
	//.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

/***************************
  Include
***************************/
gulp.task('include', function() {
	return gulp.src(['app/include/*.html'])
	.pipe(include({
		prefix: '@',
		basepath: '@file'
	}))
	.pipe(gulp.dest('app/'))
	.pipe(browserSync.reload({stream: true}));
});

/***************************
  Image minification
***************************/
gulp.task('imagemin', function() {
	return gulp.src('app/images/**/*')
	.pipe(cache(imagemin([
		imagemin.gifsicle({ interlaced: true }),
		imagemin.jpegtran({ progressive: true }),
		imagemin.optipng({ optimizationLevel: 5 }),
		imagemin.svgo({
			plugins: [
				{
					removeViewBox: false,
					collapseGroups: true
				}
			]
		})
	])))
	.pipe(gulp.dest('dist/images'));
});

/***************************
  Watch
***************************/
gulp.task('watch', function() {
	gulp.watch('app/include/**/*.html', gulp.parallel('include'));
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	//gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('js'));
});

/***************************
  Build
***************************/
gulp.task('prebuild', async function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/*',
		'!app/include',
		'!app/libs',
		'!app/sass'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/style.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));
});

/***************************
  Default
***************************/
gulp.task('removedist', function() {
	return del('dist');
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('default', gulp.parallel('include', 'sass', 'js', 'browser-sync', 'watch'));
gulp.task('build', gulp.series('removedist', 'imagemin', 'sass', 'js', 'prebuild'));
