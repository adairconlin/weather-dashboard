let getFiveDayForecast = function(city, data) {

};

let getCurrentWeather = function(city, data) {
    let location = document.querySelector("#location");
    let temperature = document.querySelector("#temp");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let icon = document.querySelector("#icon");
    let iconCode = data.current.weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";

    location.textContent = city;
    icon.src = iconUrl;
    temperature.textContent = data.current.temp + "°F";
    wind.textContent = data.current.wind_speed + "mph";
    humidity.textContent = data.current.humidity + "%"; 
};

let getCityCoords = function(city, data) {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCurrentWeather(city, data);
            })
        } else {
            console.log("Error: Not Found");
        }
    })
};


let formSubmit = function(event) {
    event.preventDefault();
    let city = document.querySelector("#city").value;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
               getCityCoords(city, data);
            })
        } else {
            console.log("Error: City Not Found");
        }
    }); 
};

document.querySelector("#submit").addEventListener("click", formSubmit);