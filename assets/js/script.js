var currentWeather = $('.current-weather-container');
// var currentWeatherBorder = $('#current-container-dynamic');
var currentWeatherHeadCity = $('<h4>');
var currentWeatherHeadDate = $('<span>');
var currentWeatherUoList = $('<ul>');
var currentWeatherListItem = $('<li>');
var cityEntry = $('#city-entry');
var citySubmitBtn = $('#submit-btn')

var currentDate = moment().format('MM/DD/YYYY');
var cityName

function getCurrentWeather() {
    
    currentWeather.attr('id', 'current-container-dynamic');
    currentWeatherHeadCity.text(cityName);
    currentWeatherHeadDate.text(currentDate);
    console.log(`from getCurrentWeather - CITY NAME:  ${cityName}`);
    console.log(`from getCurrentWeather - CURRENT DATE:  ${currentDate}`);
    // currentWeatherHeadDate.text(' (' + currentDate + ')');
    
    // currentWeather.append(currentWeatherHeadCity);
    //currentWeatherHeadCity.append(currentWeatherHeadDate)currentWeather.append(currentWeatherHeadCity);
    currentWeather.append(cityName + ' <span id="current-date">(' + currentDate + ')</span>');

    

};

function getCityValue() {
    cityName = $('#city-entry').val();
    console.log(`cityName SUBMITTED:  ${cityName}`);
    getCurrentWeather()
};

;