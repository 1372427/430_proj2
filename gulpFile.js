const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('sass', () => {
    gulp.src('./scss./style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted'));
});

gulp.task('js', () => {
    gulp.src('./client/*.js')
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'));
});

gulp.task('lint', () => {
    gulp.src('./server/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', () => {
    gulp.start('sass');
    gulp.start('js');
    gulp.start('lint');
});

gulp.task('watch', () => {
    gulp.watch('./scss/style.scss', ['sass']);
    gulp.watch('./client/*.js', ['js']);
    nodemon({
        script: './server/app.js',
        ext: 'js',
        ignore: ['./hosted/*.js', './client/*.js'],
        tasks: []
    });
});