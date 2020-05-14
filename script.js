// Selectors
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

// OpenWeatherMap API Key
const key = "82005d27a116c2880c8f0fcb866998a0";

// Weather Data
const weather = {};
weather.temperature = {unit: "celsius"};

// Kelvin value;
const KELVIN = 273;

// Determine if browser supports geolocation
if ('geolocation' in navigator) {

    navigator.geolocation.getCurrentPosition(setPosition, showError);

} else {

    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Brower does not support geolocation.</p>";

}

// Set the user's position.
function setPosition(position) {

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
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

function convertTemperature(value, from, to) {

    let scale1 = from.toLowerCase();
    let scale2 = to.toLowerCase();

    if (scale1 == 'k') {
        if (scale2 == 'c') {
            return (value - 273);
        } else if (scale2 == 'f') {
            return (((value - 273) * 1.8) + 32);
        }
    } else if (scale1 == 'c') {
        if (scale2 == 'f') {
            return ((value * 1.8) + 32);
        } else if (scale2 == 'k') {
            return (value + 273);
        }
    } else if (scale == 'f') {
        if (scale2 == 'c') {
            return ((value - 32) / 1.8);
        } else if (scale2 == 'k') {
            return (((value - 32) / 1.8) + 32);
        }
    }
}

function getWeather(latitude, longitude) {

    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api).then(function(response){
            let data = response.json();
            return data;
        }).then(function(data){
            weather.temperature.value = Math.floor(convertTemperature(data.main.temp, 'k', 'c'));
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        }).then(function(){
            displayWeather();
            displayBackgrounColor();
        });

}


tempElement.addEventListener("click", () => {

    if(weather.temperature.value === undefined) {
        return;
    }
    
    if(weather.temperature.unit == "celsius"){

        let fahrenheit = Math.floor(convertTemperature(weather.temperature.value, 'c', 'f'));
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";

    }else{

        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";

    }
    
});

function displayBackgrounColor() {

    let timePeriod = weather.iconId[2];
    alert(timePeriod);

    if (timePeriod == "d") {
        document.body.style.background = "linen";
    } else if (timePeriod == "n") {
        document.body.style.background = "darkslategray";
    }

}
 