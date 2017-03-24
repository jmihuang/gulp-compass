var gulp = require('gulp');
    del = require('del');
    sass = require('gulp-sass');
    compass = require('gulp-compass');
    minifyCSS = require('gulp-minify-css');
    autoprefixer = require('gulp-autoprefixer'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload');



//*******************************
//Sass compile
//*******************************
var _sassDiskPath = './sass/**/*.scss';
var _cssDestPath = './dist/style/';


gulp.task('styles', function () {
    return gulp.src(_sassDiskPath) // sass 來源路徑
        .pipe(compass({
            css: './dist/style', // compass 輸出位置
            sass: './sass',      // sass 來源路徑
            style: 'compressed',  // CSS 處理方式，預設 nested（expanded, nested, compact, compressed）
            comments: false,      // 是否要註解，預設(true)
            logging  : false,
            sourcemap: true
        }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(_cssDestPath)) // 輸出位置(非必要)
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS({}))
    .pipe(gulp.dest(_cssDestPath))
    .pipe(connect.reload())
    .pipe(notify({ message: 'Styles task complete' }));
});

//*******************************
//Scripts compile
//*******************************

var _jsDiskPath = './js/*.js';
var _jsDestPath = './dist/js/';

gulp.task('scripts', function (){
  return gulp.src(_jsDiskPath)
  //.pipe(jshint())
  //.pipe(jshint.reporter('jshint-stylish'))
  .pipe(concat('main.js'))
  .pipe(gulp.dest(_jsDestPath))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest(_jsDestPath))
  .pipe(connect.reload())
  .pipe(notify({ message: 'Scripts task complete' }))

});

//*******************************
//Html compile
//*******************************

gulp.task('html', function () {
  return gulp.src('./dist/*.html')
      .pipe(connect.reload());
});

//*******************************
//圖片壓縮
//*******************************


var _imagesDiskPath = './image/**';
var _imagesDestPath = './dist/image';

gulp.task('images', function() { 
  return gulp.src(_imagesDiskPath )
    .pipe(cache(imagemin({ 
      optimizationLevel: 3, 
      progressive: true, 
      interlaced: true 
    })))
    .pipe(gulp.dest(_imagesDestPath))
    .pipe(notify({ message: 'Images task complete' }))
});


// *********************
// LiveReload
// *********************
gulp.task('connect', function () {
    connect.server({
      livereload: true
    });
});

gulp.task('watch', function() {
       gulp.watch('./sass/**/*.scss', ['styles']);
       gulp.watch(_jsDiskPath, ['scripts']);
       gulp.watch(_imagesDiskPath, ['images']);
       gulp.watch('dist/*.html', ['html']);
});

//*******************************
//清除目的地目錄並重建檔案
//*******************************

gulp.task('clean', function(cb) { 
    return del([_cssDestPath,_jsDestPath] ,cb);
});

gulp.task('default',['clean'],function (){
    gulp.start('styles','scripts','connect','watch');
});



