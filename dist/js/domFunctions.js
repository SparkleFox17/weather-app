export const setPlaceHolderText = () => {
    const input = document.getElementById("searchBar__text");
    window.innerWidth < 400 
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country, or Zip Code");
};

export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
    element.classList.toggle("none"); //hide
    element.nextElementSibling.classList.toggle("block") //show
    element.nextElementSibling.classList.toggle("none") // hide
}

export const displayError = (headerMsg, srMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenreaderConfirmation(srMsg);
}

export const displayApiError = (statusCode) => {
    const properMsg = toProperCase(statusCode.message);
    updateProperLocationHeader(properMsg);
    updateScreenreaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
    const words = text.split(" ");
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
}


const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById(currentForecast__location);
    if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
        const messageArray = message.split(" ");
        const mapArray = msgArray.map(msg => {
            return msg.replace(":", ": ");
        })
        const lat = 
        msgArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice[0, 11];
        const lon = 
        msgArray[1].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice[0, 12];
        h1.textContent = `${lat} * ${lon}`;

    } else {
        h1.textContent = message;
    };
}

export const updateScreenreaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
}

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();
    const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
    setBGImage(weatherClass);
    const screenReaderWeather = buildScreenReaderWeather(
        weatherJson,
        locationObj
    );
    updateScreenreaderConfirmation(screenReaderWeather);
    updateScreenreaderConfirmation(WeatherObj.getName());
    // current conditions
    const ccArray = updateScreenreaderConfirmationDivs(
        weatherJson,
        locationObj.getUnit()
    );
    displayCurrentConditions(ccArray);
    displaySixDayForecast(weatherJson);
    setFocusOnSearch();
    fadeDisplay();
}

const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toggle("fade-in");

    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle("zero-vis");
    sixDay.classList.toggle("fade-in");
}

const clearDisplay = () => {
    const currentConditions = document.getElementById("currentForecast__conditions");
    deleteContents(currentConditions);
    const sixDayForecast =  document.getElementById("dailyForecast__contents");
    deleteContents(sixDayForecast);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const getWeatherClass = (icon) => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookup = {
        "09" : "snow",
        10 : "rain",
        11 : "rain",
        13 : "snow",
        50 : "fog"
    };
    let weatherClass;
    if (weatherLookup[firstChars]) {
        weatherClass = weatherLookup[firstTwoChars];
    } else if (lastChar === "d") {
        weatherClass = "clouds";
    } else {
        weatherClass = "night";
    }
    return weatherClass;
}

const setBGImage = (weatherClass) => {
    document.documentElement.classList.add(weatherClass); 
    document.documentElement.classList.forEach(img => {
        if ( img !== weatherClass) document.documentElement.classList.remove(img);
    });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    const unit = locationObj.getUnit();
    const tempUnit = unit === "imperial" ? "F" : "C";
    return `${weatherJson.current.weather[0].description} and ${Math.round(Number
    (weatherJson.current.temp))}º$(tempUnit) in ${location}`;
};

const setFocusOnSearch = () => {
    document.getElementById("searchBar__text").focus(); 
};

const createCurrentConditionsDiv = (weatherObj, unit) => {
    const tempUnit = unit === "imperial" ? "F" : "C";
    const windUnit = unit === "imperial" ? "mph": "m/s";
    const icon = createMainImgDiv (
        weatherObj.current.weather[0].icon,
        weatherObj.current.weather[0].desciption
    );

    const temp = createElem(
    "div","temp",
    `$Math{Math.round(Number(weatherObj.current.temp))}º`
    );
    const properDesc = toProperCase(weatherObj.current.weather[0].description);
    const desc = createElem("div", "desc", properDesc);
    const feels =  createElem(
    "div",
    "feels",
    `feels like ${Math.round(Number(weatherObj.current.feels_like))}º`
    );  
    const maxTemp = createElem(
    "div",
    "maxTemp",
    `High ${Math.round(Number(weatherObj.daily[0].temp.max))}º`);  
    const minTemp = createElem(
    "div",
    "minTemp", 
    `Low ${Math.round(Number(weatherObj.daily[0].temp.min))}º`); 
    const humidity = createElem(
    "div",
    "humidity"
    `Humidity ${weatherObj.current.humidity}%`); 
    const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
    );  
    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
    const iconDiv = createElem("div", "icon");
    iconDiv.id = "icon";
    const faIcon = translateIconToFontAwesome(icon);    
    faIcon.ariaHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
}; 

const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.divClassName = divClassName;
    if (divText) {
        div.textContent = divText;
    }
    if (divClassName === "temp") {
        const unitDiv = document.createElement("div");
        unitDiv.classList.add("unit");
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
};

const translateIconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch(firstTwoChars) {
        case "01":
            if(lastChar ==="d") {
                i.classList.add("far", "fa-sun");
            } else {
                i.classList.add("far", "fa-moon");
            }
            break;
            case "02":
            if(lastChar ==="d") {
                i.classList.add("fas", "fa-cloud-sun");
            } else {
                i.classList.add("fas", "fa-cloud-moon");
            }
            break;
            case "03":
                i.classList.add("fas", "fa-cloud");
            break;
            case "04":
                i.classList.add("fas", "fa-cloud-meatball");
            break;
            case "09":
                i.classList.add("fas", "fa-cloud-rain");
            break;
            case "10":
            if(lastChar ==="d") {
                i.classList.add("fas", "fa-cloud-sun-rain");
            } else {
                i.classList.add("fas", "fa-cloud-moon-rain");
            }
            break;
            case "11":
                i.classList.add("fas", "fa-poo-storm");
            break;
            case "13":
                i.classList.add("far", "fa-snowflake");
            break;
            case "50":
                i.classList.add("fas", "fa-smog");
                break;
            default: 
                i.classList.add("far", "fa-question-circle");
            }
        return i;
    }

    const displayCurrentConditions = (CurrentConditionsArray) => {
        const ccContainer = document.getElementById("currentForecast__conditions");
        CurrentConditionsArray.forEach(cc => {
            ccContainer.appendChild(cc);
        });
    };

    const displaySixDayForecast = (weatherJson) => {
        for (let i = 1; i <= 6; i++) {
            const dfArray = createDailyForecastDivs(weatherJson.daily[i]); 
            displaySixDayForecast(dfArray);
        }
        
    }

    createDailyForecastDivs = (dayWeather) => {
        const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
        const dayAbbreviation = createElem(
            "p", 
            "dayAbbreviation", 
            dayAbbreviationText
            );
            const dayIcon = createDailyForecastIcon(
                dayWeather.weather[0].icon, 
                dayWeather.weather[0].desciption
            );
            const dayHigh = createElem(
                "p", 
                "dayHigh", 
                `${Math.round(Number(dayWeather.temp.max))}\xB0` //&deg; html / js \xB0 need the js deg//
        );
        const dayLow = createElem
        ("p",
         "dayLow", 
         `${Math.round(Number(dayWeather.temp.min))}\xB0` //&deg; html / js \xB0 need the js deg//
        );
        return [dayAbbreviation. dayIcon, dayHigh, dayLow];
    };

    const getDayAbbreviation = (data) => {
        const dateObj = new Date(data * 1000);
        const utcString = dateObj.toUTCString();
        return utcString.slice(0, 3).toUpperCase();
    };

    const createDailyForecastIcon = (icon, altText) => {
        const img = document.createElement("img");
        if (window.innerWidth < 768 || window.innerHeight < 1025) {
            img.src = `https://openweathermap.org/img/wn/${icon}.png`;  
        } else {
            img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;  
        }
        img.alt = altText;
        return img;
    }

    const displayDailyForecast = (dfArray) => {
        const dayDiv = createElem("div", "forecastDay");
        dfArray.forEach(el => {
            dayDiv.appendChild(el);
        });
        const dailyForecastContainer = document.getElementById(
            "dailyForecast__contents"
        );
        dailyForecastContainer.appendChild(dayDiv);
    }





 




