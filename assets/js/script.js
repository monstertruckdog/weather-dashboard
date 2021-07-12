var currentWeatherContainer = $('.current-weather-container');
var currentWeatherHeadCity = $('<h4>');
var currentWeatherHeadDate = $('<span>');
var currentWeatherUoList = $('<ul>');
var currentWeatherListItem = $('<li>');
var searchList = $('.recent-search-list');
var cityEntry = $('#city-entry');
var citySubmitBtn = $('#submit-btn')
var fivedayWeatherContainer = $('.fiveday-container');

var currentDate = moment().format('MM/DD/YYYY');
var cityName;
var longitude;
var latitude;
var cityStore = [];

var key = `e8a298c777dff96133e6b579f54b4339`

function storeCity() {
    console.log(`--> CONTENTS OF cityStore:  ${cityStore}`)
    console.log(`--> INDEX OF cityStore CONTENTS:  ${cityStore.indexOf(cityName)}`)
    console.log(`--> indexOf(cityName):  ${cityStore.indexOf(cityName) === -1}`);
    if (cityStore.indexOf(cityName) === -1) {
        cityStore.push(cityName);
        localStorage.setItem('CITY', JSON.stringify(cityStore));
        displayNewSearchedCity();
        
    } else {
        return;
    }
    // displaySearchedCities();
}

function displayNewSearchedCity() {
    console.log(`VALUE OF cityName:  ${cityName}`);
    console.log(`VALUE OF cityStore AT INDEX cityStore.length:  ${cityStore[cityStore.length - 1]}`)
    if (cityName === cityStore[cityStore.length - 1]) {
        var searchListItem = document.createElement('li');
        var searchBtn = document.createElement('button');
        // searchBtn.setAttribute(`id`, `search-city-${storedSearches}`);
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
    // $('.recent-search-list').innerHTML = "";
    document.getElementsByClassName("recent-search-list").innerHTML = "";
    var storedSearches = '';
    var storedSearches = JSON.parse(localStorage.getItem('CITY'))
    console.log(`--> storedSearches CONTENT:  ${storedSearches}`)
    if (storedSearches) {
        console.log(`--> storedSearches:  ${storedSearches}`)
        console.log(`--> storedSearches Length:  ${storedSearches.length}`)
    
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

function currentWeather() {
    
    currentWeatherContainer.attr('id', 'current-container-dynamic');
    currentWeatherContainer.text('');
    currentWeatherHeadCity.text(cityName);
    currentWeatherHeadDate.text(currentDate);
    console.log(`from getCurrentWeather - CITY NAME:  ${cityName}`);
    console.log(`from getCurrentWeather - CURRENT DATE:  ${currentDate}`);
    currentWeatherContainer.append('<h4 id="city-name">' + cityName + ' <span id="current-date">(' + currentDate + ')</span></h4>');
};

function getCityValue() {
    cityName = $('#city-entry').val();
    console.log(`cityName SUBMITTED:  ${cityName}`);
    storeCity();
    currentWeather();
    getLonLat();
};

function goSavedCity() {
    event.preventDefault();
    cityName = $(event.target).text();
    console.log(`--> cityName (variable value - from goSavedCity):  ${cityName}`);
    console.log(`--> cityName (expression value - from goSavedCity):  ${$(event.target).text()}`);
    currentWeather();
    getLonLat();
}

function init() {
    displayAllSearchedCities();
}
function getLonLat() {
    var requestCurrentCity = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key
    
    fetch(requestCurrentCity)
        .then(function (response) {
            console.log(response.status);
            if (response.ok) {
                console.log(`response call was OK (getLonLat)`);
                response.json().then(function (data) {
                    console.log(data);
                    longitude = data.coord.lon
                    latitude = data.coord.lat
                    getCurrentWeather(longitude, latitude);
                    console.log(`LONGITUDE:  ${longitude}`);
                    console.log(`LATITUDE:  ${latitude}`);
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
        console.log(`LONGITUDE / LATITUDE (inside getCurrentWeather:  ${longitude} / ${latitude}`);
        var requestCurrentCity =  'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,daily,alerts&appid=' + key + '&units=imperial'
    
        fetch(requestCurrentCity)
            .then(function (response) {
                console.log(response.status);
                if (response.ok) {
                    console.log(`response call was OK (getCurrentWeather)`);
                    response.json().then(function (data) {
                        console.log(data);
                        console.log(`LONGITUDE:  ${longitude}`);
                        console.log(`LATITUDE:  ${latitude}`);

                        var currentWeatherValuesList = $('<ul>');
                        currentWeatherValuesList.attr('class', 'current-weather-values-ul');
                        currentWeatherContainer.append(currentWeatherValuesList);
                        currentWeatherValuesList.append('<li class="current-li temp-li">TEMPERATURE:  ' + data.current.temp + ' °F</li>');
                        currentWeatherValuesList.append('<li class="current-li wind-li">WIND SPEED:  ' + data.current.wind_speed + ' MPH</li>');
                        currentWeatherValuesList.append('<li class="current-li humidity-li">HUMIDITY:  ' + data.current.humidity + '%</li>');
                        currentWeatherValuesList.append('<li class="current-li uvi-li">UV INDEX:  <span class="uvi-li-span">' + data.current.uvi + '</span></li>');

                        if (data.current.uvi >= 0 && data.current.uvi < 3) {
                            console.log(`INSIDE SPAN`)
                            var uVIndex = $('.uvi-li-span');
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
                console.log(response.status);
                if (response.ok) {
                    console.log(`response call was OK`);
                    $('.fiveday-container').html('');
                    // searchBtn.className += ` btn blue-grey darken-2 ${storedSearches[i]}`
                    // document.getElementsByClassName('fiveday-container').setAttribute('id', 'fiveday-container-dynamic');
                    
                    // document.getElementsByClassName("fiveday-container").innerHTML = "";
                    fivedayWeatherContainer.attr('id', 'fiveday-container-dynamic');
                    response.json().then(function (data) {
                        console.log('DATA', data);
                        
                        console.log(`LONGITUDE:  ${longitude}`);
                        console.log(`LATITUDE:  ${latitude}`);
                        // document.getElementsByClassName("fiveday-container").id = `fiveday-container-dynamic`;
                        $('.fiveday-container').append('<h4 id="fiveday-title">5-Day Forecast:</h4>');

                        var fiveDayData = []
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
                            console.log(`--> WEATHER ICON CODE (From array):  ${dayData[1]}`);
                            console.log(`--> WEATHER DESCRIPTION: ${data.daily[q].weather.description}`)
                            console.log(`--> WEATHER ICON CODE (raw loop extract - A):  ${data.daily[q].weather.icon}`)
                            console.log(`--> WEATHER ICON CODE (raw loop extract - B):  ${data.daily[q].weather[0].icon}`)
                            $('.fiveday-card-container').append(`<div class="fiveday-card-${q}" id="fdc-card"></div>`);
                            $(`.fiveday-card-${q}`).append(`<ul class="five-day-weather-values-list-${q}">`);
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="date">${dayData[0]}</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="icon"><img src="http://openweathermap.org/img/wn/${dayData[1]}.png" alt="Weather icon for ${dayData[0]}"></li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="temp"><strong>TEMPERATURE</strong>:  ${dayData[2]} °F</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="windspeed"><strong>WIND SPEED</strong>:  ${dayData[3]} MPH</li>`)
                            $(`.five-day-weather-values-list-${q}`).append(`<li class="fiveday-card-li-${q}" id="humidity"><strong>HUMIDITY</strong>:  ${dayData[4]}%</li>`)
                            console.log(`ITERATION B ${q}:  ${dayData}`);
                            console.log(`ITERATION B[0] ${q}:  ${dayData[0]}`);
                        }
                    
                    })
                }
            });
    } else {
        console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN (getFiveDayWeather)`);
        return;
    }
    
};

init();