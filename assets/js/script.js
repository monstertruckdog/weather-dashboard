var currentWeatherContainer = $('.current-weather-container');
// var currentWeatherBorder = $('#current-container-dynamic');
var currentWeatherHeadCity = $('<h4>');
var currentWeatherHeadDate = $('<span>');
var currentWeatherUoList = $('<ul>');
var currentWeatherListItem = $('<li>');
var cityEntry = $('#city-entry');
var citySubmitBtn = $('#submit-btn')

var currentDate = moment().format('MM/DD/YYYY');
var cityName

var key = `e8a298c777dff96133e6b579f54b4339`

function currentWeather() {
    
    currentWeatherContainer.attr('id', 'current-container-dynamic');
    currentWeatherContainer.text('');
    currentWeatherHeadCity.text(cityName);
    currentWeatherHeadDate.text(currentDate);
    console.log(`from getCurrentWeather - CITY NAME:  ${cityName}`);
    console.log(`from getCurrentWeather - CURRENT DATE:  ${currentDate}`);
    currentWeatherContainer.append('<h4 id="city-name">' + cityName + ' <span id="current-date">(' + currentDate + ')</span></h4>');

    getCurrentWeather();

};

function getCityValue() {
    cityName = $('#city-entry').val();
    console.log(`cityName SUBMITTED:  ${cityName}`);
    currentWeather();
};


function getLonLat() {
    var requestCurrentCity = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key
    
    fetch(requestCurrentCity)
        .then(function (response) {
            console.log(response.status);
            if (response.ok) {
                console.log(`response call was OK`);
                response.json().then(function (data) {
                    console.log(data);
                    var longitude = data.coord.lon
                    var latitude = data.coord.lat
                    var windspeed_test = data.wind.speed
                    console.log(`LONGITUDE:  ${longitude}`);
                    console.log(`WINDSPEED:  ${windspeed_test}`);
                    console.log(`LATITUDE:  ${latitude}`);
                    return longitude, latitude
                    // return response.json();
                });
            } else {
                console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN`)
                return;
            }
        })
};


// TEMP
// WIND
// HUMIDITY
// UV INDEX

async function getCurrentWeather() {
    getLonLat();
    console.log(`LONGITUDE / LATITUDE (inside getCurrentWeather:  ${longitude} / ${latitude}}`);
    var currentWeatherValuesArray = []
    var requestCurrentCity =  'http://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,daily,alerts&appid=' + key + '&units=imperial'
    
    fetch(requestCurrentCity)
        .then(function (response) {
            console.log(response.status);
            if (response.ok) {
                console.log(`response call was OK`);
                response.json().then(function (data) {
                    console.log(data);
                    currentWeatherValuesArray.push(data.current.temp);
                    currentWeatherValuesArray.push(data.current.wind_speed);
                    currentWeatherValuesArray.push(data.current.humidity);
                    currentWeatherValuesArray.push(data.current.uvi);

                    console.log(`LONGITUDE:  ${longitude}`);
                    console.log(`LATITUDE:  ${latitude}`);
                    console.log(`CURRENT WEATHER VALUES:  ${currentWeatherValuesArray}`)
                    // return response.json();
                });
            } else {
                console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN`)
                return;
            }
        });

    var currentWeatherValuesList = $('<ul>');
    currentWeatherValuesList.attr('class', 'current-weather-values-ul');
    currentWeatherContainer.append(currentWeatherValuesList);
    currentWeatherValuesList.append('<li class="temp-li">' + currentWeatherValuesArray[0] + '°F</li>');
    currentWeatherValuesList.append('<li class="wind-li">' + currentWeatherValuesArray[1] + 'MPH</li>');
    currentWeatherValuesList.append('<li class="humidity-li">' + currentWeatherValuesArray[2] + '%</li>');
    currentWeatherValuesList.append('<li class="uvi-li"><span class="uvi-li-span>' + currentWeatherValuesArray[3] + '</span></li>');
    
    // Used UV Index category definitions from National Weather Service Climate Prediction Center:
    // URL:  https://www.cpc.ncep.noaa.gov/products/stratosphere/uv_index/uv_info.shtml

    if (currentWeatherValuesArray[3] >= 0 && currentWeatherValuesArray[3] < 3) {
        $('.uvi-li-span').setAttr('id', 'uvi-minimal');
    } else if (currentWeatherValuesArray[3] >= 3 && currentWeatherValuesArray[3] < 5) {
        $('.uvi-li-span').setAttr('id', 'uvi-low');
    } else if (currentWeatherValuesArray[3] >= 5 && currentWeatherValuesArray[3] < 7) {
        $('.uvi-li-span').setAttr('id', 'uvi-moderate');
    } else if (currentWeatherValuesArray[3] >= 7 && currentWeatherValuesArray[3] < 10) {
        $('.uvi-li-span').setAttr('id', 'uvi-high');
    } else if (currentWeatherValuesArray[3] >= 10) {
        $('.uvi-li-span').setAttr('id', 'uvi-very-high');
    };
};