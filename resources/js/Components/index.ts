import Main from './Main';
import SearchPanel from './SearchPanel';
import CurrentWeather from './current-weather';
import { HourlyForecast, DailyForecast } from './weather-forecast';
import WindSpeedPanel from './wind-speed';
import DebugPanel from './debug-panel';

import { Accordion } from './accordion';
const Utils = {
  Accordion
};

import { Toggler } from './input';
const Input = {
  Toggler
};

import { RainEffect, SunFlareEffect, FogBackgroundEffect } from './effects';
const Effects = {
  RainEffect,
  SunFlareEffect,
  FogBackgroundEffect
};

export {
  Main,
  SearchPanel,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  WindSpeedPanel,
  DebugPanel,
  Utils,
  Input,
  Effects,
};
