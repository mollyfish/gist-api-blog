var gulp = require('gulp');
var ngConfig = require('gulp-ng-config');
var config = require('../config').ngConfig;
var fs = require('fs');

gulp.task('ng-config', function () {
  var tokenFile = config.dest + '/token.txt';

  // Create a temporary file with the token stored in it
  fs.writeFileSync(tokenFile, '{"token": "' + process.env.OAUTH_TOKEN + '"}');

  // Generate the token config file
  gulp.src(tokenFile)
    .pipe(ngConfig('blog.config'))
    .pipe(gulp.dest(config.dest));
});
