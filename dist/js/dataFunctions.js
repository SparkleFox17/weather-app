//const WEATHER_API_KEY = "F59a3ec92c88e62dd98edb38281c193d"; //remove breaks app 4:36:21 // api key

export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.setUnit(unit);
    }
};

export const getHomeLocation = () => {
    return localStorage.getItem(defaultWeatherLocation);
};

export const getWeatherFromCoords = async(locationObj) => {
    //const lat = locationObj.getlat();
    //const lon = locationObj.getlon();
    //const units = locationObj.getUnit();
    //const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
    //exclude=minutely,hourly,alerts&units=${units}&appid=${WEATHER_API_KEY}`;
    //try {
        //const weatherStream = awaitfetch(url);
        //const weatherJson = await weatherStream.json();
        //return weatherJson;
    //} catch (err) {
        //console.error(err);
    //}

    const urlDataObj = {
         lat: locationObj.getlat(),
         lon: locationObj.getlon(),
         units: locationObj.getUnit()
    };
    try {
        const weatherStream = awaitfetch("./.netlify/functions/get_weather", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const weatherJson = await weatherStream.json();
        return weatherJson;
    } catch (err) {
        console.error(err);
    }
};

export const getChoordsFromApi = async (entryText, units) => {
    const regex = /^\d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}
    &appid=${WEATHER_API_KEY}`;
    const encodedUrl = encodeURI(url);
    try {
       const dataStream = await fetch(encodedUrl);
       const jsonData = await dataStream.json();
       return jsonData;
    }catch (err) {
        console.error(err.stack);
    }
};  
 
const urlDataObj = {
    text: entryText,
    units: units
}

export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
}
