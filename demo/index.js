"use strict";

import * as $ from '../dist/bundle';
import resources from "./assets.json";
import settings from "./settings.json"

const someDomElement =  document.body.querySelector('.someDiv'); // 26 May 2021

const cloud = new $.App(someDomElement, resources, settings);

window.cloud = cloud;

cloud.init();

