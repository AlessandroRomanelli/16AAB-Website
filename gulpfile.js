const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const pugConcat = require('gulp-pug-template-concat');

gulp.task('sass', () => {
  gulp.src('./public/css/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('pug', () => {
  gulp.src('./app/views/**/*.pug')
    .pipe(pug({
      client: true,
    }))
    .pipe(pugConcat('templates.js', {}))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', () => {
  gulp.watch('./public/css/**/*.sass', ['sass']);
});

gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee pug',
    stdout: false,
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch',
  'pug',
]);
