const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const siteRoot = 'App';
const jsFiles = 'App/**/*.js';
const vendorFiles = ['Content/Scripts/*.js', '!Content/Scripts/scripts.js', '!Content/Scripts/vendor.js', '!Content/Scripts/modernizr-3.3.1.js'];

gulp.task('js', () => {
	gulp.src(jsFiles)
		.pipe(concat('scripts.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('Content/Scripts'));

	gulp.src(vendorFiles)
		.pipe(concat('vendor.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('Content/Scripts'));
});

gulp.task('watch', () => {
	gulp.watch([jsFiles, vendorFiles], ['js']);
});

gulp.task('default', ['js']);