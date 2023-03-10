// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { flsModules } from "../modules.js";
// Вспомогательные функции
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../../modules/functions.js";
// Модуль прокрутки к блоку
// import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================


// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false }) {
	// Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
	const formFields = document.querySelectorAll('input[placeholder],textarea[placeholder]');
	if (formFields.length) {
		formFields.forEach(formField => {
			if (!formField.hasAttribute('data-placeholder-nohide')) {
				formField.dataset.placeholder = formField.placeholder;
			}
		});
	}
	document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = '';
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
			}
			formValidate.removeError(targetElement);
		}
	});
	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = targetElement.dataset.placeholder;
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
			}
			// Моментальная валидация
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.validateInput(targetElement);
			}
		}
	});

	// Если включено, добавляем функционал "Показать пароль"
	if (options.viewPass) {
		document.addEventListener("click", function (e) {
			let targetElement = e.target;
			if (targetElement.closest('[class*="__viewpass"]')) {
				let inputType = targetElement.classList.contains('_viewpass-active') ? "password" : "text";
				targetElement.parentElement.querySelector('input').setAttribute("type", inputType);
				targetElement.classList.toggle('_viewpass-active');
			}
		});
	}
}
// Валидация форм
export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		formRequiredItem.parentElement.classList.add('_form-error');
		let inputError = formRequiredItem.parentElement.querySelector('.form__error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		if (formRequiredItem.parentElement.querySelector('.form__error')) {
			formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
		}
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (flsModules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						flsModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
}
/* Отправка форм */
export function formSubmit(options = { validate: true }) {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
		if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) { // Если режим ajax
				e.preventDefault();
				const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
				const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					formSent(form, responseResult);
				} else {
					alert("Ошибка");
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {	// Если режим разработки
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			const formError = form.querySelector('._form-error');
			if (formError && form.hasAttribute('data-goto-error')) {
				gotoBlock(formError, true, 1000);
			}
		}
	}
	// Действия после отправки формы
	function formSent(form, responseResult = ``) {
		// Создаем событие отправки формы
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form: form
			}
		}));
		// Показываем попап, если подключен модуль попапов 
		// и для формы указана настройка
		setTimeout(() => {
			if (flsModules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? flsModules.popup.open(popup) : null;
			}
		}, 0);
		// Очищаем форму
		formValidate.formClean(form);
		// Сообщаем в консоль
		formLogging(`Форма отправлена!`);
	}
	function formLogging(message) {
		FLS(`[Формы]: ${message}`);
	}
}
/* Модуль формы "количество" */
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (targetElement.closest('.quantity__button')) {
			let value = parseInt(targetElement.closest('.quantity').querySelector('input').value);
			if (targetElement.classList.contains('quantity__button_plus')) {
				value++;
			} else {
				--value;
				if (value < 1) value = 1;
			}
			targetElement.closest('.quantity').querySelector('input').value = value;
		}
	});
}
/* Модуль звездного рейтинга */
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		let ratingActive, ratingValue;
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Инициализируем конкретный рейтинг
		function initRating(rating) {
			initRatingVars(rating);
			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Инициализайция переменных
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Изменяем ширину активных звезд
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Возможность указать оценку 
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Обновление переменных
					initRatingVars(rating);
					// Обновление активных звезд
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Обновление активных звезд
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Обновление переменных
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Отправить" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Отобразить указанную оцнку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Отправика данных (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Получаем новый рейтинг
					const newRating = result.newRating;

					// Вывод нового среднего результата
					ratingValue.innerHTML = newRating;

					// Обновление активных звезд
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Ошибка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}

//Select
export function formSelect(){
	let selects = document.getElementsByTagName('select');
	if (selects.length > 0) {
		selects_init();
	}
	function selects_init() {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_init(select);
		}
		//select_callback();
		document.addEventListener('click', function (e) {
			selects_close(e);
		});
		document.addEventListener('keydown', function (e) {
			if (e.code === 'Escape') {
				selects_close(e);
			}
		});
	}
	function selects_close(e) {
		const selects = document.querySelectorAll('.select');
		if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
	}
	function select_init(select) {
		const select_parent = select.parentElement;
		const select_modifikator = select.getAttribute('class');
		const select_selected_option = select.querySelector('option:checked');
		select.setAttribute('data-default', select_selected_option.value);
		select.style.display = 'none';

		select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

		let new_select = select.parentElement.querySelector('.select');
		new_select.appendChild(select);
		select_item(select);
	}
	function select_item(select) {
		const select_parent = select.parentElement;
		const select_items = select_parent.querySelector('.select__item');
		const select_options = select.querySelectorAll('option');
		const select_selected_option = select.querySelector('option:checked');
		const select_selected_text = select_selected_option.text;
		const select_type = select.getAttribute('data-type');

		if (select_items) {
			select_items.remove();
		}

		let select_type_content = '';
		if (select_type == 'input') {
			select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
		} else {
			select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
		}

		select_parent.insertAdjacentHTML('beforeend',
			'<div class="select__item">' +
			'<div class="select__title">' + select_type_content + '</div>' +
			'<div hidden class="select__options">' + select_get_options(select_options) + '</div>' +
			'</div></div>');

		select_actions(select, select_parent);
	}
	function select_actions(original, select) {
		const select_item = select.querySelector('.select__item');
		const selectTitle = select.querySelector('.select__title');
		const select_body_options = select.querySelector('.select__options');
		const select_options = select.querySelectorAll('.select__option');
		const select_type = original.getAttribute('data-type');
		const select_input = select.querySelector('.select__input');

		selectTitle.addEventListener('click', function (e) {
			selectItemActions();
		});

		function selectMultiItems() {
			let selectedOptions = select.querySelectorAll('.select__option');
			let originalOptions = original.querySelectorAll('option');
			let selectedOptionsText = [];
			for (let index = 0; index < selectedOptions.length; index++) {
				const selectedOption = selectedOptions[index];
				originalOptions[index].removeAttribute('selected');
				if (selectedOption.classList.contains('_selected')) {
					const selectOptionText = selectedOption.innerHTML;
					selectedOptionsText.push(selectOptionText);
					originalOptions[index].setAttribute('selected', 'selected');
				}
			}
			select.querySelector('.select__value').innerHTML = '<span>' + selectedOptionsText + '</span>';
		}
		function selectItemActions(type) {
			if (!type) {
				let selects = document.querySelectorAll('.select');
				for (let index = 0; index < selects.length; index++) {
					const select = selects[index];
					const select_body_options = select.querySelector('.select__options');
					if (select != select_item.closest('.select')) {
						select.classList.remove('_active');
						_slideUp(select_body_options, 100);
					}
				}
				_slideToggle(select_body_options, 100);
				select.classList.toggle('_active');
			}
		}
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.getAttribute('data-value');
			const select_option_text = select_option.innerHTML;

			if (select_type == 'input') {
				select_input.addEventListener('keyup', select_search);
			} else {
				if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
					select_option.style.display = 'none';
				}
			}
			select_option.addEventListener('click', function () {
				for (let index = 0; index < select_options.length; index++) {
					const el = select_options[index];
					el.style.display = 'block';
				}
				if (select_type == 'input') {
					select_input.value = select_option_text;
					original.value = select_option_value;
				} else {
					if (original.hasAttribute('multiple')) {
						select_option.classList.toggle('_selected');
						selectMultiItems();
					} else {
						select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
						original.value = select_option_value;
						select_option.style.display = 'none';
					}
				}
				let type;
				if (original.hasAttribute('multiple')) {
					type = 'multiple';
				}
				selectItemActions(type);
			});
		}
	}
	function select_get_options(select_options) {
		if (select_options) {
			let select_options_content = '';
			for (let index = 0; index < select_options.length; index++) {
				const select_option = select_options[index];
				const select_option_value = select_option.value;
				if (select_option_value != '') {
					const select_option_text = select_option.innerHTML;
					select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
				}
			}
			return select_options_content;
		}
	}
	function select_search(e) {
		let select_block = e.target.closest('.select ').querySelector('.select__options');
		let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
		let select_search_text = e.target.value.toUpperCase();

		for (let i = 0; i < select_options.length; i++) {
			let select_option = select_options[i];
			let select_txt_value = select_option.textContent || select_option.innerText;
			if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
				select_option.style.display = "";
			} else {
				select_option.style.display = "none";
			}
		}
	}
	function selects_update_all() {
		let selects = document.querySelectorAll('select');
		if (selects) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				select_item(select);
			}
		}
	}

	
}