let getCurrentWeather = function(city, data) {
    let location = document.querySelector("#location");
    let temperature = document.querySelector("#temp");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    location.textContent = city;
    temperature.textContent = data.main.temp + "°F";
    wind.textContent = data.wind.speed + "mph";
    humidity.textContent = data.main.humidity + "%";
};

let formSubmit = function(event) {
    event.preventDefault();
    let city = document.querySelector("#city").value;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCurrentWeather(city, data);
            })
        } else {
            console.log("Error: City Not Found");
        }
    }); 
};

document.querySelector("#submit").addEventListener("click", function() {
    let input = document.querySelector("#city").value;
    input.textContent = "";
    formSubmit();
});