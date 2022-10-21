async function getData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a9f93b7135b2be992f9874b23570b0c9&lang=${language}&units=${units}`,
      { mode: "cors" }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    hideEl(loader);
    display(mainCard);
    display(secondaryCard);
    load3HourData(createForecastObject(data));
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

function displayEl(el) {
  el.classList.add("show");
}

function display(el) {
  el.classList.remove("hidden");
}

function hideEl(el) {
  el.classList.remove("show");
}

const loader = document.getElementById("loading");
const btn = document.querySelector("button");
const input = document.querySelector("input");
const mainCard = document.getElementById("main-card");
const secondaryCard = document.getElementById("secondary-card");

input.addEventListener("input", () => {
  input.setCustomValidity("");
  input.checkValidity();
});

input.addEventListener("invalid", () => {
  if (input.value === "") {
    input.setCustomValidity("Enter a city name");
  } else {
    input.setCustomValidity("City names can only contain letters a-z!");
  }
});

btn.addEventListener("click", () => {
  if (input.checkValidity()) {
    displayEl(loader);
    getData(input.value);
  } else console.log("error");
});

let units = "metric";
let language = "el";

// function to get forecast data from forecast api and create object
function createForecastObject(data) {
  const forecast = {};
  forecast.city = data.city.name;
  forecast.country = data.city.country;
  forecast.list = data.list.map((item) => {
    const forecastItem = {};
    forecastItem.time = item.dt_txt.split(" ")[1].slice(0, 5);
    forecastItem.date = item.dt_txt.split(" ")[0].slice(5, 10);
    forecastItem.day = forecastItem.date.slice(3, 5);
    forecastItem.month = forecastItem.date.slice(0, 2);
    forecastItem.temp = Math.round(item.main.temp);
    forecastItem.description = item.weather[0].description;
    forecastItem.icon = item.weather[0].icon;
    return forecastItem;
  });
  return forecast;
}

function load3HourData(forecast) {
  const cityName = document.querySelector("#city");
  const cityName2 = document.querySelector("#city-name-2");
  const time = document.querySelector(".time");
  const tempNow = document.querySelector(".temp-now");
  const description = document.querySelector(".info");
  const icon = document.querySelector(".weather-icon");

  const cards = document.querySelectorAll(".card");
  for (let i = 1; i < 9; i++) {
    const date = cards[i].querySelector(".date");
    const hour = cards[i].querySelector(".hour");
    const temp = cards[i].querySelector(".temp");
    const icon = cards[i].querySelector(".icon");
    date.textContent = `${forecast.list[i].day}/${forecast.list[i].month}`;
    hour.textContent = forecast.list[i].time;
    temp.innerHTML = `${forecast.list[i].temp} &#8451`;
    icon.src = `images/fill/openweathermap/${forecast.list[i].icon}.svg`;
  }
  cityName.textContent = `${forecast.city}, ${forecast.country}`;
  cityName2.textContent = cityName.textContent;
  time.textContent = forecast.list[0].time;
  tempNow.innerHTML = `${forecast.list[0].temp} &#8451`;
  description.textContent = forecast.list[0].description;
  icon.src = `images/fill/openweathermap/${forecast.list[0].icon}.svg`;
}
