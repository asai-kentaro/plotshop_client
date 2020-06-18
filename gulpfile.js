var gulp = require('gulp');
var sass = require('gulp-sass');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
var webpack_config_local = require('./webpack.config.local.js');
var webpack_config_server = require('./webpack.config.server.js');
var del = require('del');
var runSeq = require('run-sequence');
var concat = require('gulp-concat');


gulp.task('clean', (cb) => {
  del("./dist/**/*",cb);
});

gulp.task('html', () => {
  gulp.src(['./src/html/**/*.html'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('script', () => {
  if(process.env.NODE_ENV == 'server') {
    return webpackStream(webpack_config_server, webpack)
        .pipe(gulp.dest("dist/js"));
  }

  // Local
  return webpackStream(webpack_config_local, webpack)
      .pipe(gulp.dest("dist/js"));
});

gulp.task('style', () => {
  gulp.src(['./src/vendor/bootstrap/bootstrap.min.css',
    './src/vendor/bootstrap/dashboard.css',
    './node_modules/font-awesome/css/font-awesome.min.css',
    './src/scss/main.scss'])
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('font', () => {
  gulp.src(['./node_modules/font-awesome/fonts/*',
    './src/vendor/bootstrap/fonts/*'])
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('app', ['font'], () => {
  gulp.src(['./src/static/**/*'])
    .pipe(gulp.dest('./dist/static'));
  gulp.src(['./src/vendor/**/*'])
    .pipe(gulp.dest('./dist/vendor'));
});

gulp.task('build', () => {
  runSeq(['html', 'script', 'style', 'app']);
});

gulp.task('default', ['build'], () => {});
