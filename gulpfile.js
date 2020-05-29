const gulp = require('gulp'); // Подключаем Gulp
const browserSync = require('browser-sync').create();//Подключаем browserSync
const watch = require('gulp-watch');//Подключаем функию Watch
const sass = require('gulp-sass');//Подключаем Компилятор SASS и SCSS
const autoprefixer = require('gulp-autoprefixer');//Подключаем авто-вендерные префиксы
const sourcemaps = require('gulp-sourcemaps');//Подключаем исходные карты стилей
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');//Подключаем вывод логов об ошибке 
const fileinclude = require('gulp-file-include');//Подключаем скрещивание файлов

//Таск для сборки index.html 
gulp.task('html', function(callback) {
	gulp.src('./app/html/*.html')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'HTML',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(fileinclude({prefix : '@@'}))
		.pipe(gulp.dest('./app/'))
	callback();
});




// Таск для компиляции SASS в CSS
gulp.task('sass', function(callback) {
	return gulp.src('./app/sass/main.sass')

		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			overrideBrowserslist:['last 4 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe( gulp.dest('./app/css/') )
	callback();
});


//Слежение за файлами и при их обнаружении будет обновление страницы
gulp.task('watch', function() {
//Слежение за  HTML и CSS файлами 
	watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel( browserSync.reload ));
//Слежение за  SASS файлами
	watch('./app/sass/**/*.sass', gulp.parallel('sass'))
//Слежение за HTML файлами и сборка в index.html
	watch('./app/html/**/*.html', gulp.parallel('html'))
});
 
//Задача для старта сервера из папки app
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./app/",
		},
	})
});

//Дефолтный таск
gulp.task('default', gulp.parallel('server', 'watch','sass', 'html'));
