javascript: (function () {
	'use strict';
	var i,
	pageHostname = window.top.location.hostname,
	divContainer = document.getElementById('all-page-links-container'),
	divLists = document.getElementById('all-page-links'),
	closeButton = 0,
	punycode = new function Punycode() {
		this.utf16 = {
			decode: function (input) {
				var output = [],
				i = 0,
				len = input.length,
				value,
				extra;
				while (i < len) {
					value = input.charCodeAt(i++);
					if ((value & 0xF800) === 0xD800) {
						extra = input.charCodeAt(i++);
						if (((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00)) {
							throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
						}
						value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
					}
					output.push(value);
				}
				return output;
			},
			encode: function (input) {
				var output = [],
				i = 0,
				len = input.length,
				value;
				while (i < len) {
					value = input[i++];
					if ((value & 0xF800) === 0xD800) {
						throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
					}
					if (value > 0xFFFF) {
						value -= 0x10000;
						output.push(String.fromCharCode(((value >>> 10) & 0x3FF) | 0xD800));
						value = 0xDC00 | (value & 0x3FF);
					}
					output.push(String.fromCharCode(value));
				}
				return output.join("");
			}
		};
		var initial_n = 0x80;
		var initial_bias = 72;
		var delimiter = "\x2D";
		var base = 36;
		var damp = 700;
		var tmin = 1;
		var tmax = 26;
		var skew = 38;
		var maxint = 0x7FFFFFFF;
		function decode_digit(cp) {
			return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
		}
		function adapt(delta, numpoints, firsttime) {
			var k;
			delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
			delta += Math.floor(delta / numpoints);
			for (k = 0; delta > (((base - tmin) * tmax) >> 1); k += base) {
				delta = Math.floor(delta / (base - tmin));
			}
			return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
		}
		this.decode = function (input, preserveCase) {
			var output = [];
			var case_flags = [];
			var input_length = input.length;
			var n,
			out,
			i,
			bias,
			basic,
			j,
			ic,
			oldi,
			w,
			k,
			digit,
			t,
			len;
			n = initial_n;
			i = 0;
			bias = initial_bias;
			basic = input.lastIndexOf(delimiter);
			if (basic < 0)
				basic = 0;
			for (j = 0; j < basic; ++j) {
				if (preserveCase)
					case_flags[output.length] = (input.charCodeAt(j) - 65 < 26);
				if (input.charCodeAt(j) >= 0x80) {
					throw new RangeError("Illegal input >= 0x80");
				}
				output.push(input.charCodeAt(j));
			}
			for (ic = basic > 0 ? basic + 1 : 0; ic < input_length; ) {
				for (oldi = i, w = 1, k = base; ; k += base) {
					if (ic >= input_length) {
						throw RangeError("punycode_bad_input(1)");
					}
					digit = decode_digit(input.charCodeAt(ic++));
					if (digit >= base) {
						throw RangeError("punycode_bad_input(2)");
					}
					if (digit > Math.floor((maxint - i) / w)) {
						throw RangeError("punycode_overflow(1)");
					}
					i += digit * w;
					t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
					if (digit < t) {
						break;
					}
					if (w > Math.floor(maxint / (base - t))) {
						throw RangeError("punycode_overflow(2)");
					}
					w *= (base - t);
				}
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi === 0);
				if (Math.floor(i / out) > maxint - n) {
					throw RangeError("punycode_overflow(3)");
				}
				n += Math.floor(i / out);
				i %= out;
				if (preserveCase) {
					case_flags.splice(i, 0, input.charCodeAt(ic - 1) - 65 < 26);
				}
				output.splice(i, 0, n);
				i++;
			}
			if (preserveCase) {
				for (i = 0, len = output.length; i < len; i++) {
					if (case_flags[i]) {
						output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
					}
				}
			}
			return this.utf16.encode(output);
		};
		this.ToUnicode = function (domain) {
			var domain_array = domain.split(".");
			var out = [];
			for (var i = 0; i < domain_array.length; ++i) {
				var s = domain_array[i];
				out.push(s.match(/^xn--/) ? punycode.decode(s.slice(4)) : s);
			}
			return out.join(".");
		};
	}
	();
	function infoBlock() {
		document.getElementById('asl-info-b').removeEventListener('click', infoBlock);
		var divInfo = document.createElement('div');
		divInfo.setAttribute('id', 'all-page-links-info');
		divInfo.innerHTML = '<div>Bookmarklet "<a href="https://github.com/Eric-Draven/bookmarklets/tree/master/all-page-links" class="js-bold" title="Домашняя страница" target="_blank">All Page Links</a>" v0.9.4 by Eric Draven' + '<div class="js-it">Для пользователей системы продвижения сайтов - userator.ru</div></div>' + '<ul class="js-brdrs"><li><span class="js-bold">Целевые ссылки</span> - список содержит ссылки, отобранные по ключевым словам: <span class="js-bold js-it">контакты, связь, регистрация, корзина, цены, услуги</span> в анкорах и сегментах URL. Внимание! Нет гарантии, что ссылки направят на страницы, нужные для работы.</li>' + '<li><span class="js-bold">Внутренние ссылки</span> - список всех ссылок на данной странице, направляющих на другие страницы данного сайта.</li>' + '<li><span class="js-bold">Внутренние якорные ссылки</span> - эти ссылки помогут направить посетителей, как в определённую часть отдельной страницы сайта, так и в определённую часть текущей страницы, где был добавлен якорь. Существует немало сайтов, весь контент которых размещён на единственной странице и все ссылки на ней являются якорными.</li>' + '<li><span class="js-bold">Внутренние ссылки на файлы</span> - только кликабельные ссылки на следующие типы файлов: <span class="js-bold js-it">.exe, .js, .pdf, .fb2, .epub, .mobi, .txt, .rtf, .doc, .xls, .ppt, .mp3, .mp4, .flv, .swf, .zip, .rar, .7z, .gz, .jpg, .jpeg, .png, .gif, .bmp</span>.</li>' + '<li><span class="js-bold">Поддомены и внешние ссылки</span> - ссылки на поддомены данного домена и на другие сайты.</li></ul>' + '<div class="js-bold">Примечания</div>' + '<ul class="js-brdrs"><li>Ссылки во всём списке и в каждом отдельном списке не повторяются, но:' + '<ul><li>ссылки <span class="js-bold">http://site.ru</span> и <span class="js-bold">https://site.ru</span> - не считаются дубликатами и обе попадут в один из списков если обе присутствуют на странице.</li>' + '<li>ссылки <span class="js-bold">www.site.ru</span> и <span class="js-bold">site.ru</span> - не считаются дубликатами только для списка "<span class="js-bold">Поддомены и внешние ссылки</span>" и обе попадут в этот список если обе присутствуют на странице.</li></ul>' + '<li>Ссылки с символом "&#9660;" открываются в текущей вкладке, остальные в новой вкладке.</li>' + '<li>Ссылки на страницы, присутствующие в истории посещённых страниц браузера, подсвечиваются тёмно-зелёным цветом.</li></ul>';
		divLists.insertBefore(divInfo, divLists.firstChild);
		document.getElementById('asl-info-b').setAttribute('class', 'st-red');
		document.getElementById('asl-info-b').addEventListener('click', function () {
			divInfo.parentNode.removeChild(divInfo);
			document.getElementById('asl-info-b').removeAttribute('class', 'st-red');
			document.getElementById('asl-info-b').addEventListener('click', infoBlock);
		});
	}
	function placeToDiv(x, y, z, num) {
		if (x.length > 0) {
			i = x.filter(function (item, index) {
					return x.indexOf(item) == index;
				});
			x = i.sort();
			if (closeButton === 0) {
				divLists = document.getElementById('all-page-links');
				divLists.innerHTML = '<div class="js-title js-clr"><span class="js-float-l js-bold">' + z + ' ( ' + i.length + ' )</span><span class="js-float-r"><span id="asl-info-b" title="О букмарклете">Информация</span> / <span id="asl-close-b-' + num + '" class="asl-close-b" title="Скрыть все списки">Скрыть</span></span></div>';
				document.getElementById('asl-info-b').addEventListener('click', infoBlock);
				document.getElementById('asl-close-b-' + num).addEventListener('click', closeList);
				closeButton = 1;
			} else {
				var divButtons = document.createElement('div');
				divButtons.setAttribute('class', 'js-title');
				divButtons.innerHTML = '<div class="js-clr"><span class="js-float-l js-bold">' + z + ' ( ' + i.length + ' )</span><span class="js-float-r"><span id="asl-close-b-' + num + '" class="asl-close-b" title="Скрыть все списки">Скрыть</span></div>';
				divLists.appendChild(divButtons);
				document.getElementById('asl-close-b-' + num).addEventListener('click', closeList);
			}
			var divLinks = document.createElement('div');
			divLinks.id = 'all-page-links-list';
			divLists.appendChild(divLinks);
			for (i in x) {
				try {
					var oneLink = x[i].trim(),
					listLinks = document.createElement('div');
					listLinks.setAttribute('class', 'js-link-line js-clr');
					listLinks.innerHTML = '<div class="js-float-l js-w92"><a class="' + y + '" target="_blank" href=' + oneLink + '>' + oneLink + '</a></div><div class="js-float-l js-w8"><div class="js-parent-link"><a target="_parent" href=' + oneLink + '>&#9660;</a></div></div>';
					divLinks.appendChild(listLinks);
				} catch (err) {}
			}
		}
	}
	function closeList() {
		divContainer.parentNode.removeChild(divContainer);
	}
	function decodeChar(s) {
		s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/gi, function (code, hex1, hex2, hex3) {
				var n1 = parseInt(hex1, 16) - 0xE0;
				var n2 = parseInt(hex2, 16) - 0x80;
				if (n1 === 0 && n2 < 32)
					return code;
				var n3 = parseInt(hex3, 16) - 0x80;
				var n = (n1 << 12) + (n2 << 6) + n3;
				if (n > 0xFFFF)
					return code;
				return String.fromCharCode(n);
			});
		s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/gi, function (code, hex1, hex2) {
				var n1 = parseInt(hex1, 16) - 0xC0;
				if (n1 < 2)
					return code;
				var n2 = parseInt(hex2, 16) - 0x80;
				return String.fromCharCode((n1 << 6) + n2);
			});
		s = s.replace(/%([0-7][0-9A-F])/gi, function (code, hex) {
				return String.fromCharCode(parseInt(hex, 16));
			});
		return s;
	}
	function Win1251ToDOMString(s) {
		var i,
		hex,
		decodeMap = {},
		win1251 = new TextDecoder('windows-1251');
		for (i = 0x00; i < 0xFF; i++) {
			hex = (i <= 0x0F ? '0' : '') + i.toString(16).toUpperCase();
			decodeMap[hex] = win1251.decode(Uint8Array.from([i]));
		}
		return s.replace(/%([0-9A-F]{2})/g, (match, hex) => decodeMap[hex]);
	}
	function addStyle(css) {
		var head = document.getElementsByTagName('head')[0];
		if (!head) {
			return;
		}
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	if (divContainer) {
		closeList();
	} else {
		window.scrollTo(0, 0);
		addStyle('#all-page-links-container, #all-page-links, #all-page-links div, #all-page-links span, #all-page-links ul, #all-page-links ul li, #all-page-links a{margin:0;padding:0;border:0;text-align:left;font:normal 400 13px/20px arial,sans-serif !important;text-decoration:none !important;text-transform:none !important;vertical-align:baseline;direction:ltr;}' + '#all-page-links-container{padding:8px 0 !important;height:auto;color:#444;background:#fff;position:absolute;left:14px;top:14px;min-width:360px;width:50%;z-index:2147483647;-moz-box-shadow:0 12px 16px rgba(0,0,0,0.4);-webkit-box-shadow:0 12px 16px rgba(0,0,0,0.4);box-shadow:0 12px 16px rgba(0,0,0,0.4);}' + '#all-page-links{padding:0 8px !important;height:100%;overflow:auto;}' + '#all-page-links-info, .js-title{margin-left:8px !important;padding:6px 0 4px 0 !important;}' + '#all-page-links-info a{color:#237700;}' + '#all-page-links-info ul.js-brdrs{margin:8px 0;padding:6px 0;border-top:1px solid #bbb;border-bottom:1px solid #bbb;}' + '#all-page-links-info ul li{list-style:circle outside;margin-left:16px;}' + '#all-page-links-list .js-w92 a{padding:1px 4px 1px 8px;}' + '#all-page-links-list .js-w8 a{margin-left:1px;height:100%;text-align:center;}' + '#all-page-links-list a{background:#444 !important;color:#fff !important;display:block;word-break:break-all;}' + '#all-page-links-list a:visited{background:#3d5236 !important;}' + '#all-page-links-list a:hover{background:#333 !important;color:#fff !important;}' + '#all-page-links #asl-info-b, #all-page-links .asl-close-b{font-weight:700 !important;cursor:pointer;}' + '#all-page-links-info a:hover, #asl-info-b:hover, .asl-close-b:hover, .st-red{color:#ca0000 !important;}' + '#all-page-links .js-bold{font-weight:700 !important;}' + '#all-page-links .js-it{font-style:italic !important;}' + '.js-link-line{margin:0 0 1px 0 !important;width:100%;position:relative;}' + '.js-float-l{float:left;}' + '.js-float-r{float:right;}' + '.js-w92{width:92%;}' + '.js-w8{width:8%;}' + '.js-parent-link{width:inherit !important;height:100%;position:absolute;}' + '.js-clr:before, .js-clr:after{content:"";display:table;}' + '.js-clr:after{clear:both;}' + '.js-clr{zoom:1;}' + '.targetLink{border-left:8px solid #009cff !important;}' + '.internalLink{border-left:8px solid #ffe000 !important;}' + '.anchorLink{border-left:8px solid #ffa900 !important;}' + '.fileLink{border-left:8px solid #ff00ba !important;}' + '.externalLink{border-left:8px solid #888 !important;}');
		divContainer = document.createElement('div');
		divContainer.id = 'all-page-links-container';
		divContainer.innerHTML = '<div id="all-page-links"></div>';
		document.getElementsByTagName('body')[0].appendChild(divContainer);
		var allPageLinks = document.links,
		words = /support|feedback|registr|register|contact|kontact|contakt|kontakt|signin|signup|price|prace|prase|tseny|ceni|cart|korzina|corzina|uslugi|контакт|связь|регистрация|корзина|цены|услуг|товар|прайс|кординаты|поддержка/i,
		extension = /exe|js|pdf|fb2|epub|mobi|txt|rtf|doc|xls|ppt|mp3|mp4|flv|swf|zip|rar|7z|gz|jpg|jpeg|png|gif|bmp/i,
		targetLinks = [],
		targetAnchorLinks = [],
		internalLinks = [],
		anchorLinks = [],
		fileLinks = [],
		externalLinks = [];
		for (i = 0; i < allPageLinks.length; i++) {
			var oneOfArray = allPageLinks[i],
			linkProtocol = oneOfArray.protocol,
			linkHostname = oneOfArray.hostname,
			linkPathname = oneOfArray.pathname,
			linkSearch = oneOfArray.search,
			l1 = oneOfArray.toString(),
			l2 = oneOfArray.innerText,
			l3 = oneOfArray.innerHTML;
			if (pageHostname.replace('www.', '') === linkHostname.replace('www.', '') && pageHostname.indexOf('www.') == -1 && linkHostname.indexOf('www.') >= 0) {
				linkHostname = linkHostname.replace('www.', '');
				l1 = l1.replace('www.', '');
			}
			var l4 = l1.replace(linkProtocol + '//' + linkHostname, '');
			if (l1.indexOf('%') >= 0) {
				l1 = decodeChar(l1);
			}
			if (l1.indexOf('%') >= 0) {
				l1 = Win1251ToDOMString(l1);
			}
			if (linkHostname.indexOf('xn--') === 0) {
				var decodedHost = punycode.ToUnicode(linkHostname);
				l1 = l1.replace(linkHostname, decodedHost);
			}
			if (l2 === undefined) {
				l2 = '';
			}
			if (linkProtocol.match(/http/i)) {
				if (linkHostname !== pageHostname) {
					externalLinks.push(l1);
				} else if (!linkPathname.match(/http/i) && !linkSearch.match(/http/i)) {
					if (l4.substr(-5, 5).indexOf('.') >= 0 && l4.substr(-5, 5).match(extension)) {
						fileLinks.push(l1);
					} else if (l2.match(words) || l3.match(words) || l4.match(words)) {
						if (l1.indexOf('#') === -1) {
							targetLinks.push(l1);
						} else if (anchorLinks.indexOf(l1) === -1) {
							targetAnchorLinks.push(l1);
						}
					} else if (l1.indexOf('#') !== -1 && targetAnchorLinks.indexOf(l1) === -1) {
						anchorLinks.push(l1);
					} else {
						internalLinks.push(l1);
					}
				}
			}
		}
		if ((targetLinks.length + internalLinks.length + anchorLinks.length + fileLinks.length + externalLinks.length) === 0) {
			divLists = document.getElementById('all-page-links');
			divLists.innerHTML = '<div class="js-title js-clr"><span class="js-float-l js-bold st-red">На странице нет полезных ссылок</span><span class="js-float-r"><span id="asl-info-b" title="О букмарклете">Информация</span> / <span id="asl-close-b" class="asl-close-b" title="Скрыть пустой список">Скрыть</span></span></div>';
			document.getElementById('asl-info-b').addEventListener('click', infoBlock);
			document.getElementById('asl-close-b').addEventListener('click', closeList);
		} else {
			placeToDiv(targetLinks, 'targetLink', 'Целевые ссылки', '1');
			placeToDiv(targetAnchorLinks, 'targetLink', 'Целевые якорные ссылки', '2');
			placeToDiv(internalLinks, 'internalLink', 'Внутренние ссылки', '3');
			placeToDiv(anchorLinks, 'anchorLink', 'Внутренние якорные ссылки', '4');
			placeToDiv(fileLinks, 'fileLink', 'Внутренние ссылки на файлы', '5');
			placeToDiv(externalLinks, 'externalLink', 'Поддомены и внешние ссылки', '6');
		}
		if (window.innerHeight < divContainer.offsetHeight) {
			addStyle('#all-page-links-container{height:' + Math.round(window.innerHeight * ".85") + 'px !important;}');
		}
	}
})();