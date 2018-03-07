var gulp = require("gulp");
var path = require('path');
var template = require('gulp-template');
var rename = require('gulp-rename');
var batch = require('gulp-batch');
var toCase = require('to-case');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssMin = require('gulp-css');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var minifyHTML = require('gulp-minify-html');
var server = require('gulp-server-livereload');
var jsonMinify = require('gulp-json-minify');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var strip = require('gulp-strip-comments');
var fs = require('fs');
var shell = require('gulp-shell');
var prop = require('./gulp.json');

var argv = require('yargs')
.usage('Usage: gulp <command> [options]')
.command(['component','page','service','provider','filter','directive'], 'Create component', {
	name: {
		describe: 'Component name',
		demandOption: true,
		requiresArg: true,
        type: 'string',
	}
})
.command('core', 'Minify javascript, html, sass, json files from app folder and send to dest path.')
.command('libs', 'Minify javascript dependencies (Section libs in gulp.json) and create a vendor.js file in dest path.')
.command('styles', 'Minify css dependencies (Section styles in gulp.json) and create a vendor.css file in dest path.')
.command('fonts', 'Move fonts dependencies (Section fonts in gulp.json) to dest path.')
.command('watch', 'Check app files changes and run core task.')
.command('clean', 'Delete dest folder.')
.command('imagemin', 'Minify images files and move to dest path.')
.command('serve', 'Run our app, check app file changes and livereload.')
.command('scripts', 'Run libs and core task.')
.command('build', 'Run clean, scripts, styles, fonts and imagemin task.')
.help()
.argv;

var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

function minifyJs(src,filename){
	return gulp.src(src)
		.pipe(jshint())
		.pipe(gulpif(filename != 'vendor',sourcemaps.init()))
		.pipe(concat(filename+'.js'))
	    .pipe(gulpif(filename != 'vendor',babel({presets: ['es2015']})))
	    .pipe(ngAnnotate())
	    .pipe(uglify().on('error', function(e){console.log(e);}))
	    .pipe(gulpif(filename != 'vendor',sourcemaps.write('./maps')))
	    .pipe(gulp.dest(prop.config.dest+'/assets/js'));
}

// Create component
gulp.task('component',function(){
	var name = toCase.slug(argv.name);
	gulp.src('./templates/component/*.**')
		.pipe(template({
			name: name,
			camelCaseName: toCase.camel(name)
		}))
		.pipe(rename(function(path){
			path.basename = path.basename.replace('temp', name);
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/components/', name)));
	
});


// Create page
gulp.task('page',function(){
	var name = toCase.slug(argv.name);
	var camelCaseName = toCase.camel(name);
	gulp.src('./templates/page/*.**')
		.pipe(template({
			name: name,
			camelCaseName: camelCaseName
		}))
		.pipe(rename(function(path){
			if(path.extname === '.js'){
				path.basename = path.basename.replace('temp', camelCaseName);				
			}else{
				path.basename = path.basename.replace('temp', name);
			}
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/pages/', name)));

});

//Create service
gulp.task('service',function(){
	var name = toCase.slug(argv.name);
	var camelCaseName = toCase.camel(name);
	
	gulp.src('./templates/service/tempService.js')
		.pipe(template({
			name: name,
			camelCaseName: camelCaseName
		}))
		.pipe(rename(function(path){
			path.basename = path.basename.replace('temp', camelCaseName);
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/services/')));

});

//Create directive
gulp.task('directive',function(){
	var name = toCase.slug(prop.config.prefix+'-'+argv.name);
	var camelCaseName = toCase.camel(name);
	
	gulp.src('./templates/directive/tempDirective.js')
		.pipe(template({
			name: name,
			camelCaseName: camelCaseName
		}))
		.pipe(rename(function(path){
			path.basename = path.basename.replace('temp', camelCaseName);
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/directives/')));
});

//Create filter
gulp.task('filter',function(){
	var name = toCase.slug(argv.name);
	var camelCaseName = toCase.camel(name);
	
	gulp.src('./templates/filter/tempFilter.js')
		.pipe(template({
			name: name,
			camelCaseName: camelCaseName
		}))
		.pipe(rename(function(path){
			path.basename = path.basename.replace('temp', camelCaseName);
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/filters/')));
});

//Create provider
gulp.task('provider',function(){
	var name = toCase.slug(argv.name);
	var camelCaseName = toCase.camel(name);
	
	gulp.src('./templates/service/tempProvider.js')
		.pipe(template({
			name: name,
			camelCaseName: camelCaseName
		}))
		.pipe(rename(function(path){
			path.basename = path.basename.replace('temp', camelCaseName);
		}))
		.pipe(gulp.dest(path.join(prop.config.path+'/services/')));

});

// Concat vendor libs
gulp.task('libs',function(){
	minifyJs(prop.libs, 'vendor');	
});

// Minify core JS files and copy the result file and html components templates to destination path 
gulp.task('core',function(){
	minifyJs(['!'+prop.config.path+'/_temp/**','!'+prop.config.path+'/**/*.test.js',prop.config.path+'/**/*Module.js',prop.config.path+'/**/*.js'],'app');
	
	gulp.src(['!'+prop.config.path+'/_temp/**',prop.config.path+'/**/*.{html,xml}'])
		.pipe(minifyHTML({
		    conditionals: true,
		    spare:true
		}))
		.pipe(gulp.dest(prop.config.dest));
	gulp.src(['!'+prop.config.path+'/_temp/**',prop.config.path+'/**/*.css'])
		.pipe(sourcemaps.init())
		.pipe(concat('app.css'))		
		//.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss([ autoprefixer(autoprefixerOptions) ]))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(prop.config.dest+'/assets/css'));
	
	gulp.src(['!'+prop.config.path+'/_temp/**',prop.config.path+'/**/*.json'])
		.pipe(jsonMinify())
		.pipe(gulp.dest(prop.config.dest))
	
	gulp.src(prop.config.path+'/_temp/**/**')
		.pipe(gulp.dest(prop.config.dest));
});

// Concat vendor styles
gulp.task('styles',function(){	
	gulp.src(prop.styles)
		.pipe(concat('vendor.css'))
		.pipe(strip.text())
		.pipe(cssMin())
		.pipe(gulp.dest(prop.config.dest+'/assets/css'));
});

// Copy vendor fonts
gulp.task('fonts',function(){
	var fonts = prop.fonts.map(function(item) {
		return item+'/*.{ttf,woff,woff2,eot,svg}';
	});	
	
	gulp.src(fonts)
		.pipe(gulp.dest(prop.config.dest+'/assets/fonts'));
});

gulp.task('docs', shell.task([
  'node node_modules/jsdoc/jsdoc.js '+
    '-c node_modules/angular-jsdoc/common/conf.json '+  // config file
    '-t node_modules/angular-jsdoc/angular-template '+  // template file
    '-d docs '+                           				// output directory
    './README.md ' +                            		// to include README.md as index contents
    '-r src'                 							// source code directory
]));

// Watch modifications in the files
gulp.task('watch', function () {
    watch([prop.config.path+'/**'], batch(function (events, done) {
        gulp.start('core', done);
    }));    
});

// Clean dest directory
gulp.task('clean', function(){
	return gulp.src(prop.config.dest, {read: false,force: true})
    	.pipe(clean());
});

// Optimize images
gulp.task('imagemin', function() {
    gulp.src(prop.config.path+'/assets/img/*.{jpg,jpeg,svg,gif,png,ico}' )
        .pipe(imagemin())
        .pipe(gulp.dest(prop.config.dest + '/assets/img'));
});

// Serve pages and live reload core changes
gulp.task('serve', ['watch'], function () {
	gulp.src(prop.config.dest)
		.pipe(server({
			livereload: {
				enable: true,
				// Configure livereload to ignore changes, only handle changes to the compiled CSS
//				filter: function (filename, cb) {
//					cb(!/\.(sa|le)ss$|node_modules/.test(filename));
//				}
			},
			port:prop.config.port,
			open: true,
			// HTML5 mode: non-hash URLs for my single page app
			fallback: 'index.html',
		    fallbackLogic: function(req, res, fallbackFile) {
		    	if ( req.url.match(/[.]+[\w]+$/i) ) {
		    		// request to a file with any extension
		    		res.statusCode = 404;
		            res.end();
		    	} else {
		            // default fallback config
		            fs.createReadStream(fallbackFile).pipe(res);
		        }
		    },
	    }));
});

gulp.task('scripts',['core','libs']);

gulp.task('build',['clean'], function () {
    gulp.start(['docs','scripts', 'styles', 'fonts', 'imagemin']);
});

gulp.task('default', ['build','watch','serve']);