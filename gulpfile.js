var
  gutil       = require('gulp-util'),
  browserSync = require('browser-sync'),
  del         = require('del'),
  gulp        = require('gulp'),
  $           = require("gulp-load-plugins")({
                  pattern: ['gulp-*', 'gulp.*'],
                  replaceString: /\bgulp[\-.]/,
                  lazy: false,
                  rename: {
                    'gulp-jade-inheritance' : 'jadeInheritance'
                  }
                }),
  onError = function (err) {  
    gutil.beep();
    console.log(err);
  };

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/fontawesome/fonts/**/*',
    'source/fonts/**/*'
  ])
  .pipe($.plumber({
    errorHandler: onError
  }))
  .pipe(gulp.dest('build/fonts/'))
});

gulp.task('images', function() {
  return gulp.src([
    'source/images/**/*.gif',
    'source/images/**/*.ico',
    'source/images/**/*.jpg',
    'source/images/**/*.jpeg',
    'source/images/**/*.svg',
    'source/images/**/*.png'
  ])
  .pipe($.imagemin({
    interlaced: true,
    optimizationLevel: 5,
    progressive: true
  }))
  .pipe(gulp.dest('build/images'));
});

gulp.task('libraries', function() {
  return gulp.src([
    'bower_components/jquery/jquery.min.js',
    //'bower_components/bootstrap/js/transition.js',
    //'bower_components/bootstrap/js/alert.js',
    //'bower_components/bootstrap/js/button.js',
    //'bower_components/bootstrap/js/carousel.js',
    //'bower_components/bootstrap/js/collapse.js',
    //'bower_components/bootstrap/js/dropdown.js',
    //'bower_components/bootstrap/js/modal.js',
    //'bower_components/bootstrap/js/tooltip.js',
    //'bower_components/bootstrap/js/popover.js',
    //'bower_components/bootstrap/js/scrollspy.js',
    //'bower_components/bootstrap/js/tab.js',
    //'bower_components/bootstrap/js/affix.js',
    //'bower_components/jasny-bootstrap/js/fileinput.js',
    //'bower_components/jasny-bootstrap/js/inputmask.js',
    //'bower_components/jasny-bootstrap/js/offcanvas.js',
    //'bower_components/jasny-bootstrap/js/rowlink.js',
    'source/scripts/jquery.scripts.js'
  ])
  .pipe($.plumber({
    errorHandler: onError
  }))
  .pipe($.concat('libraries.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('build/scripts/'))
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe($.plumber({
    errorHandler: onError
  }))
  .pipe($.less())
  .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe($.cssnano())
  .pipe(gulp.dest('build/stylesheets/'))
});

gulp.task('templates', function() {
  return gulp.src(['source/**/!(_)*.jade'])
  .pipe($.changed('build', { extension: '.html'}))
  .pipe($.jadeInheritance({ basedir: 'source'}))
  .pipe($.plumber())
  .pipe($.jade({
    pretty: true
  }))
  .pipe(gulp.dest('build'));
});

gulp.task('clear-partials', ['templates'], function() {
  del('build/partials/')
});

gulp.task('clear', function() {
  del('build/*')
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Watch

gulp.task('watch', ['setWatch'],  function() {
  gulp.watch('source/fonts/**/*', ['fonts']);
  gulp.watch('source/images/**/*', ['images']);
  gulp.watch('source/scripts/**/*.js', ['libraries']);
  gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
  gulp.watch('source/**/*.jade', ['clear-partials']);
  browserSync.init('build/**/*', {
    server: {
      baseDir: 'build'
    }
  });
});
