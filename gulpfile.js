const gulp = require('gulp');
const yarn = require('gulp-yarn');
const gprint = require('gulp-print');
const env = require('gulp-env');
const tsc = require('gulp-tsc');
const jasmine = require('gulp-jasmine');
const webpack = require('webpack');
const vinylPaths = require('vinyl-paths');
const nodemon = require('nodemon');
const del = require('del');
const path = require('path');
const fs = require('fs');

const paths = {
  dist: 'dist',
  wp: 'webpack.config.js',
  pkg: 'package.json',
  srv: 'server.js',
  lock: 'yarn.lock',
  test: 'spec/backend',
  tmp: '.tmp'
};
const package = require(path.join(__dirname, paths.pkg));
const wp_backend_conf = require(path.join(__dirname, paths.wp));

gulp.task('clean', () => {
  return gulp.src([
      path.join(__dirname, paths.dist),
      path.join(__dirname, paths.tmp)
    ])
    .pipe(gprint()).pipe(vinylPaths(del));
});

gulp.task('package', () => {
  return fs.writeFileSync(
    path.join(__dirname, paths.dist, paths.pkg),
    JSON.stringify(package));
});

gulp.task('modules', ['package'], () => {
  return gulp.src([
      path.join(__dirname, paths.dist, paths.pkg),
      path.join(__dirname, paths.dist, paths.lock)
    ])
    .pipe(gulp.dest(path.join(__dirname, paths.dist)))
    .pipe(yarn({
      production: true
    }));
});

gulp.task('backend:build', (done) => {
  webpack(wp_backend_conf).run((err, stats) => {
    if (err) console.log('Error', err);
    else console.log(stats.toString());
    done();
  });
});

gulp.task('backend:watch', () => {
  webpack(wp_backend_conf).watch(100, (err, stats) => {
    if (err) console.log('Error', err);
    else console.log(stats.toString());
    nodemon.restart();
  });
});

gulp.task('backend:test', () => {
  return gulp.src([paths.test + '/*spec.ts'])
    .pipe(gprint())
    .pipe(tsc())
    .pipe(gulp.dest(paths.tmp))
    .pipe(gprint())
    .pipe(jasmine({
      timeout: 3000,
      verbose: true
    }));
});

gulp.task('test', ['backend:test']);

gulp.task('build', ['modules', 'backend:build']);

gulp.task('watch', ['backend:watch'], () => {
  env({
    vars: {
      DEBUG: '*paraboloid*',
      REGISTER: true
    }
  });
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'dist', 'server'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', () => {
    console.log('>>> Nodemon restarted');
  });
});

gulp.task('default', ['build']);
