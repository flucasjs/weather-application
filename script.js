// Selectors
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

// OpenWeatherMap API Key
const key = "aefccbda5614d7492619f8a0522cc888";

// Weather Data Object to hold local weather information to be displayed.
const weather = {};
weather.temperature = {unit: "celsius"};

// Determine if browser supports geolocation.
if ('geolocation' in navigator) {

    // Attempt to get the user's position.
    navigator.geolocation.getCurrentPosition(setPosition, showError);

// Display error message otherwise.
} else {

    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Brower does not support geolocation.</p>";

}

// Set the user's position.
function setPosition(position) {

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    //Call the OpenWeatherMap API using the user's position and update the application.
    getWeather(latitude, longitude);

}

// Display an error message in the notifications area.
function showError(error) {

    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;

}

// Update HTML elements with the user's local weather information using the weather API
function displayWeather(){

    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    
}

// Converts a value between Kelvin ('k'), Celsius ('c'), and Farenheit ('f') temperature scales.
function convertTemperature(value, from, to) {

    let scale1 = from.toLowerCase();
    let scale2 = to.toLowerCase();

    // Value to be converted is in Kelvin scale.
    if (scale1 == 'k') {
        
        if (scale2 == 'c') {
            
            return (value - 273);
            
        } else if (scale2 == 'f') {
            
            return (((value - 273) * 1.8) + 32);
            
        }
    
    // Value to be converted is in Celsius scale.
    } else if (scale1 == 'c') {
        
        if (scale2 == 'f') {
            
            return ((value * 1.8) + 32);
            
        } else if (scale2 == 'k') {
            
            return (value + 273);
            
        }

    // Value to be converted is in Farenheit scale.   
    } else if (scale == 'f') {
        
        if (scale2 == 'c') {
            
            return ((value - 32) / 1.8);
            
        } else if (scale2 == 'k') {
            
            return (((value - 32) / 1.8) + 32);
            
        }
    }
}

// Uses the OpenWeatherMap API to request a JSON object with weather data describing local weather then updates the application to show this information.
function getWeather(latitude, longitude) {

    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api).then(function(response){

            // Retrieve JSON object containing weather data.
            let data = response.json();
            return data;

        }).then(function(data){

            // Store the data to be displayed in weather object.
            weather.temperature.value = Math.floor(convertTemperature(data.main.temp, 'k', 'c'));
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;

        }).then(function(){

            // Update application elements.
            displayWeather();
            displayBackgroundColor();

        });

}

// Converts between Celsius and Farenheit temperature scales and displays the new value when the user clicks on the element displaying the temperature value.
tempElement.addEventListener("click", () => {

    // Do nothing if browser fails to retrieve OpenWeatherMap API data.
    if (weather.temperature.value === undefined) {
        
        return;
    }
    
    // Convert from Celsius to Farenheit temperature scale.
    if (weather.temperature.unit == "celsius") {

        let fahrenheit = Math.floor(convertTemperature(weather.temperature.value, 'c', 'f'));
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";

    // Convert from Farenheit to Celsius temperature scale.
    } else {

        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";

    }
    
});

// Changes the background color of the body depending on the time of day.
function displayBackgroundColor() {

    let timePeriod = weather.iconId[2];

    // If daytime, apply light background.
    if (timePeriod == "d") {
        
        document.body.style.background = "linen";
        
    // If nighttime, apply dark background.
    } else if (timePeriod == "n") {
        
        document.body.style.background = "darkslategray";
        
    }

}
 