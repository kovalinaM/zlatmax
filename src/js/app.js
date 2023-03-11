// Включить/выключить FLS (Full Logging System) (в работе)
window['FLS'] = true;

import * as flsFunctions from "./modules/functions.js";
import * as flsForms from "./files/forms/forms.js";


flsFunctions.menuInit();
flsFunctions.spollers();
flsFunctions.initPopups();
flsFunctions.tabs();

flsForms.formRating();
flsForms.formSubmit(true);
flsForms.formFieldsInit();
flsForms.formSelect(false);
flsForms.formQuantity();

import "./libs/dynamic_adapt.js";
import "./files/script.js";
import "./files/sliders.js";
import "./files/tippy.js";
import "./files/forms/range.js";

