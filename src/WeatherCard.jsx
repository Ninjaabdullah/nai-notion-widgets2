import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function WeatherCard() {
    const [weatherData, setWeatherData] = useState({ temp: null, state: null, iconId: null });
    const [error, setError] = useState(null);

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

        // Check if an hour has passed since the last request
        if ((now - rateLimitTimestamp) >= (60 * 60 * 1000)) {
            // Reset the count and timestamp if more than an hour has passed
            localStorage.setItem('rateLimitCount', '0');
            localStorage.setItem('rateLimitTimestamp', now.toString());
            return false;
        }

        return rateLimitCount >= 20;
    };

    const updateRateLimit = () => {
        const now = new Date().getTime();
        const rateLimitCount = parseInt(localStorage.getItem('rateLimitCount')) || 0;

        localStorage.setItem('rateLimitCount', (rateLimitCount + 1).toString());
        localStorage.setItem('rateLimitTimestamp', now.toString());
    };

    const fetchWeatherData = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, 900000);
        return () => clearInterval(intervalId);
    }, [fetchWeatherData]);

    const iconMap = {
        "01d": "climacon-sun.svg",
        "01n": "climacon-moon.svg",
        "02d": "climacon-cloudSun.svg",
        "02n": "climacon-cloudMoon.svg",
        "03d": "climacon-cloud.svg",
        "03n": "climacon-cloud.svg",
        "04d": "climacon-cloud.svg",
        "04n": "climacon-cloud.svg",
        "09d": "climacon-cloudRain.svg",
        "09n": "climacon-cloudRain.svg",
        "10d": "climacon-cloudRainSun.svg",
        "10n": "climacon-cloudRainMoon.svg",
        "11d": "climacon-cloudLighting.svg",
        "11n": "climacon-cloudLighting.svg",
        "13d": "climacon-snowflake.svg",
        "13n": "climacon-snowflake.svg",
        "50d": "climacon-cloudFogAlt.svg",
        "50n": "climacon-cloudFogAlt.svg"
        // Add more mappings as needed
    };

    const iconsPath = "/nai-notion-widgets2/weathericons/";
    const owmId2Climacon = iconMap[weatherData.iconId] || "climacon-cloud.svg";
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
