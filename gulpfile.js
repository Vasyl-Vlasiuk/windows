"use strict";

//! імпорт пакетів, які необхідні для сборки
const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

//! перемінна в якій лежить шлях куди ми все будемо кампілювати
const dist = "./dist/";
// const dist = "C:/wamp64/www/test";

//! задачі(таски), які допомагають збирати наш проект:
// відслідковує зміни, які ми вносимо в HTML файл
gulp.task("copy-html", () => {
  return gulp.src("./src/index.html")
    .pipe(gulp.dest(dist))             // переміщуємо в папку dist
    .pipe(browsersync.stream());       // запускаємо browsersync, аби сторінка перезавантажилася
});


//! кампіляція скриптів: режим розробки, режим продакшина
gulp.task("build-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'development',     // режим 
      output: {             
        filename: 'script.js'  // куди збирається проект
      },
      watch: false,
      devtool: "source-map",   // карта проекту - з яких кусків складаються скрипти
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"   // аналівує і підключає лише тіполіфіли, які необхідні у нашому проекті
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist))               // після закінчиння усіх операцій отриманий файл поміщаємо у папку dist
    .on("end", browsersync.reload);      // при наявності змін перезавантажуємо сторінку
});

gulp.task("copy-assets", () => {
  return gulp.src("./src/assets/**/*.*")  // беремо із папки assets любі файли
    .pipe(gulp.dest(dist + "/assets"))    // переміщуємо по конкретному адресу
    .on("end", browsersync.reload);       // перезавантажуємо сторінку
});

//! Таск watch, який всередині себе має окремий сервер і сервує файли, які знаходяться у папці dist
gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  // галп слідкує за змінами окремих файлів, і вразі їх зміни запускає команди: copy-html, copy-assets, build-js
  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js"));


//! Кампіляція продакшин з оптимізацією. Відсутність соурс мепів і дебагів
gulp.task("build-prod-js", () => {
  return gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist));
});

//! задача яка запускається по замовчуванню. Після пропису у терміналі gulp паралельно запускаються 2 задачі: "watch", "build"
gulp.task("default", gulp.parallel("watch", "build"));