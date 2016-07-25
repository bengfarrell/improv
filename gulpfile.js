var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gl2js = require('gulp-gl2js');

gulp.task('build', function () {
    return browserify({
        entries: 'src/improv.es6',
        standalone: 'Improv',
        extensions: ['es2015'], debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source('improv.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});

/**
 * Extra shaders, more of a playground to test a bunch of them
 */
gulp.task('shaders', function() {
    return gulp.src('./src/shaders/*.glsl')
        .pipe(gl2js('shaders', { extension: 'es6', module: true } ))
        .pipe(gulp.dest('./src'));
});

gulp.task('default', ['build']);