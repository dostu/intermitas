var gulp = require("gulp");
var babel = require("gulp-babel");
var livereload = require("gulp-livereload");

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
    .pipe(gulp.dest("js"))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.babel, ['babel'])
})
