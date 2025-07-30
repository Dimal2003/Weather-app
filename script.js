const apiUrl = "http://localhost:3000/weather?city=";

const searchBox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.querySelector(".weather-Icon");

// City name translation mapping
const cityMapping = {
  Istok: "Istog",
  Gnjilane: "Gjilanë",
  Đakovica: "Gjakovë",
  "Kosovo Polje": "Fushë Kosovë",
  Glogovac: "Drenas",
  Mališevo: "Malishevë",
  Pec: "Peja",
  Podujevo: "Podujeva",
  Priština: "Prishtinë",
  Orahovac: "Rahovec",
  Srbica: "Skenderaj",
  "Suva Reka": "Suharekë",
  Štrpce: "Shtërpcë",
  Vitina: "Viti",
  // Added mappings for Pristina
  prishtine: "Pristina",
  Prishtine: "Pristina",
  Prishtinë: "Pristina",
  Prishtina: "Pristina",
};

async function checkWeather(city) {
  // Prevent empty city requests
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  // Translate city name if it exists in the mapping
  const translatedCity = cityMapping[city] || city;

  try {
    const response = await fetch(apiUrl + encodeURIComponent(translatedCity));
    const data = await response.json();

    if (!response.ok || !data.main) {
      alert(data.error || "City not found or API error.");
      return;
    }

    document.querySelector(".city").innerHTML = translatedCity; // Update city name here
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    switch (data.weather[0].main) {
      case "Clouds":
        weatherIcon.src = "images/clouds.png";
        break;
      case "Clear":
        weatherIcon.src = "images/clear.png";
        break;
      case "Rain":
        weatherIcon.src = "images/rain.png";
        break;
      case "Drizzle":
        weatherIcon.src = "images/drizzle.png";
        break;
      default:
        weatherIcon.src = "images/mist.png";
        break;
    }
  } catch (error) {
    alert("Failed to fetch weather data. Please try again later.");
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// Allow pressing Enter in the input box to trigger search
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
