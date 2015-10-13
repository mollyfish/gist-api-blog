var gulp = require('gulp');
var config = require('../config').javascript;
var webpack = require('webpack-stream');

gulp.task('webpack', function(callback) {
  return gulp.src(config.entryPoint)
  .pipe(webpack({
    output: {
      filename: config.packedFile
    }
  }))
  .pipe(gulp.dest(config.dest));
});
