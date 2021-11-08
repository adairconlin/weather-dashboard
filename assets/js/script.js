let searches = [];

let saveSearchHistory = function(city) {
    let historyDiv = document.querySelector("#searchHistory");
    let historyBtn = document.createElement("button");
    historyBtn.classList = "history mb-15 round";
    historyBtn.textContent = city;
    historyDiv.appendChild(historyBtn);

    if(searches) {
        searches.push(city);
    } else {
        searches = [];
        searches[0] = city;
    };
    localStorage.setItem("searches", JSON.stringify(searches));
};

let checkSearch = function(city) {
    if(!searches) {
        saveSearchHistory(city);
    } else {
        for(let i = 0; i < searches.length; i++) {
            if(searches[i] === city) {
                return;
            }
        }
        saveSearchHistory(city);
    } 
};

let loadDailyWeather = function(data, i) {
    let spanTemp = document.querySelectorAll("#tempFuture");
    let lastTemp = spanTemp[spanTemp.length - 1];
    lastTemp.textContent = data.daily[i].temp.day + "°F";

    let spanWind = document.querySelectorAll("#windFuture");
    let lastWind = spanWind[spanWind.length - 1];
    lastWind.textContent = data.daily[i].wind_speed + " mph";

    let spanHumid = document.querySelectorAll("#humidFuture");
    let lastHumid = spanHumid[spanHumid.length - 1];
    lastHumid.textContent = data.daily[i].humidity + "%";
};

let addFutureIcon = function(data, i) {
    let iconCode = data.daily[i].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";

    return iconUrl;
};

let loadFiveDayContent = function(data) {
    let checkStatus = document.querySelector("#fiveDayForecast");
    if(checkStatus) {
        checkStatus.remove();
        loadFiveDayContent(data);
    } else {
        let rightSection = document.querySelector("#resultSection");
        let futureDiv = document.createElement("div");
        futureDiv.id= "fiveDayForecast";
        rightSection.appendChild(futureDiv);   

        for(let i = 0; i < 5; i++) {
            let weatherCard = document.createElement("div");
            weatherCard.classList = "weatherCard round";
            futureDiv.appendChild(weatherCard);

            let futureDate = document.createElement("h3");
            futureDate.id = "dateFuture";
            futureDate.className= "mb-15";
            futureDate.textContent = moment().add(i + 1, "days").format("ddd, MMMM Do");
            weatherCard.appendChild(futureDate);

            let weatherIcon = document.createElement("img");
            weatherIcon.src = addFutureIcon(data, i);
            weatherCard.appendChild(weatherIcon);

            for(let j = 0; j < 3; j++) {
                let para = document.createElement("p");
                let spanInfo = document.createElement("span");
                if(j < 1) {
                    para.textContent =  "Temp: ";
                    spanInfo.id = "tempFuture";
                } else if(j > 1) {
                    para.textContent = "Humidity: ";
                    spanInfo.id = "humidFuture";
                } else {
                    para.textContent = "Wind: ";
                    spanInfo.id = "windFuture";
                }
                weatherCard.appendChild(para);
                para.appendChild(spanInfo);
            };
            loadDailyWeather(data, i);
        };
    }       
};

let uvScale = function(data) {
    let uvi = data.current.uvi;
    let value;
    if(uvi < 3) {
        value = "favorable";
    } else if(uvi > 5) {
        value = "severe";
    } else {
        value = "moderate";
    }

    return value;
};

let loadCurrentContent = function(data) {
    let rightSection = document.querySelector("#resultSection");
    let currentForecastDiv = document.createElement("div");
    currentForecastDiv.id = "currentForecast";
    currentForecastDiv.classList = "mb-15 round";
    rightSection.appendChild(currentForecastDiv);

    let titleDiv = document.createElement("div");
    titleDiv.className = "weatherIcon";
    currentForecastDiv.appendChild(titleDiv);

    let titleHeader = document.createElement("h1");
    titleHeader.id = "location";
    let weatherIcon = document.createElement("img");
    weatherIcon.id = "icon";
    weatherIcon.alt = "";
    titleDiv.appendChild(titleHeader);
    titleDiv.appendChild(weatherIcon);

    let currentDate = document.createElement("h3");
    currentDate.id = "dateToday";
    currentDate.className = "mb-15";
    currentDate.textContent = moment().format("dddd, MMMM Do");
    currentForecastDiv.appendChild(currentDate);

    for(let i = 0; i < 4; i++) {
        let para = document.createElement("p");
        let spanInfo = document.createElement("span");
        para.className = "mb-15";
        if(i < 1) {
            para.textContent = "Temp: "
            spanInfo.id = "temp"
        } else if(i == 1) {
            para.textContent = "Wind: ";
            spanInfo.id = "wind"
        } else if(i == 2) {
            para.textContent= "Humidty: ";
            spanInfo.id= "humidity";
        } else {
            para.textContent = "UV Index: "
            spanInfo.className = uvScale(data);
            spanInfo.id = "uvindex";
        }
        currentForecastDiv.appendChild(para);
        para.appendChild(spanInfo);
    }
};

let getCurrentWeather = function(city, data) {
    let rightSection = document.querySelector("#resultSection");
    if(rightSection.children.length < 1) {
        loadCurrentContent(data);
    }

    let location = document.querySelector("#location");
    let temperature = document.querySelector("#temp");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let uvIndex = document.querySelector("#uvindex");
    let icon = document.querySelector("#icon");
    let iconCode = data.current.weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";

    location.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    icon.src = iconUrl;
    temperature.textContent = data.current.temp + "°F";
    wind.textContent = data.current.wind_speed + " mph";
    humidity.textContent = data.current.humidity + "%"; 
    uvIndex.textContent = data.current.uvi;
};

let getCityCoords = function(city, data) {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                getCurrentWeather(city, data);
                loadFiveDayContent(data);
                checkSearch(city);
            })
        } else {
            console.log("Error: Not Found");
        }
    })
};

let loadInitialData = function(city) {
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
}

let formSubmit = function(event) {
    event.preventDefault();
    let city = document.querySelector("#city").value;
    loadInitialData(city);
};

document.querySelector("#searchHistory").addEventListener("click", function(event) {
    if(event.target.nodeName === "BUTTON") {
        let city = event.target.innerHTML;
        loadInitialData(city);
    }
});

document.querySelector("#city").addEventListener("click", function(event) {
    event.target.value = "";
    event.target.setAttribute("placeholder", "");
});

document.querySelector("#submit").addEventListener("click", formSubmit);

let loadSearchHistory = function() {
    searches = JSON.parse(localStorage.getItem("searches"));

    if(searches) {
        for(let i = 0; i < searches.length; i++) {
            let historyDiv = document.querySelector("#searchHistory");
            let historyBtn = document.createElement("button");
            historyBtn.classList = "history mb-15 round";
            historyBtn.textContent = searches[i];
            historyDiv.appendChild(historyBtn);
        };
    }   
};

loadSearchHistory();