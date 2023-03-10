/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
// import Swiper, { Navigation, Pagination } from 'swiper';
import Swiper, { Navigation, Pagination, Parallax, Autoplay, Thumbs } from 'swiper';
/*
Основные модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
*/

// Стили Swiper
// Базовые стили
// import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';
function buildSliders(){
	let sliders = document.querySelectorAll('[class*="__swiper"]:not(.swiper-wrapper)');
	if (sliders) {
		sliders.forEach(slider => {
			slider.parentElement.classList.add('swiper');
			slider.classList.add('swiper-wrapper');
			for (const slide of slider.children) {
				slide.classList.add('swiper-slide');
			}
		});
	}
}
// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	buildSliders();

	if (document.querySelector('.main-block__slider')) {

		new Swiper('.main-block__slider', { 
			modules: [Navigation,Pagination, Parallax, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			parallax: true,
			speed: 1000,
			loop: true,
			//preloadImages: false,
			//lazy: true,


			// Эффекты
			//effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},

			pagination: {
				el: '.contoll-main-block__dotts',
				clickable: true,
			},

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "влево/вправо"
			// navigation: {
			// 	prevEl: '.swiper-button-prev',
			// 	nextEl: '.swiper-button-next',
			// },

			// Брейкпоинты
			/*
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/
			// События
			on: {
				init: function(swiper) {
					const allSlides = document.querySelector('.fraction-contoll__all');
					allSlides.innerHTML = swiper.slides.length < 10 ? `0${swiper.slides.length}` : swiper.slides.length;
				},
				slideChange: function(swiper) {
					const currentSlide = document.querySelector('.fraction-contoll__current');
					currentSlide.innerHTML = swiper.realIndex + 1 < 10 ? `0${swiper.realIndex + 1}` : swiper.realIndex + 1;
				}
			}
		});
	}

	if (document.querySelector('.products-slider__slider')) { 

		new Swiper('.products-slider__slider', { 
			modules: [Navigation,Pagination, Autoplay],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 30,
			speed: 1000,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},


			loop: true,
			pagination: {
				el: '.products-slider__dotts',
				clickable: true,
			},

			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
				},
				609: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1370: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			
		});
	}
	if (document.querySelector('.products-new__slider')) { 

		new Swiper('.products-new__slider', { 
			modules: [Navigation,Pagination, Autoplay],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 30,
			// autoHeight: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},


			loop: true,
			pagination: {
				el: '.products-slider__dotts',
				clickable: true,
			},

			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 10,
				},
				609: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1370: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},
			
		});
	}
	if (document.querySelector('.thumbs-images')) { 
		const thumbsSwiper = new Swiper('.thumbs-images', { 
			modules: [Navigation,Pagination, Autoplay, Thumbs],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 30,
			// autoHeight: true,
			speed: 1000,
			loop: true,
			pagination: {
				el: '.products-slider__dotts',
				clickable: true,
			},

			breakpoints: {
				320: {
					slidesPerView: 3,
					spaceBetween: 10,
				},
				609: {
					slidesPerView: 3,
					spaceBetween: 16,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 16,
				},
				1370: {
					slidesPerView: 4,
					spaceBetween: 16,
				},
			},
			
		});
		new Swiper('.images-product__slider', { 
			modules: [Navigation,Pagination, Autoplay, Thumbs],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 30,
			// autoHeight: true,
			speed: 1000,
			thumbs: {
				swiper: thumbsSwiper
			},
		});
	}
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});