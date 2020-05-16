const { series, src, dest, watch } = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const scss = () =>
  src('assets/css/dev/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('assets/css/prod/'));

const js = () =>
  src('assets/js/dev/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('assets/js/prod/'));

const _watch = () => {
  watch('assets/css/dev/*.scss', scss);
  watch('assets/js/dev/*.js', js);
};

// gulp.task('default', ['scss', 'js', 'watch'])
module.exports = {
  default: series(scss, js, _watch),
};
