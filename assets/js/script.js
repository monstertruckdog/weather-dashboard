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
        console.log(`--> CONTENTS OF cityStore:  ${cityStore}`)
        console.log(`--> INDEX OF cityStore CONTENTS:  ${cityStore.indexOf(cityName)}`)
        console.log(`--> indexOf(cityName):  ${cityStore.indexOf(cityName) === -1}`);
        cityStore.forEach((city) => city.toLowerCase());
        console.log(`--> CONTENTS OF cityStore (after forEach):  `, cityStore);
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

function cityNameValidator(name) {
    if (/[^a-zA-Z\s-]/.test(name)) {
        console.log(`invalid city name`)
        eWarningText.append(`City name is invalid`);
    }
}

function firstLetterUpperCase(name) { // <-- THIS FUNCTION IS DEPRECATED; keeping in case it's needed before a more final version is completed
    let firstLetter;
    function convertCase() {
        firstLetter = name.match(/\b[a-zA-Z]/g)
        console.log(`--> firstLetterUpperCase - firstLetter FOUND:  `, firstLetter)
        console.log(`--> firstLetterUpperCase - word value:  `, name);
        firstLetterUpper = firstLetter[0].toUpperCase();
        return firstLetterUpper;
    }
    console.log(`--> firstLetterUpperCase - 102 - name VALUE:  `, name)
    if (name.match(/\b[a-zA-Z]/g).length === 1) {
        // singleWordFirstLetter = word.match(/\b[a-zA-Z]/g);
        // console.log(`--> firstLetterUpperCase - singleWordFirstLetter:  `, singleWordFirstLetter);
        // console.log(`--> firstLetterUpperCase - firstLetter UpperCased:  `, firstLetter[0].toUpperCase());
        // word.replace(/\b[a-zA-Z]/g, firstLetter[0].toUpperCase())
        // convertCase(firstLetter);
        name.replace(/\b[a-zA-Z]/g, convertCase())
        console.log(`--> firstLetterUpperCase - firstLetterUpper:  `, firstLetterUpper)
        console.log(`--> firstLetterUpperCase - word after replace:  `, name);
    } else if (firstLetter && firstLetter.length > 1) {
        console.log(`--> firstLetterUpperCase:  `, 'to be determined')
    }
    // const wordUpper = word.replace(/\b[a-zA-Z]/g, /\b[a-zA-Z]/g.toUpperCase());
    // console.log(`--> wordUpper:  `, wordUpper);
    return name;
}

function cityNameFormatter(name) { // <-- THIS FUNCTION IS DEPRECATED; keeping around in case needed before a more final version is completed
    cityNameValidator(name);
    console.log(`--> 'name' VALUE:  `, name)
    nameSplit = name.split('');
    if (nameSplit.includes(' ') === true) {
        console.log('City name contains a space character (\' \')');
        // firstLetter = nameSplit.shift().toUpperCase();
        // nameSplit.unshift(firstLetter);
        // console.log(`--> nameSplit (after unshift):  `, nameSplit)
        /*
        for (let i = 0; i < nameSplit.length; i++) {
            if (nameSplit[i] === ' ') {
                firstLetterNextWord = nameSplit[i + 1]
                firstLetterNextWord.toUpperCase();
                nameSplit.splice(nameSplit[i + 1], 1, firstLetterNextWord)
                nameCleaned = nameSplit.join('');
                storeCity(cityName);
                currentWeather(nameCleaned);
                getLonLat();
            }
            
        }
        */
        firstLetterUpperCase(name);
        //nameCleaned = nameSplit.join('');
    } else {
        /*
        console.log(`--> 'name' VALUE at [0]:  `, nameSplit[0]);
        console.log(`--> nameSplit (00) (before shift declared):  `,  nameSplit);
        firstLetter = nameSplit.shift().toUpperCase();
        nameSplit.unshift(firstLetter);
        nameCleaned = nameSplit.join('');
        console.log(`--> nameCleaned:  `,  nameCleaned);
        */
       firstLetterUpperCase(name)
       storeCity(cityName);
       currentWeather();
       getLonLat();
    }
}

function currentWeather() {
    console.log(`--> currentWeather Test Results on cityName:  `, /[^a-zA-Z\s-]/.test(cityName));
    if (/[^a-zA-Z\s-]/.test(cityName)) {
        
        // currentWeatherContainer.attr('id', 'current-container-dynamic');
        // currentWeatherContainer.innerHTML = "";
        // eAllWeatherContainer.innerHTML = "";
        // currentWeatherContainer.text('');
        // document.querySelector(".container-master-weather").innerHTML = "" // <-- this works
        document.getElementById('current-container-border').setAttribute('id', 'current-container-border-hide')
        // document.getElementsByClassName('current-weather-container').innerHTML = "";
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
    console.log(`--> VALUE FOR cityName (from goSavedCity):  `, $(event.target).text())
    console.log(`--> cityName (variable value - from goSavedCity):  ${cityName}`);
    console.log(`--> cityName (expression value - from goSavedCity):  ${$(event.target).text()}`);
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
            console.log(response.status);
            if (response.ok) {
                response.json().then(function (data) {
                    longitude = data.coord.lon
                    latitude = data.coord.lat
                    getCurrentWeather(longitude, latitude);
                    return { longitude, latitude }
                });
            /*} else if (response.status === 404) {
                response.json().then(function (data) {
                    longitude = null
                    latitude = null
                    console.log(`City name \"${cityName}\" included in search was not found`)
                    document.querySelector(".container-master-weather").innerHTML = ''
                    console.log(`allWeatherContainer:  `, eAllWeatherContainer)
                    while (eWarningText.hasChildNodes()) {
                        eWarningText.removeChild(eWarningText.firstChild);
                    }
                    eWarningText.append(`City name is not found`)
                    return { longitude, latitude }
                });*/
            } else {
                console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN`)
                return;
            }
        })
};

function getCurrentWeather(longitude, latitude) {
    console.log(`--> getCurrentWeather - longitude, latitude value:  `, longitude + ', ', latitude);
    if (longitude && latitude) {
        var requestCurrentCity =  'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,daily,alerts&appid=' + key + '&units=imperial'
        fetch(requestCurrentCity)
            .then(function (response) {
                console.log(response.status);
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
                    // document.getElementById('all-weather-container').innerHTML('');
                    // document.getElementById('fiveday-container-dynamic').innerHTML('');
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
                console.log(response.status);
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
                    console.log(`--> fiveDayDataGet returned:  ${response.status}`)
                    console.log(`--> Clearing fiveDay data from HTML`)
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
    while (eWarningText.hasChildNodes()) {
        eWarningText.removeChild(eWarningText.lastChild);
    }
    cityName = $('#city-entry').val().trim().toLowerCase();
    console.log(`cityName SUBMITTED:  ${cityName}`);
    // cityNameFormatter(cityName);
    // storeCity(cityName);
    // currentWeather(nameCleaned);
    // getLonLat();
    cityNameValidator(cityName);
    storeCity(cityName);
    currentWeather();
    getLonLat();
};

/*
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
});
*/
$(document).ready(function(){
    $('.modal').modal();
  });

// document.querySelector('#nav-about').addEventListener('click', about());

init();