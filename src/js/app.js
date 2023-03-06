// Включить/выключить FLS (Full Logging System) (в работе)
window['FLS'] = true;

import * as flsFunctions from "./modules/functions.js";
import * as flsForms from "./files/forms/forms.js";


flsFunctions.menuInit();
flsFunctions.spollers();
flsFunctions.initPopups();
flsForms.formRating();

import "./libs/dynamic_adapt.js";
import "./files/script.js";
import "./files/sliders.js";
import "./files/tippy.js";


