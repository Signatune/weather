import { format } from "date-fns";
import * as weatherAPI from "./weather-api";
import "./style.css";

const fetchButton = document.getElementById("fetch");
const tempToggle = document.getElementById("temperature-toggle");
let weatherData = weatherAPI.fetchForecast("Boston", 7);
let displayFahrenheit = true;

function getCityValue() {
  return document.getElementById("city").value;
}

function addLoadingSpinner() {
  const current = document.querySelector("div.current>.forecast-display");
  const upcoming = document.querySelector(".upcoming>.days");

  const spinner = document.createElement("div");
  spinner.classList.add("lds-dual-ring");

  current.replaceChildren(spinner);
  upcoming.replaceChildren(spinner.cloneNode(true));
}

function createCurrentDisplay(currentWeather) {
  const template = document.querySelector("template.forecast-display");
  const newDisplay = template.content.cloneNode(true);

  const date = newDisplay.querySelector(".date>h3");
  const currentTemp = newDisplay.querySelector(".temperature>.current");
  const conditionImg = newDisplay.querySelector(".condition>img");
  const conditionText = newDisplay.querySelector(".condition>p");
  const precip = newDisplay.querySelector(".precipitation>p");
  const humidity = newDisplay.querySelector(".humidity>p");
  const cloud = newDisplay.querySelector(".cloud>p");

  date.textContent = format(currentWeather.date, "PPP");
  if (displayFahrenheit) {
    currentTemp.textContent = `${currentWeather.currentTemp.fahrenheit}° F`;
  } else {
    currentTemp.textContent = `${currentWeather.currentTemp.celsius}° C`;
  }
  conditionImg.src = currentWeather.icon;
  conditionText.textContent = currentWeather.text;
  precip.textContent = `${currentWeather.precip} inches precipitation`;
  humidity.textContent = `${currentWeather.humidity}% humidity`;
  cloud.textContent = `${currentWeather.cloud}% cloud cover today`;

  return newDisplay;
}

function createForecastDay(dayInfo) {
  const template = document.querySelector("template.forecast-day");
  const clone = template.content.cloneNode(true);

  const date = clone.querySelector("h3.date");
  const hiTemp = clone.querySelector(".temps>.high>span");
  const lowTemp = clone.querySelector(".temps>.low>span");
  const conditionIcon = clone.querySelector(".condition>img");
  const conditionText = clone.querySelector(".condition>p");
  const rainChance = clone.querySelector(".rainChance>span");

  date.textContent = format(dayInfo.date, "EEEE");
  if (displayFahrenheit) {
    hiTemp.textContent = `${dayInfo.high.fahrenheit}° F`;
    lowTemp.textContent = `${dayInfo.low.fahrenheit}° F`;
  } else {
    hiTemp.textContent = `${dayInfo.high.celsius}° C`;
    lowTemp.textContent = `${dayInfo.low.celsius}° C`;
  }
  conditionIcon.src = dayInfo.condition.icon;
  conditionText.textContent = dayInfo.condition.text;
  rainChance.textContent = dayInfo.rainChance;

  return clone;
}

function handleWeatherFetch(forecastJSON) {
  const currentData = weatherAPI.parseCurrentWeather(forecastJSON);
  const forecastData = weatherAPI.parseForecast(forecastJSON);
  const upcoming = document.querySelector(".upcoming>.days");
  const current = document.querySelector(".current");

  current.replaceChildren(createCurrentDisplay(currentData));

  upcoming.replaceChildren(
    ...forecastData.map((dayInfo) => createForecastDay(dayInfo)),
  );
}

weatherData.then(handleWeatherFetch);

fetchButton.addEventListener("click", () => {
  addLoadingSpinner();
  weatherData = weatherAPI.fetchForecast(getCityValue(), 7);
  weatherData.then(handleWeatherFetch);
});

tempToggle.addEventListener("click", () => {
  displayFahrenheit = !displayFahrenheit;
  weatherData.then(handleWeatherFetch);
});
