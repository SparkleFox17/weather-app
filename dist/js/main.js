import { 
    setLocationObject,
    getHomeLocation,
    getWeatherFromCoords,
    getChoordsFromApi,
    cleanText 
} from "./dataFunctions.js";
import { 
    setPlaceHolderText,
    addSpinner,
    displayError,
    displayApiError,
    updateScreenreaderConfirmation,
    updateDisplay
 } from "./domFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
    // add listeners
    const geoButton = document.getElementById("getLocation");
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    saveButton = document.getElementById("saveLocation");
    saveButton.addEventListener("click", saveLocation);
    const unitButton = getElementById("unit");
    unitButton.addEventListener("click", setUnitPref);
    const refreshButton = getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);
    const locationEntry = getElementById("searchbar__form");
    locationEntry.addEventListener("submit", submitNewLocation);
    
    // set up 
    setPlaceHolderText();

    // weather
    loadWeather();
}

Document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
    if (event) {
        if (event.type === "click") {
            const mapIcon = document.querySelector(".fa-map-marker-alt");
            addSpinner(mapIcon);
        }
    }
    if (!navigator.geolocation) GeoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
    const errMsg = errObj.message ? errObj.message : "Geolocation not supported";
    displayError(errMsg,errMsg);
}

const geoSuccess = (position) => {
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `lat:${position.choords.latitude} long:${position.coords.longitude}`  
    };
    setLocationObject(currentLoc, myCoordsObj); 
    updateDataAndDisplay(currentloc);
}

const loadWeather = (event) => {
    const saveLocation = getHomeLocation();
    if (!savedLocation && !event) 
    return getGeoWeather();
    if (!savedLocation && event.type === "click") {
        displayError(
            "No Home Location Saved.",
            "Sorry, Please save your home location first."
        );
    } else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    } else {
        const homeIcon = document.querySelector("fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
}

const displayHomeLocationWeather = (home) => {
    if(typeof home === "string" ) {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name,
            unit: locationJson.unit,
        }
        setLocationObject(currentloc, myCoordsObj);
        updateDataAndDisplay(currentloc);
    }
}

const saveLocation = () => {
    if(currentloc.getLat() && currentloc.getLon()) {
        const saveIcon = document.querySelector(".fa-save");
        addSpinner(saveIcon);
        const location = {
            name: currentloc.getName(),
            lat: currentloc.getlat(),
            lon: currentloc.getlon(),
            unit: currentloc.getunit()
        }
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
        updateScreenReaderConfirmation(
            `Saved ${currentloc.getName()} as home location.`
        ); 
    }
};

const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner("unitIcon");
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
}

const refreshWeather = () => {
    const refreshIcon = document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc);
}

const submitNewLocation = async (event) => {
    event.preventDefault();
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    if(!entryText.length) return;
    const locationIcon = document.querySelector(".fa-search");
    addSpinner(locationIcon);
    const choordsData = await getChoordsFromApi(entryText, currentLoc,getUnit());
    if(choordsData) {
        if(choordsData.cod === 200) { // code or COD 
            const myCoordsObj = {
                lat: coordsData.Coords.lat,
                lon: coordsData.Coords.lon,
                name: coordsData.sys.country
                ? `${coordsData.name}, ${coordsData.sys.country}` 
                : coordsData.name
            };
            setLocationObject(currentLoc, myCoordsObj);
            updateDataAndDisplay(currentLoc);
        } else {
            displayApiError(choordsData);
        }
    } else {
        displayError("Connection Error", "Connection Error");
    }
};

const updateDataAndDisplay = async (locationObj) => {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) updateDisplay(weatherJson, locationObj);
}