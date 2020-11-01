var gulp = require("gulp")
var gutil = require("gulp-util")
var less = require("gulp-less")
var autoprefix = require("gulp-autoprefixer")
var minifyCSS = require("gulp-minify-css")

var lessDir = "public/less"
var targetCSSDir = "public/css"

gulp.task("css", function() {
  return (
    gulp
      .src(lessDir + "/**/*.less")
      .pipe(less({ style: "compressed" }).on("error", gutil.log))
      //.pipe(autoprefix('last 10 version'))
      .pipe(gulp.dest(targetCSSDir))
  )
})

gulp.task("watch", function() {
  gulp.watch(lessDir + "/**/*.less", gulp.series("css"))
})
