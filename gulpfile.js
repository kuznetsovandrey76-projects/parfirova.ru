var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlbeautify = require('gulp-html-beautify'),
    pug = require('gulp-pug');

gulp.task('view', function() {
    return gulp.src('./src/views/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(pug({pretty:true}))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'HTML compiled',
        //     sound: false
        // }));

});

gulp.task('css', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'CSS compiled',
        //     sound: false
        // }));

});

gulp.task('js', function() {
    return gulp.src('src/js/main.js')
        .pipe(rigger())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
        // .pipe(notify({
        //     title: 'JS compiled',
        //     sound: false
        // }));

});

gulp.task('img', function () {
    return gulp.src('src/img/**/*.{png,jpg,gif,svg}') 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest('build/img')) 
        .pipe(reload({stream: true}));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './build/'
        }
    });

    gulp.watch('src/scss/**/*.scss', gulp.series('css'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
    gulp.watch('src/views/**/*.pug', gulp.series('view'));
    gulp.watch('src/img/images/*.{png,jpg,gif,svg}', gulp.series('img'));
});

gulp.task('build', gulp.series(
    'view',
    'img',
    'css',
    'js'
));

gulp.task('default', gulp.series('build', 'serve'));
