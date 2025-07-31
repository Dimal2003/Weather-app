// API configuration
const apiUrl = "http://localhost:8080/weather?city=";

// DOM Elements
const searchBox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.getElementById("weather-icon");
const cityElement = document.getElementById("city-name");
const tempElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const weatherDescElement = document.getElementById("weather-description");
const unitToggle = document.getElementById("unit-toggle");
const refreshButton = document.getElementById("refresh-button");
const loadingSpinner = document.getElementById("loading-spinner");

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
    pristina: "Prishtine",
    Pristina: "Prishtine",
    Pristina: "Prishtina",
    Pristina: "Prishtina",
};

// Weather icon mapping
const weatherIcons = {
    Clouds: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    Clear: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
    Rain: "https://cdn-icons-png.flaticon.com/512/414/414974.png",
    Drizzle: "https://cdn-icons-png.flaticon.com/512/414/9749.png",
    Mist: "https://cdn-icons-png.flaticon.com/512/414/414968.png",
    Snow: "https://cdn-icons-png.flaticon.com/512/414/414969.png",
    Thunderstorm: "https://cdn-icons-png.flaticon.com/512/414/414964.png"
};

// State variables
let currentCity = "Prishtina";
let currentUnit = "celsius";
let currentTemp = 22;

// Time-based theme function
function setTimeBasedTheme() {
    const now = new Date();
    const hour = now.getHours();
    const body = document.body;
    
    // Remove any existing time classes
    body.classList.remove('morning', 'afternoon', 'sunset', 'night');
    
    // Set time indicator text
    const timeIndicator = document.querySelector('.time-indicator');
    
    if (hour >= 5 && hour < 12) {
        body.classList.add('morning');
        timeIndicator.textContent = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
        body.classList.add('afternoon');
        timeIndicator.textContent = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
        body.classList.add('sunset');
        timeIndicator.textContent = 'Good Evening';
    } else {
        body.classList.add('night');
        timeIndicator.textContent = 'Good Night';
    }
}

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = "block";
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = "none";
}

// Update weather display
function updateWeatherUI(data, city) {
    // Translate city name if needed
    const translatedCity = cityMapping[city] || city;
    
    // Update UI elements
    cityElement.textContent = translatedCity;
    tempElement.textContent = Math.round(data.main.temp);
    humidityElement.textContent = data.main.humidity + "%";
    windElement.textContent = data.wind.speed + " km/h";
    weatherDescElement.textContent = data.weather[0].description;
    
    // Update weather icon
    const weatherMain = data.weather[0].main;
    weatherIcon.src = weatherIcons[weatherMain] || weatherIcons["Clear"];
    
    // Store current temperature
    currentTemp = data.main.temp;
}

// Check weather function
async function checkWeather(city) {
    // Prevent empty city requests
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
    
    showLoading();
    
    // Translate city name if it exists in the mapping
    const translatedCity = cityMapping[city] || city;
    
    try {
        const response = await fetch(apiUrl + encodeURIComponent(translatedCity));
        const data = await response.json();
        
        if (!response.ok || !data.main) {
            alert(data.error || "City not found or API error.");
            hideLoading();
            return;
        }
        
        // Update UI with weather data
        updateWeatherUI(data, city);
        
        // Store current city
        currentCity = city;
        
        // Update time-based theme
        setTimeBasedTheme();
        
    } catch (error) {
        alert("Failed to fetch weather data. Please try again later.");
        console.error(error);
    } finally {
        hideLoading();
    }
}

// Toggle temperature unit
function toggleTemperatureUnit() {
    if (currentUnit === "celsius") {
        // Convert to Fahrenheit
        const fahrenheit = Math.round((currentTemp * 9/5) + 32);
        tempElement.textContent = fahrenheit;
        unitToggle.innerHTML = '<i class="fas fa-temperature-high"></i> Switch to °C';
        currentUnit = "fahrenheit";
    } else {
        // Convert back to Celsius
        tempElement.textContent = Math.round(currentTemp);
        unitToggle.innerHTML = '<i class="fas fa-temperature-high"></i> Switch to °F';
        currentUnit = "celsius";
    }
}

// Initialize the app
function initApp() {
    // Set initial theme based on time
    setTimeBasedTheme();
    
    // Set up event listeners
    searchBtn.addEventListener('click', () => {
        checkWeather(searchBox.value);
    });
    
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkWeather(searchBox.value);
        }
    });
    
    unitToggle.addEventListener('click', toggleTemperatureUnit);
    
    refreshButton.addEventListener('click', () => {
        checkWeather(currentCity);
    });
    
    // Load initial city weather
    checkWeather(currentCity);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
