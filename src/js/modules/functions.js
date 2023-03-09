"use strict"
//меню Бургер
export function menuInit() {
    let burger = document.querySelector(".icon-menu");
    let menuBody =  document.querySelector(".menu__body");
    let body = document.body;
    
    burger.addEventListener("click", open);

    function open(e) {
        e.preventDefault();

        burger.classList.toggle('menu-open');
        menuBody.classList.toggle('menu-open');
        body.classList.toggle('lock');
        if (document.documentElement.classList.contains('catalog-open')) {
            document.documentElement.classList.remove('catalog-open');
        }
        if (document.documentElement.classList.contains('sub-menu-open')) {
            document.documentElement.classList.remove('sub-menu-open');
        }
    }
}

/* Проверка мобильного браузера */
export let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
export function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
// Добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}
// Получение хеша в адресе сайта
export function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Указание хеша в адресе сайта
export function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}
// Учет плавающей панели на мобильных устройствах при 100vh
export function fullVHfix() {
	const fullScreens = document.querySelectorAll('[data-fullscreen]');
	if (fullScreens.length && isMobile.any()) {
		window.addEventListener('resize', fixHeight);
		function fixHeight() {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		fixHeight();
	}
}
/*=======Spollers=====================*/
export function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

    let _slideUp = (target, duration = 500) => {
        if (target.classList.contains("_slide")) return;
        target.classList.add("_slide");
    
        let style = target.style;
    
        style.transitionProperty = "height, margin, padding";
        style.transitionDuration = `${duration}ms`;
        style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
    
        style.overflow = "hidden";
    
        style.height = 0;
        style.paddingTop = 0;
        style.paddingBottom = 0;
        style.marginTop = 0;
        style.marginBottom = 0;
    
        setTimeout(() => {
            target.hidden = true;
            [
                "height",
                "padding-top",
                "padding-bottom",
                "margin-top",
                "margin-bottom",
                "overflow",
                "transition-duration",
                "transition-property",
            ].forEach(e => style.removeProperty(e));
            target.classList.remove("_slide");
        }, duration);
    };
    
    let _slideDown = (target, duration = 500) => {
        if (target.classList.contains("_slide")) return;
        target.classList.add("_slide");
    
        if (target.hidden) target.hidden = false;
    
        let style = target.style;
    
        let height = target.offsetHeight;
    
        style.overflow = "hidden";
    
        style.height = 0;
        style.paddingTop = 0;
        style.paddingBottom = 0;
        style.marginTop = 0;
        style.marginBottom = 0;
    
        target.offsetHeight;
    
        style.transitionProperty = "height, margin, padding";
        style.transitionDuration = `${duration}ms`;
        style.height = `${height}px`;
    
        [
            "padding-top",
            "padding-bottom",
            "margin-top",
            "margin-bottom",
        ].forEach(e => style.removeProperty(e));
    
        setTimeout(() => {
            [
                "height",
                "overflow",
                "transition-duration",
                "transition-property",
            ].forEach(e => style.removeProperty(e));
            target.classList.remove("_slide");
        }, duration);
    };
    
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration);
        _slideUp(target, duration);
    };
}

/*=======POPUPS=====================*/
export function initPopups() {
    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");
    
    let unlock = true;
    
    const timeout = 800;
    
    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index ++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function(e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }
    
    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index ++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function(e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }
    
    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }
    
    function popupClose(popupActive, doUnLock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnLock) {
                bodyUnLock();
            }
        }
    }
    
    
    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('lock');
    
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }
    
    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('lock');
        }, timeout);
    
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }
    
    document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive);
        }
    });
    
    
    (function () {
        //проверяем поддержку 
        if (!Element.prototype.closest) {
            //реализуем
            Element.prototype.closest = function (css) {
                var node = this;
                while (node) {
                    if (node.mathces(css)) return node;
                    else node = node.parentElement;
                }
                return null
            };
        }
    }) ();
    
    (function () {
        //проверяем поддержку 
        if (!Element.prototype.matches) {
            //определяем свойство
            Element.prototype.matches = Element.prototype.matchesSelector ||  
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
        }
    })();
}
//проверка поддержки webp, добавление класса webp или no-webp для HTML
export function isWeb() {
    //проверка поддрежки webp
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
        //добавление класс _webp или _no-webp для HTML
        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
        });
}

// FLS (Full Logging System)
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message);
		}
	}, 0);
}