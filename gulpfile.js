const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const merge = require('merge-stream');
const webpack = require('webpack-stream');

gulp.task('clean', () => {
  return del('lib/*', { force: true });
});

gulp.task('main', () => {
  const tsProject = ts.createProject('tsconfig.base.json', {
    declaration: true,
    module: 'es6',
  });

  const babelrc = {
    ignore: ['**/*.d.ts'],
    plugins: ['lodash'],
    presets: [
      ['@babel/preset-env', {
        targets: { node: '6' },
        useBuiltIns: 'usage'
      }],
      '@babel/preset-stage-0'
    ]
  };

  const transpiled = gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel(babelrc))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/main'));

  const copied = gulp.src(['src/**/*.d.ts'])
    .pipe(gulp.dest('lib/main'));

  return merge(transpiled, copied);
});

gulp.task('module', () => {
  const tsProject = ts.createProject('tsconfig.base.json', {
    declaration: true,
    module: 'es6',
  });

  const babelrc = {
    ignore: ['**/*.d.ts'],
    plugins: ['lodash'],
    presets: [
      ['@babel/preset-env', {
        "modules": false,
        targets: { node: '6' },
        useBuiltIns: 'usage'
      }],
      '@babel/preset-stage-0'
    ]
  };

  const transpiled = gulp.src(['src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel(babelrc))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/module'));

  const copied = gulp.src(['src/**/*.d.ts'])
    .pipe(gulp.dest('lib/module'));

  return merge(transpiled, copied);
});

gulp.task('browser', () => {
  return webpack(require('./webpack.config'))
    .pipe(gulp.dest('lib/browser'));
});
