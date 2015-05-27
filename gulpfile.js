var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("scripts", function () {
  return gulp.src("src/app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
  gulp.watch('src/app.js', ['scripts']);
});

gulp.task('default', ['watch', 'scripts']);
