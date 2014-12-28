var gulp = require('gulp');
var gulpBrowserify = require('gulp-browserify');

// Build for browser
gulp.task('browserify', function() {
    gulp.src('src/quad.js')
        .pipe(gulpBrowserify({
            standalone: 'Quadtree'
        }))
        .pipe(gulp.dest('./build/'))
});