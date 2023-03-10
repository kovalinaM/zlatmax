// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение стилей из scss/base/forms/range.scss 
// в файле scss/forms/forms.scss

// Подключение cтилей из node_modules
// import 'nouislider/dist/nouislider.css';

export function rangeInit()  {
	const rangeItems = document.querySelectorAll('[data-range]');
	if (rangeItems.length) {
		rangeItems.forEach((rangeItem) => {
			const valueFrom = rangeItem.querySelector('[data-range-from]');
			const valueTo = rangeItem.querySelector('[data-range-to]');
			const item = rangeItem.querySelector('[data-range-item]');
			const inputs = [valueFrom, valueTo];
			const formatForSlider = {
				from: function (formattedValue) {
					return Number(formattedValue);
				},
				to: function (numericValue) {
					return Math.round(numericValue);
				},
			};

			noUiSlider.create(item, {
				start: [+valueFrom.value, +valueTo.value], // [0,200000]
				connect: true,
				format: formatForSlider,
				tooltips: true,
				range: {
					min: [+valueFrom.dataset.rangeFrom],
					max: [+valueTo.dataset.rangeTo],
				},
			});

			inputs.forEach(function (input, handle) {
				input.addEventListener('change', function () {
					item.noUiSlider.setHandle(handle, this.value);
				});
				input.addEventListener('keydown', function (e) {
					let values = item.noUiSlider.get();
					let value = Number(values[handle]);
					let steps = item.noUiSlider.steps();
					let step = steps[handle];
					let position;

					// 13 is enter,
					// 38 is key up,
					// 40 is key down.
					switch (e.which) {
						case 13:
							item.noUiSlider.setHandle(handle, this.value);
							break;

						case 38:
							position = step[1];
							if (position === false) {
								position = 1;
							}
							if (position !== null) {
								item.noUiSlider.setHandle(handle, value + position);
							}
							break;

						case 40:
							position = step[0];
							if (position === false) {
								position = 1;
							}
							if (position !== null) {
								item.noUiSlider.setHandle(handle, value - position);
							}
							break;
					}
				});
			});

			item.noUiSlider.on('update', function (values, handle) {
				inputs[handle].value = values[handle];
			});
		});
	}

}
rangeInit();
