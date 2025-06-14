// Combined JavaScript with Advanced Features
const apiKey = "604ce7dd92d0c7cd45c07d402d183aa8";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const unitToggleBtn = document.getElementById("toggle-unit");

let isCelsius = true;

function updateWeather(data) {
  document.querySelector(".city").innerText = data.name;
  document.querySelector(".temp").innerText = data.main.temp + (isCelsius ? "°C" : "°F");
  document.querySelector(".feels-like").innerText = data.main.feels_like;
  document.querySelector(".humidity").innerText = data.main.humidity + "%";
  document.querySelector(".wind").innerText = data.wind.speed + (isCelsius ? " km/h" : " mph");
  document.querySelector(".country").innerText = data.sys.country;

  const weather = data.weather[0].main;
  const icons = {
    Clouds: "clouds.png",
    Clear: "clear.png",
    Rain: "rain.png",
    Drizzle: "drizzle.png",
    Mist: "mist.png",
    Snow: "snow.png"
  };

  weatherIcon.src = `https://github.com/Khyes/12_weather_webapp/blob/main/img/${icons[weather]}?raw=true`;

  // Dynamic background class
  document.body.className = weather.toLowerCase();

  // Local time
  const offset = data.timezone;
  const localTime = new Date(new Date().getTime() + offset * 1000);
  const localTimeStr = localTime.toLocaleTimeString();
  let localTimeEl = document.querySelector(".local-time");
  if (!localTimeEl) {
    localTimeEl = document.createElement("h3");
    localTimeEl.className = "local-time";
    document.querySelector(".weather").appendChild(localTimeEl);
  }
  localTimeEl.innerText = `Local Time: ${localTimeStr}`;

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

async function checkWeather(city) {
  const units = isCelsius ? "metric" : "imperial";
  const response = await fetch(`${apiUrl}${units}&q=${city}&appid=${apiKey}`);
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();
    updateWeather(data);
  }
}

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", e => {
  if (e.key === "Enter") checkWeather(searchBox.value);
});

unitToggleBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggleBtn.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  checkWeather(searchBox.value);
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const units = isCelsius ? "metric" : "imperial";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
      );
      const data = await response.json();
      updateWeather(data);
    });
  }
});
