let searches = [];

// Save users search history of cities.
let saveSearchHistory = function(city) {
    let historyDiv = document.querySelector("#searchHistory");
    let historyBtn = document.createElement("button");
    historyBtn.classList = "history mb-15 round";
    historyBtn.textContent = city;
    historyDiv.appendChild(historyBtn);

    // If `searches` has values, add the city name to the list.
    if(searches) {
        searches.push(city);
    } else {
        // If `searches` is empty, turn it into an empty array and
        // assign this city as the first value.
        searches = [];
        searches[0] = city;
    };
    // Set the `searches array to the users local browser storage.
    localStorage.setItem("searches", JSON.stringify(searches));
};

let checkSearch = function(city) {
    // If the `searches` array is empty, add the city to the array.
    if(!searches) {
        saveSearchHistory(city);
    } else {
        // Go through the `searches` array to prevent duplicates of a city.
        for(let i = 0; i < searches.length; i++) {
            if(searches[i] === city) {
                return;
            }
        }
        // If this city isn't in `searches`, save it with this function.
        saveSearchHistory(city);
    } 
};

let loadDailyWeather = function(data, i) {
    // Select all span elements with the id of "tempFuture".
    let spanTemp = document.querySelectorAll("#tempFuture");
    // Variable that defines the value of the last `spanTemp` element.
    let lastTemp = spanTemp[spanTemp.length - 1];
    // Change text content of last span child element.
    lastTemp.textContent = data.daily[i].temp.day + "°F";

    let spanWind = document.querySelectorAll("#windFuture");
    let lastWind = spanWind[spanWind.length - 1];
    lastWind.textContent = data.daily[i].wind_speed + " mph";

    let spanHumid = document.querySelectorAll("#humidFuture");
    let lastHumid = spanHumid[spanHumid.length - 1];
    lastHumid.textContent = data.daily[i].humidity + "%";
};

// Find weather icon for the specified day/city and return it's url.
let addIcon = function(data, i) {
    if(!i) { 
        // Value for the current day in API
        i = 0;
    };

    let iconCode = data.daily[i].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";

    return iconUrl;
};

// Retrieve data and loop through each day to display the weather data accordingly.
let loadFiveDayContent = function(data) {
    let checkStatus = document.querySelector("#fiveDayForecast");
    // Remove element if it already exists to prevent duplicate elements.
    if(checkStatus) {
        checkStatus.remove();
        loadFiveDayContent(data);
    } else {
        let rightSection = document.querySelector("#resultSection");
        let futureDiv = document.createElement("div");
        futureDiv.id= "fiveDayForecast";
        rightSection.appendChild(futureDiv);   

        // Generate the 5 weather cards for the five upcoming days of weather.
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
            weatherIcon.src = addIcon(data, i);
            weatherCard.appendChild(weatherIcon);

            // Generate 3 paragraph and span elements for each weather card
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
            // Based on paragraph and span properties, call this function
            // to display them properly on the page.
            loadDailyWeather(data, i);
        };
    }       
};

// Check the UV Index for the given day and
// give colored class names accordingly.
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

// Load elements onto section in order to display the weather data.
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
    titleDiv.appendChild(titleHeader);
    titleDiv.appendChild(weatherIcon);

    let currentDate = document.createElement("h3");
    currentDate.id = "dateToday";
    currentDate.className = "mb-15";
    // Display current day with Moment.js.
    currentDate.textContent = moment().format("dddd, MMMM Do");
    currentForecastDiv.appendChild(currentDate);

    // Create three paragraph elements each with different properties.
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
    // Check if this section has child elements yet to avoid 
    // creating duplicate elements on the page.
    if(rightSection.children.length < 1) {
        loadCurrentContent(data);
    }

    let location = document.querySelector("#location");
    let temperature = document.querySelector("#temp");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let uvIndex = document.querySelector("#uvindex");
    let icon = document.querySelector("#icon");
    // Capitalize the first letter of the users input.
    location.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    // Find icon from API and display on page to represent weather.
    icon.src = addIcon(data);
    temperature.textContent = data.current.temp + "°F";
    wind.textContent = data.current.wind_speed + " mph";
    humidity.textContent = data.current.humidity + "%"; 
    uvIndex.textContent = data.current.uvi;
};

// Display error on page for the user.
let apiError = function() {
    let inputValue = document.querySelector("#city");
    inputValue.value = "Error Retrieving Data";
};

// Load necessary data from specified city, to then call 
// functions in order to display it to the user.
let getCityCoords = function(city, data) {
    // The latitude and longitude values of the specified cit are 
    // required for this specific API to retrieve the necessary data.
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                // Retrieve weather data for the current day.
                getCurrentWeather(city, data);
                // Retrieve weather data for the next five days
                loadFiveDayContent(data);
                // Call function to check if this city has been searched
                // before storing it in the users search history.
                checkSearch(city);
            })
        } else {
            apiError();
        }
    })
};

let loadInitialData = function(city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=198d07e9a046131e4583b2665e1187a0";

    fetch(apiUrl).then(function(response) {
        // Checks weather the response from the given apiUrl is valid or not.
        if(response.ok) {
            response.json().then(function(data) {
                // Call function to retrieve data from API that will be displayed.
               getCityCoords(city, data);
            })
        } else {
            apiError();
        }
    }); 
}

let formSubmit = function(event) {
    // Prevent page from refreshing.
    event.preventDefault();
    // Assign the users input as the value to the city variable.
    let city = document.querySelector("#city").value;
    // Call function to load OpenWeatherMap API data.
    loadInitialData(city);
};

// Load the city data when user clicks on a city in their history.
document.querySelector("#searchHistory").addEventListener("click", function(event) {
    if(event.target.nodeName === "BUTTON") {
        let city = event.target.innerHTML;
        loadInitialData(city);
    }
});

// Clear input box when user clicks on it.
document.querySelector("#city").addEventListener("click", function(event) {
    event.target.value = "";
    event.target.setAttribute("placeholder", "");
});

// Listen for user to search for a city, then call a function to retrieve API data.
document.querySelector("#submit").addEventListener("click", formSubmit);

let loadSearchHistory = function() {
    //Assign the localStorage values to the `searches` array.
    searches = JSON.parse(localStorage.getItem("searches"));

    // Check if `searches` is not null or empty
    if(searches) {
        // Create search history buttons based on the retrieved localStorage data.
        for(let i = 0; i < searches.length; i++) {
            let historyDiv = document.querySelector("#searchHistory");
            let historyBtn = document.createElement("button");
            historyBtn.classList = "history mb-15 round";
            historyBtn.textContent = searches[i];
            historyDiv.appendChild(historyBtn);
        };
    }   
};

// When the pages loads, this function is called to load the users search history.
loadSearchHistory();