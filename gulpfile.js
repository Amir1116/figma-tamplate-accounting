"use strict";
const {src, dest} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync").create();
const del = require("del");  
const cssBeautify = require("gulp-cssbeautify");
const nano = require("gulp-cssnano");
const imageMin = require("gulp-imagemin");                  const plumber = require("gulp-plumber");
const rigger = require("gulp-rigger");
const stripComments = require("gulp-strip-css-comments");
const uglify = require("gulp-uglify");
const panini = require("panini");
const rename = require('gulp-rename');


const path = {
 build: {
  html:'dist/',
  js:'dist/assets/js/',
  css:'dist/assets/css/',
  images:'dist/assets/img/',
  fonts:'dist/assets/fonts/',
  },
 src: {
  html:'src/*.html',
  js:'src/assets/js/*.js',
  css:'src/assets/sass/style.scss',
  images:'src/assets/img/**/*.{jpg,png,svg,ico}',
  fonts:'src/assets/fonts/**/*.{ttf,woff,woff2,eot}',
  },
 watch: {
  html:'src/**/*.html',
  js:'src/assets/js/**/*.js',
  css:'src/assets/sass/**/*.scss',
  images:'src/assets/img/**/*.{jpg,png,svg,ico}',
  fonts:'src/assets/fonts/**/*.{ttf,woff,woff2,eot}',
  },
  clean:'./dist',
}


//html from src to dist

function html(){
  panini.refresh();
  return src(path.src.html,{base:'src/'})
    .pipe(plumber())
    // .pipe(panini({
    //   root: 'src/',
    //   layouts: 'src/templates/layouts/',
    //   partials: 'src/templates/partials/',
    //   helpers: 'src/tempates/helpers/',
    //   data: 'src/templates/data/'
    // }))
    
    .pipe(dest(path.build.html));
}
function css(){
  return src(path.src.css,{base: 'src/assets/sass/'})
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      Browerslist:['last 8 versions'],
      cascade:true
    }))
    .pipe(cssBeautify())
    .pipe(dest(path.build.css))
    .pipe(nano({
      zindex:false,
      discardComments:{
        removeAll:true
      }
    }))
    .pipe(stripComments())
    .pipe(rename({
      suffix:'.min',
      extname:'.css'
    }))
    .pipe(dest(path.build.css));
}
function js(){
  return src(path.src.js,{base:'./src/assets/js'})
  .pipe(plumber())
  .pipe(rigger())
  .pipe(dest(path.build.js))
  .pipe(uglify())
  .pipe(rename({
    suffix:'.min',
    extname:'.js',
  }))
  .pipe(dest(path.build.js))
  .pipe(browserSync.stream());
}
function images(){
  return src(path.src.images)
    .pipe(imageMin())
    .pipe(dest(path.build.images))
}
function fonts(){
  return src(path.src.fonts)    
    .pipe(dest(path.build.fonts))
}
function clean(){
  return del(path.clean);
}
function watchFiles(){
  gulp.watch([path.watch.html],html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js],js);
  gulp.watch([path.watch.images],images);
  gulp.watch([path.watch.fonts],fonts);
}
function browserS(){
  browserSync.init({
    server:{
      baseDir:'./dist/'
    },
    port: 3000,
  })
}
const build = gulp.series(clean,gulp.parallel(html,css,js,images,fonts));
const watch = gulp.parallel(build,watchFiles,browserS)
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
