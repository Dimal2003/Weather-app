const apiKey = "f4adfc525331c44d54e6cf496ff8301c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?lang=al&units=metric&q="; 

const searchBox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.querySelector(".weather-Icon");

// City name translation mapping
const cityMapping = {
    "Istok": "Istog",
    "Gnjilane": "Gjilanë",
    "Đakovica": "Gjakovë",
    "Kosovo Polje": "Fushë Kosovë",
    "Glogovac": "Drenas",
    "Mališevo": "Malishevë",
    "Pec": "Peja",
    "Podujevo": "Podujeva",
    "Priština": "Prishtinë",
    "Orahovac": "Rahovec",
    "Srbica": "Skenderaj",
    "Suva Reka": "Suharekë",
    "Štrpce": "Shtërpcë",
    "Vitina": "Viti"
};

async function checkWeather(city) {
    // Translate city name if it exists in the mapping
    const translatedCity = cityMapping[city] || city;
    
    const response = await fetch(apiUrl + translatedCity + `&appid=${apiKey}`);
    const data = await response.json();

    console.log(data);
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
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Call checkWeather without a city name to use the default city specified in the API URL
checkWeather("");
