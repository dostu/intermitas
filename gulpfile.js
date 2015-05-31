var gulp = require("gulp");
var babel = require("gulp-babel");
var browserSync = require('browser-sync').create();

var paths = {
  babel: 'src/*.js'
}

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('babel', function () {
  return gulp.src(paths.babel)
    .pipe(babel())
    .on('error', swallowError)
    .pipe(gulp.dest("js"));
});

gulp.task('js-watch', ['babel'], function() { browserSync.reload() });

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }, 
    notify: false
  });
  gulp.watch(paths.babel, ['js-watch']);
});
