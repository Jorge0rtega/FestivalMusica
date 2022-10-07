const{src, dest, watch, parallel}=require('gulp');//para usar gulp (mas práctico)
//CSS
const sass=require('gulp-sass')(require('sass'));//para conectar sass con gulp y convertirlo a css
const plumber=require('gulp-plumber');//para que cada que tengamos un error no se pare
const autoprefixer=require('autoprefixer');
const cssnano=require('cssnano');
const postcss=require('gulp-postcss');
const sourcemaps=require('gulp-sourcemaps');

//Imagenes
const cache= require('gulp-cache')
const imagemin= require('gulp-imagemin');
const avif= require('gulp-avif');
const webp= require('gulp-webp');

//javascript
const terser= require('gulp-terser-js');


function css(done){
    src("src/scss/**/*.scss")//indentificar el archivo sass
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())//compilarlo
    .pipe(postcss([autoprefixer( ), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css"))//alamcenarla en el disco duro
    done();//callback avisa a gulp cuando lleguemos al final
}

function imagenes(done){
    const opciones={
        optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {
    const opciones={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}

function versionAvif(done) {
    const opciones={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}
function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))
    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css);//cada vez que detecte un cambio se vuleva a correr css
    watch("src/js/**/*.js", javascript)
    done();
}
exports.css=css;
exports.imagenes=imagenes;
exports.js=javascript;
exports.versionAvif=versionAvif;
exports.versionWebp=versionWebp; 
exports.dev=parallel(imagenes,versionAvif,versionWebp,javascript,dev);