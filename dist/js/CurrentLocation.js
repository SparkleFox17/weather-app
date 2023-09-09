export default class CurrentLocation {
    constructor() {  // contructor makes private variables an classes
        this._name = "Current Location";
        this._lat = null; // lat means latitude 
    }

    //getters & setters for diff properties below
    getName() {
        return this._name;
    }
    setName(name) {
        this._name = name;
    }

    getLat() {
        return this._lat;
    }

    setLat(lat) {
        this._lat = lat;
    }

    getLon() {
        return this._lon;
    }

    setLon(lon) {
        this._lon = lon;
    }

    getUnit() {
        return this._unit;
    }

    setUnit(unit) {
        this._unit = unit;
    }

    toggleUnit() {
        this._unit = this._unit === "imperial" ? "metric" : "imperial";
    }

}