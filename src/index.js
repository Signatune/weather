import { format } from "date-fns";
import * as weatherAPI from "./weather-api";
import "./style.css";

const fetchButton = document.getElementById("fetch");

function getCityValue() {
  return document.getElementById("city").value;
}

function updateCurrentDisplay(currentWeather) {
  const current = document.querySelector(".current");
  const date = current.querySelector(".date>h3");
  const currentTemp = current.querySelector(".temperature>.current");
  const conditionImg = current.querySelector(".condition>img");
  const conditionText = current.querySelector(".condition>p");
  const precip = current.querySelector(".precipitation");

  date.textContent = format(currentWeather.date, "PPP");
  currentTemp.textContent = `${currentWeather.currentTemp}° F`;
  conditionImg.src = currentWeather.icon;
  conditionText.textContent = currentWeather.text;
  precip.textContent = `${currentWeather.precip} inches precipitation`;
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
  hiTemp.textContent = dayInfo.high;
  lowTemp.textContent = dayInfo.low;
  conditionIcon.src = dayInfo.condition.icon;
  conditionText.textContent = dayInfo.condition.text;
  rainChance.textContent = dayInfo.rainChance;

  return clone;
}

function handleWeatherFetch(forecastJSON) {
  const current = weatherAPI.parseCurrentWeather(forecastJSON);
  const forecast = weatherAPI.parseForecast(forecastJSON);
  const upcoming = document.querySelector(".upcoming>.days");
  updateCurrentDisplay(current);
  upcoming.replaceChildren(
    ...forecast.map((dayInfo) => createForecastDay(dayInfo)),
  );
}

fetchButton.addEventListener("click", () => {
  weatherAPI.fetchForecast(getCityValue(), 7).then(handleWeatherFetch);
});
