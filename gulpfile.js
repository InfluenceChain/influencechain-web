const gulp = require('gulp')
const webserver = require('gulp-webserver')
const plumber = require('gulp-plumber')
const gutil = require('gulp-util')
const rename = require('gulp-rename')
const del = require('del')
// const concat = require('gulp-concat')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')

const ejs = require('gulp-ejs')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const postcssnested = require('postcss-nested')
const postcssscss = require('postcss-scss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const babel = require('gulp-babel')
const standard = require('gulp-standard')
const uglify = require('gulp-uglify')

const ASSETS = 'home-assets'

const SRC = {
  ROOT: ASSETS + '/src',
  CSS: ASSETS + '/src/styles',
  JS: ASSETS + '/src/scripts'
}
const DIST = {
  ROOT: ASSETS + '/dist',
  CSS: ASSETS + '/dist/styles',
  JS: ASSETS + '/dist/scripts'
}

const PROD = '../../public'

function getHash (length = 20) {
  const availableStr = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ'
  const availableArr = availableStr.split('')
  let ret = ''
  let count = length
  while (count) {
    ret += availableArr[Math.round(Math.random() * availableArr.length)]
    count--
  }
  return ret
}

gulp.task('build-html', () => {
  return gulp.src('./index.ejs')
    .pipe(plumber())
    .pipe(ejs({
      hash: getHash(),
      year: new Date().getFullYear()
    }, {}, {
      ext: '.html'
    }).on('error', gutil.log))
    .pipe(gulp.dest('./'))
})

gulp.task('build-css', () => {
  const processors = [
    postcssnested,
    autoprefixer,
    cssnano()
  ]

  return gulp.src(SRC.CSS + '/**/*.scss')
    .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(processors, { syntax: postcssscss }))
      .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DIST.CSS))
})

gulp.task('build-js', () => {
  return gulp.src(SRC.JS + '/**/*.js')
    .pipe(plumber())
      .pipe(standard())
      .pipe(standard.reporter('default', {
        breakOnWarning: false,
        breakOnError: false,
        quiet: true,
        showRuleNames: true,
        showFilePath: true
      }))
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DIST.JS))
})

gulp.task('clean-dist', () => {
  return del(
    [
      DIST.CSS + '/**/*',
      DIST.JS + '/**/*'
    ],
    { force: true, dryRun: false }
  ).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'))
  })
})

gulp.task('clean-prod', () => {
  return del(
    [
      PROD + '/' + ASSETS,
      PROD + '/index2.html'
    ],
    { force: true, dryRun: false }
  ).then(paths => {
    console.log('Deleted files:\n', paths.join('\n'))
  })
})

gulp.task('watch', () => {
  gulp.watch(SRC.CSS + '/**/*.scss', ['build-css'])
  gulp.watch(SRC.JS + '/**/*.js', ['build-js'])
  gulp.watch('./index.ejs', ['build-html'])
})

gulp.task('webserver', () => {
  return gulp.src('./')
  .pipe(webserver({
    livereload: true,
    open: true,
    host: '0.0.0.0',
    port: 4051
  }))
})

gulp.task('distribute', () => {
  gulp.src([ASSETS + '/dist/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/dist'))
  gulp.src([ASSETS + '/font/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/font'))
  gulp.src([ASSETS + '/img/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/img'))
  gulp.src([ASSETS + '/lib/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/lib'))
  gulp.src([ASSETS + '/video/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/video'))
  gulp.src([ASSETS + '/download/**/*']).pipe(plumber()).pipe(gulp.dest(PROD + '/' + ASSETS + '/download'))
  // gulp.src(['index.html']).pipe(plumber()).pipe(rename('index2.html')).pipe(gulp.dest(PROD))
  gulp.src(['index.html']).pipe(plumber()).pipe(gulp.dest(PROD))
})

gulp.task('build', () => {
  return runSequence('clean-dist', 'build-css', 'build-js', 'build-html')
})

gulp.task('dev', () => {
  return runSequence('clean-dist', 'build-css', 'build-js', 'build-html', 'webserver', 'watch')
})

gulp.task('dist', () => {
  return runSequence('clean-dist', 'clean-prod', 'build-css', 'build-js', 'build-html', 'distribute')
})

gulp.task('default', () => {
  return runSequence('dev')
})
