import React, { useState, useEffect } from "react";
import axios from "axios";

function WeatherCard() {
    const [weatherData, setWeatherData] = useState({ temp: null, state: null, iconId: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Check if within rate limit
                if (!isRateLimited()) {
                    const response = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
                        params: {
                            lat: "30.07",
                            lon: "31.34",
                            units: "metric",
                            appid: import.meta.env.VITE_OWM_API_KEY
                        }
                    });
                    let weatherTempNow = response.data.main.temp;
                    let roundedTempNow = Math.round(weatherTempNow);
                    setWeatherData(wd => ({ ...wd, temp: roundedTempNow }));
                    let weatherStateNow = response.data.weather[0].description;
                    setWeatherData(wd => ({ ...wd, state: toTitleCase(weatherStateNow) }));
                    let weatherIconIdNow = response.data.weather[0].icon;
                    setWeatherData(wd => ({ ...wd, iconId: weatherIconIdNow }));

                    // Update rate limit timestamp
                    updateRateLimit();
                } else {
                    // Handle rate limit exceeded
                    setError("Rate limit exceeded. Please wait before refreshing.");
                }
            } catch (error) {
                setError(error.message);
                console.error(error);
            }
        };

        fetchWeatherData();
    }, []);

    const toTitleCase = (string) => {
        return string
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const isRateLimited = () => {
        const now = new Date().getTime();
        const rateLimitCount = parseInt(localStorage.getItem('rateLimitCount')) || 0;
        const rateLimitTimestamp = parseInt(localStorage.getItem('rateLimitTimestamp')) || 0;

        // Check if more than 20 requests were made in the last hour
        return rateLimitCount >= 20 && (now - rateLimitTimestamp) < (60 * 60 * 1000); // 1 hour in milliseconds
    };

    const updateRateLimit = () => {
        const now = new Date().getTime();
        const rateLimitCount = parseInt(localStorage.getItem('rateLimitCount')) || 0;

        localStorage.setItem('rateLimitCount', rateLimitCount + 1);
        localStorage.setItem('rateLimitTimestamp', now);
    };

    const iconMap = {
        "01d": "climacon-sunny.svg",
        "01n": "climacon-clear-night.svg",
        "02d": "climacon-partly-cloudy-day.svg",
        "02n": "climacon-partly-cloudy-night.svg",
        "03d": "climacon-cloudy.svg",
        "03n": "climacon-cloudy.svg",
        "04d": "climacon-mostly-cloudy-day.svg",
        "04n": "climacon-mostly-cloudy-night.svg",
        "09d": "climacon-scattered-showers.svg",
        "09n": "climacon-scattered-showers.svg",
        "10d": "climacon-rain.svg",
        "10n": "climacon-rain.svg",
        "11d": "climacon-thunder.svg",
        "11n": "climacon-thunder.svg",
        "13d": "climacon-snow.svg",
        "13n": "climacon-snow.svg",
        "50d": "climacon-fog.svg",
        "50n": "climacon-fog.svg"
        // Add more mappings as needed
    };

    const iconsPath = "/nai-notion-widgets2/src/assets/weathericons/";
    const owmId2Climacon = iconMap[weatherData.iconId] || "climacon-unknown.svg";
    const climacon = iconsPath + owmId2Climacon;

    if (error) {
        return (
            <div className="card">
                <span className="card-container">
                    <h2>Error: {error}</h2>
                </span>
            </div>
        );
    }

    return (
        <div className="card">
            <span className="card-container">
                <img className="weather-icon" src={climacon} alt={weatherData.iconId} />
                <h1 className="weather-temp">{weatherData.temp}℃</h1>
                <p>{weatherData.state}</p>
            </span>
        </div>
    );
}

export default WeatherCard;
