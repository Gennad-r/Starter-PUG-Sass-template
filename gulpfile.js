const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');



// Static server
gulp.task('server', function() {
	browserSync.init({
		server: {
			port: 9000,
			baseDir: "build"
		}
	});

	gulp.watch('build/**/*').on('change', browserSync.reload);
});



// PUG compilation
gulp.task('templates:compile', function buildHTML() {
	return gulp.src('source/templates/index.pug')
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('build'));
});

// SASS compilation
gulp.task('templates:sass', function () {
	return gulp.src('source/styles/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('build/css'));
});

// Sprites
gulp.task('sprite', function (cb) {
	const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '../img/sprite.png',
		cssName: 'sprite.scss'
	}));
	spriteData.img.pipe(gulp.dest('build/images/'));
	spriteData.css.pipe(gulp.dest('source/styles/global/'));
	cb();
});

// Delete build
gulp.task('clean', function del(cb){
	return rimraf('build', cb);
});

// Copy fonts
gulp.task('copy:fonts', function(){
	return gulp.src('./source/fonts/**/*.*')
	.pipe(gulp.dest('build/fonts'));
});

// Copy images
gulp.task('copy:images', function(){
	return gulp.src('./source/img/**/*.*')
	.pipe(gulp.dest('build/img'));
});

// COPY
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers
gulp.task('watch', function(){
	gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
	gulp.watch('source/styles/**/*.scss', gulp.series('templates:sass'));
});

// Default action
gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'templates:sass', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
	)
);