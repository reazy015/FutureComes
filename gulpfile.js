"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var posthtmlInclude = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var cheerio = require("gulp-cheerio");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var run = require("run-sequence");
var del = require("del");
var server = require("browser-sync").create();
var vfs = require('vinyl-fs');
var converter = require('sass-convert');



gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("minify-images", function () {
  return gulp.src("img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("create-webp", function () {
  return gulp.src("img/**/*.{jpg,png}")
    .pipe(webp({
      quality: 87
    }))
    .pipe(gulp.dest("img"));
});

gulp.task("create-sprite", function () {
  return gulp.src("{img/icon-*.svg,img/bg-*.svg,img/text-*.svg,img/*.svg}")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio(function ($) {
      $("svg").attr("style", "display: none")
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("posthtml", function () {
  return gulp.src("*.html")
    .pipe(plumber())
    .pipe(posthtml([
      posthtmlInclude()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});


gulp.task("copy", function () {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/picturefill.min.js"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "create-sprite",
    "posthtml",
    done
  );
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["posthtml"]);
});
