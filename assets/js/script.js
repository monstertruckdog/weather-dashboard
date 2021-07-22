var currentWeatherContainer = $('.current-weather-container');
var currentWeatherHeadCity = $('<h4>');
var currentWeatherHeadDate = $('<span>');
var currentWeatherUoList = $('<ul>');
var currentWeatherListItem = $('<li>');
var searchList = $('.recent-search-list');
var eEntryResponse = document.getElementById('entry-response');
var eWarnings = document.getElementById('warning');
var eWarningText = document.getElementById('warning-text');
var cityEntry = $('#city-entry');
var citySubmitBtn = $('#submit-btn')
var eAllWeatherContainer = $('.all-weather-container');
var fivedayWeatherContainer = $('.fiveday-container');

var currentDate = moment().format('MM/DD/YYYY');
var cityName;
var longitude;
var latitude;
var cityStore = [];

var key = `e8a298c777dff96133e6b579f54b4339`

function storeCity() {
    if (/[^a-zA-Z\s-]/.test(cityName)) {
        currentWeatherContainer.text('');
    } else {
        cityStore.forEach((city) => city.toLowerCase());
        if (cityStore.indexOf(cityName) === -1) {
            cityStore.push(cityName.toLowerCase());
            localStorage.setItem('CITY', JSON.stringify(cityStore));
            displayNewSearchedCity();
        } else {
            return;
        }
    }
}

function displayNewSearchedCity() {
    if (cityName === cityStore[cityStore.length - 1]) {
        var searchListItem = document.createElement('li');
        var searchBtn = document.createElement('button');
        searchBtn.setAttribute(`class`, `stored-search-btn`);
        searchBtn.setAttribute(`onclick`, `goSavedCity()`)
        searchBtn.className += ` btn blue-grey darken-2`
        searchBtn.textContent = cityName;
        searchList.append(searchListItem);
        searchListItem.append(searchBtn);
    } else {
        return;
    }
}

function displayAllSearchedCities() {
    document.getElementsByClassName("recent-search-list").innerHTML = "";
    var storedSearches = '';
    var storedSearches = JSON.parse(localStorage.getItem('CITY'))
    if (storedSearches) {
        for (var i = 0; i < storedSearches.length; i++) {
            var searchListItem = document.createElement('li');
            var searchBtn = document.createElement('button');
            searchBtn.setAttribute(`id`, `search-city-${storedSearches[i]}`);
            searchBtn.setAttribute(`class`, `stored-search-btn`);
            searchBtn.setAttribute(`onclick`, `goSavedCity()`)
            searchBtn.className += ` btn blue-grey darken-2 ${storedSearches[i]}`
            searchBtn.textContent = storedSearches[i];
            searchList.append(searchListItem);
            searchListItem.append(searchBtn);
        } 
    } else {
        return;
    } 
};

function cityNameValidator(name) {
    if (/[^a-zA-Z\s-]/.test(name)) {
        eWarningText.append(`City name is invalid`);
    }
}

function currentWeather() {
    if (/[^a-zA-Z\s-]/.test(cityName)) {
        document.getElementById('current-container-border').setAttribute('id', 'current-container-border-hide')
        document.getElementById('five-container-border').setAttribute('id', 'five-container-border-hide')
        document.getElementById('five-container-border-hide').innerHTML = "";
        return;
    } else {
        currentWeatherContainer.attr('id', 'current-container-border');
        currentWeatherContainer.text('');
        currentWeatherHeadCity.text(cityName);
        currentWeatherHeadDate.text(currentDate);
        currentWeatherContainer.append('<h4 id="city-name">' + cityName + ' <span id="current-date">(' + currentDate + ')</span></h4>');
    };
};

function goSavedCity() {
    event.preventDefault();
    cityName = $(event.target).text();
    currentWeather(cityName);
    getLonLat();
};

function init() {
    displayAllSearchedCities();
};

function getLonLat() {
    var requestCurrentCity = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key
    fetch(requestCurrentCity)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    longitude = data.coord.lon
                    latitude = data.coord.lat
                    getCurrentWeather(longitude, latitude);
                    return { longitude, latitude }
                });
            } else {
                console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN`)
                return;
            }
        })
};

function getCurrentWeather(longitude, latitude) {
    if (longitude && latitude) {
        var requestCurrentCity =  'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,daily,alerts&appid=' + key + '&units=imperial'
        fetch(requestCurrentCity)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        var currentWeatherValuesList = $('<ul>');
                        currentWeatherValuesList.attr('class', 'current-weather-values-ul');
                        currentWeatherContainer.append(currentWeatherValuesList);
                        currentWeatherValuesList.append('<li class="current-li temp-li">TEMPERATURE:  ' + data.current.temp + ' °F</li>');
                        currentWeatherValuesList.append('<li class="current-li wind-li">WIND SPEED:  ' + data.current.wind_speed + ' MPH</li>');
                        currentWeatherValuesList.append('<li class="current-li humidity-li">HUMIDITY:  ' + data.current.humidity + '%</li>');
                        currentWeatherValuesList.append('<li class="current-li uvi-li">UV INDEX:  <span class="uvi-li-span">' + data.current.uvi + '</span></li>');

                        if (data.current.uvi >= 0 && data.current.uvi < 3) {
                            $('.uvi-li-span').attr('id', 'uvi-minimal');
                        } else if (data.current.uvi >= 3 && data.current.uvi < 5) {
                            $('.uvi-li-span').attr('id', 'uvi-low');
                        } else if (data.current.uvi >= 5 && data.current.uvi < 7) {
                            $('.uvi-li-span').attr('id', 'uvi-moderate');
                        } else if (data.current.uvi >= 7 && data.current.uvi < 10) {
                            $('.uvi-li-span').attr('id', 'uvi-high');
                        } else if (data.current.uvi >= 10) {
                            $('.uvi-li-span').attr('id', 'uvi-very-high');
                        };
                        getFiveDayWeather(longitude, latitude);

                    });
                } else if (response.status === 404) {
                    // TO DO:  this is not necessary
                    return
                } else {
                    console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN (getCurrentWeather)`);
                    return;
                };

            });
    };
};

function getFiveDayWeather(longitude, latitude) {
    if (longitude && latitude) {
        var fiveDayDataGet = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`

        fetch(fiveDayDataGet)
            .then(function (response) {
                if (response.ok) {
                    $('.fiveday-container').html('');
                    fivedayWeatherContainer.attr('id', 'five-container-border');
                    response.json().then(function (data) {
                        $('.fiveday-container').append('<h4 id="fiveday-title">5-Day Forecast:</h4>');
                        $('.fiveday-container').append('<div class="fiveday-card-container"></div>');
                        for (var q = 1; q < 6; q++) {
                            var dayData = [];
                            dayData = [ moment.unix(data.daily[q].dt).format("MM/DD/YYYY"),
                                        data.daily[q].weather[0].icon,
                                        data.daily[q].temp.day,
                                        data.daily[q].wind_speed,
                                        data.daily[q].humidity
                                      ];
                            // ICON EXAMPLE:  http://openweathermap.org/img/wn/10d@2x.png
                            $('.fiveday-card-container').append(`<div class="fiveday-card-${q}" id="fdc-card"></div>`);
                            $(`.fiveday-card-${q}`).append(`<ul class="five-day-weather-values-list-${q}">`);
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="date">${dayData[0]}</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="icon"><img src="http://openweathermap.org/img/wn/${dayData[1]}.png" alt="Weather icon for ${dayData[0]}"></li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="temp"><strong>TEMPERATURE</strong>:  ${dayData[2]} °F</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="windspeed"><strong>WIND SPEED</strong>:  ${dayData[3]} MPH</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="humidity"><strong>HUMIDITY</strong>:  ${dayData[4]}%</li>`)
                        }
                    
                    })
                } else if (response.status === 404) {
                    // TO DO:  this is likely not necessary
                    $('.fiveday-container').html('');
                    return;
                };
            });
    } else {
        console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN (getFiveDayWeather)`);
        return;
    }
    
};

function getCityValue() {
    // this clears the invalid city name error message text
    while (eWarningText.hasChildNodes()) {
        eWarningText.removeChild(eWarningText.lastChild);
    }
    cityName = $('#city-entry').val().trim().toLowerCase();
    cityNameValidator(cityName);
    storeCity(cityName);
    currentWeather();
    getLonLat();
};


// Materialize JS to initialize the "About" modal
$(document).ready(function(){
    $('.modal').modal();
  });

// Displays existing "Recent Seraches" buttons when accessing page
init();