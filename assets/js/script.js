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

    // RENOVATION getCurrentWeather();
    getLonLat();

};

function getCityValue() {
    cityName = $('#city-entry').val();
    console.log(`cityName SUBMITTED:  ${cityName}`);
    currentWeather();
};


function getLonLat() {
    var requestCurrentCity = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key
    
    fetch(requestCurrentCity)
        .then(function (response) {
            console.log(response.status);
            if (response.ok) {
                console.log(`response call was OK`);
                response.json().then(function (data) {
                    console.log(data);
                    var longitude = data.coord.lon
                    var latitude = data.coord.lat
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


// TEMP
// WIND
// HUMIDITY
// UV INDEX

function getCurrentWeather(longitude, latitude) {
    if (longitude && latitude) {
        console.log(`LONGITUDE / LATITUDE (inside getCurrentWeather:  ${longitude} / ${latitude}`);
        var requestCurrentCity =  'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=hourly,minutely,daily,alerts&appid=' + key + '&units=imperial'
    
        fetch(requestCurrentCity)
            .then(function (response) {
                console.log(response.status);
                if (response.ok) {
                    console.log(`response call was OK`);
                    response.json().then(function (data) {
                        console.log(data);
                        console.log(`LONGITUDE:  ${longitude}`);
                        console.log(`LATITUDE:  ${latitude}`);

                        var currentWeatherValuesList = $('<ul>');
                        currentWeatherValuesList.attr('class', 'current-weather-values-ul');
                        currentWeatherContainer.append(currentWeatherValuesList);
                        currentWeatherValuesList.append('<li class="current-li temp-li">TEMPERATURE:  ' + data.current.temp + '°F</li>');
                        currentWeatherValuesList.append('<li class="current-li wind-li">WIND SPEED:  ' + data.current.wind_speed + 'MPH</li>');
                        currentWeatherValuesList.append('<li class="current-li humidity-li">HUMIDITY:  ' + data.current.humidity + '%</li>');
                        currentWeatherValuesList.append('<li class="current-li uvi-li">UV INDEX:  <span class="uvi-li-span">' + data.current.uvi + '</span></li>');

                        if (data.current.uvi >= 0 && data.current.uvi < 3) {
                            console.log(`INSIDE SPAN`)
                            var uVIndex = $('.uvi-li-span');
                            $('.uvi-li-span').attr('id', 'uvi-minimal');
                        } else if (data.current.uvi >= 3 && data.current.uvi < 5) {
                            $('.uvi-li-span').attr('id', 'uvi-low');
                        } else if (data.current.uvi >= 5 && data.current.uvi < 7) {
                            uVIndex.attr('id', 'uvi-moderate');
                        } else if (data.current.uvi >= 7 && data.current.uvi < 10) {
                            uVIndex.attr('id', 'uvi-high');
                        } else if (data.current.uvi >= 10) {
                            uVIndex.attr('id', 'uvi-very-high');
                        };

                        var fiveDayDataGet = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + key + '&units=imperial'

                        fetch(fiveDayDataGet)
                            .then(function (response) {
                                console.log(response.status);
                                if (response.ok) {
                                    console.log(`response call was OK`);
                                    response.json().then(function (data) {
                                        console.log(data);
                                        console.log(`LONGITUDE:  ${longitude}`);
                                        console.log(`LATITUDE:  ${latitude}`);
                                        console.log(`LENGTH OF OBJECT:  ${data.list.length}`)
                                        
                                        $('.fiveday-container').append('<h4 id="fiveday-title">5-Day Forecast:</h4>');
                                        $('.fiveday-container').append('<div class="fiveday-card-container"></div>');
                                        $('.fiveday-card-container').append('<div class="fiveday-card" id="day-1">CARD 1</div>')

                                        var dayData = []
                                        for (var i = 0; i < 5; i += 8) {
                                            dayData.push(data.list[i])
                                            console.log(`ITERATION ${i}:  ${dayData}`);
                                        }
                                    
                                    })
                                }
                            });
                    });
                } else {
                    console.log(`AN ERROR HAS OCCURRED IN THE GET METHOD TO THE API.  PLEASE REVIEW AND TRY AGAIN`);
                    return;
                };

            });
    };
};