# **All Page Links ( Bookmarklet ) v0.9.4** от **25.06.2017**

### **Получить код**
* [All Page Links ( Bookmarklet )](https://github.com/Eric-Draven/bookmarklets/raw/master/all-page-links/scripts/all-page-links-bookmarklet.txt) - _Чтобы начать пользоваться букмарклетом, создайте в браузере закладку с любым именем, а вместо ссылки, вставьте весь текст из открывшегося по ссылке файла._
* [All Page Links ( Кнопка для "Custom Buttons" )](https://github.com/Eric-Draven/bookmarklets/raw/master/all-page-links/scripts/all-page-links-custombutton.txt) - _Сперва установите расширение "**Custom Buttons**" для "**Mozilla Firefox**", после этого всё содержимое открывшегося по ссылке файла скопируйте в URL строку браузера и подтвердите переход по ссылке._
* [All Page Links ( Code для "Custom Buttons" )](https://github.com/Eric-Draven/bookmarklets/raw/master/all-page-links/scripts/all-page-links-custombutton-code.txt) - _Содержимое данного файла предназначено для обновления ранее установленной кнопки в разделе "**Code**" расширения "**Custom Buttons**"._
* [Исходный код](https://github.com/Eric-Draven/bookmarklets/blob/master/all-page-links/scripts/all-page-links-source-code.js) - _Исходный код букмарклета._

Расширение "**Custom Buttons**" для "**Mozilla Firefox**"
* [Custom Buttons v0.0.5.8.9](https://addons.mozilla.org/ru/firefox/addon/custom-buttons/) ( официальный сайт Mozilla )
* [Custom Buttons v0.0.5.8.9.3 signed fixed version](http://custombuttons.sourceforge.net/forum/viewtopic.php?f=5&t=3743) ( альтернативный источник ) - **рекомендуется**!

### **Описание**
_Букмарклет полезен в основном для пользователей системы продвижения сайтов - userator.ru_

Букмарклет создаёт список всех ссылок на странице сайта (только **HTTP**, **HTTPS**) и распределяет их по категориям:

* **Целевые ссылки** - список содержит ссылки, отобранные по ключевым словам: ***контакты, связь, регистрация, корзина, цены, услуги*** в анкорах и сегментах URL. Внимание! Нет гарантии, что ссылки направят на страницы, нужные для работы.
* **Внутренние ссылки** - список всех ссылок на данной странице, направляющих на другие страницы данного сайта.
* **Внутренние якорные ссылки** - эти ссылки помогут направить посетителей, как в определённую часть отдельной страницы сайта, так и в определённую часть текущей страницы, где был добавлен якорь. Существует немало сайтов, весь контент которых размещён на единственной странице и все ссылки на ней являются якорными.
* **Внутренние ссылки на файлы** - только кликабельные ссылки на следующие типы файлов: ***.exe, .js, .pdf, .fb2, .epub, .mobi, .txt, .rtf, .doc, .xls, .ppt, .mp3, .mp4, .flv, .swf, .zip, .rar, .7z, .gz, .jpg, .jpeg, .png, .gif, .bmp.***
* **Поддомены и внешние ссылки** - ссылки на поддомены данного домена и на другие сайты.

### **Примечания**
* Ссылки во всём списке и в каждом отдельном списке не повторяются, но:
  * ссылки [http://site.ru](http://site.ru "Протокол ''HTTP''") и [https://site.ru](https://site.ru "Протокол ''HTTPS''") - не считаются дубликатами и обе попадут в один из списков если обе присутствуют на странице.
  * ссылки [www.site.ru](http://www.site.ru "Ссылка с ''WWW''") и [site.ru](http://site.ru "Ссылка без ''WWW''") - не считаются дубликатами только для списка "**Поддомены и внешние ссылки**" и обе попадут в этот список если обе присутствуют на странице.
* Ссылки с символом "▼" открываются в текущей вкладке, остальные в новой вкладке.
* Ссылки на страницы, которые посещались ранее, подсвечиваются тёмно-зелёным цветом.
* Букмарклет также умеет в URL:
  * декодировать кириллические домены: **xn--80aswg.xn--p1ai** >>> **сайт.рф**
  * декодировать текст в кодировке **UTF-8**: **%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80** >>> **пример**
  * декодировать текст в кодировке **CP-1251**: **%EF%F0%E8%EC%E5%F0** >>> **пример**
* Работоспособность проверена в браузерах:
  * **Firefox v24, 53-54** ( _Bookmarklet_, _Custom Buttons_ )
  * **Chrome v59** ( _Bookmarklet_ )
  * **Яндекс.Браузер v17** ( _Bookmarklet_ )
  * **Opera v45-46** ( _Bookmarklet_ )
  * В браузерах **Internet Explorer** и **Opera v12** работать не будет!

### Скриншот
![Скриншот](https://github.com/Eric-Draven/bookmarklets/raw/master/all-page-links/images/example.png)
---
[Все работы автора](https://github.com/Eric-Draven?tab=repositories) / [Bookmarklets](https://github.com/Eric-Draven/bookmarklets)
