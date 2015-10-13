var dest = './public';
var src = './src';

module.exports = {
  javascript: {
    src: src + '/app/**/*.js',
    dest: dest + '/js/',
    entryPoint: src + '/webpack-entry.js',
    packedFile: 'packed.js'
  },
  sass: {
    src: src + '/styles/**/*.{sass,scss}',
    dest: dest + '/styles/',
    settings: {
      indentedSyntax: true,
    }
  },
  html: {
    src: src + "/app/**/*.html",
    dest: dest + "/views/",
  },
  server: {
    src: dest,
    livereload: false,
    directoryListing: false,
    open: false,
    port: 9000
  },
  production: {
    cssSrc: dest + '/styles/*.css',
    jsSrc: dest + '/*.js',
    cssDest: dest + '/css/',
    jsDest: dest + '/js/'
  }
};
