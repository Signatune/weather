const API_KEY = "d85b258648704bfaab4182741232210";
const BASE_URL = "http://api.weatherapi.com/v1";

async function fetchForecast(city, days) {
  const forecast = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=yes&alerts=yes`,
  );

  return forecast.json();
}

function parseCurrentWeather(forecastJSON) {
  const currentData = forecastJSON.current;

  const date = new Date(currentData.last_updated);
  const currentTemp = {
    fahrenheit: Math.floor(currentData.temp_f),
    celsius: Math.floor(currentData.temp_c),
  };
  const { text, icon } = currentData.condition;
  const precip = currentData.precip_in;
  const { humidity, cloud } = currentData;

  return {
    date,
    currentTemp,
    text,
    icon,
    precip,
    humidity,
    cloud,
  };
}

function parseForecast(forecastJSON) {
  return forecastJSON.forecast.forecastday.slice(1).map((day) => {
    const dayData = day.day;
    return {
      date: new Date(day.date),
      high: {
        fahrenheit: Math.floor(dayData.maxtemp_f),
        celsius: Math.floor(dayData.maxtemp_c),
      },
      low: {
        fahrenheit: Math.floor(dayData.mintemp_f),
        celsius: Math.floor(dayData.mintemp_c),
      },
      condition: {
        icon: dayData.condition.icon,
        text: dayData.condition.text,
      },
      rainChance: dayData.daily_chance_of_rain,
    };
  });
}

export { fetchForecast, parseCurrentWeather, parseForecast };
