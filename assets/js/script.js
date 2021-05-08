var currentWeather = $('.current-container');
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
    currentWeather.append(currentWeatherHeadCity);
    currentWeather.attr('id', 'current-container-dynamic');
    currentWeatherHeadCity.text(cityName);
    currentWeatherHeadCity.append(currentWeatherHeadDate)
    currentWeatherHeadDate.text(' (' + currentDate + ')');

};

function getCityValue() {
    cityName = $('#city-entry').value;
    console.log(`cityName SUBMITTED:  ${cityName}`);
    getCurrentWeather()
};

;