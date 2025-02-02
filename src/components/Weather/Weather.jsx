// libs
import { useState, useEffect } from "react";

// api
import API from "../../api/api";

// styles
import classes from "./styles.module.css";

export default function Weather() {
  const GEOLOCATION_STATUSES = {
    AWAIT_USER_PERMISSION: "AWAIT_USER_PERMISSION",
    DISABLE_PERMISSION_BY_USER: "DISABLE_PERMISSION_BY_USER",
    NOT_SUPPORTED: "NOT_SUPPORTED",
  };

  const [geolocationStatus, setGeolocationStatus] = useState(GEOLOCATION_STATUSES.AWAIT_USER_PERMISSION);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [isShowForecast, setIsShowForecast] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const dateFormatter = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    return formattedDate;
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          API.getUserWeatherByLatLon(lat, lon, (data) => {
            setWeatherData(data);
          });

          API.getUserWeatherForSevenDays(lat, lon, (data) => {
            setWeatherForecast(data);
          });
        },
        () => {
          setGeolocationStatus(GEOLOCATION_STATUSES.DISABLE_PERMISSION_BY_USER);
        }
      );
    } else {
      setGeolocationStatus(GEOLOCATION_STATUSES.NOT_SUPPORTED);
    }
  }, []);

  // calculate styles for every permission statuses
  let geolocationStatusStyles = "";
  let geolocationStatusText = "";

  switch(geolocationStatus) {
    case GEOLOCATION_STATUSES.AWAIT_USER_PERMISSION: {
      geolocationStatusText = "Weather Component";
      break;
    }
    case GEOLOCATION_STATUSES.DISABLE_PERMISSION_BY_USER: {
      geolocationStatusStyles = classes.DISABLE_PERMISSION_BY_USER;
      geolocationStatusText = "Enabled geolocation permission for weather view";
      break;
    }
    case GEOLOCATION_STATUSES.NOT_SUPPORTED: {
      geolocationStatusStyles = classes.NOT_SUPPORTED;
      geolocationStatusText = "Geolocation is not supported";
      break;
    }
  }

  const toggleForecast = () => {
    setIsShowForecast(prev => !prev);
  };

  const selectDay = (ind) => {
    weatherForecast[ind].name = weatherData.name;
    setWeatherData(weatherForecast[ind]);
    // toggleForecast();
  }

  return (
    <div className={classes.root}>
      {
        weatherData === null ? 
        <div className={`${classes.statusInfo} ${geolocationStatusStyles}`}>
          <p>{geolocationStatusText}</p>
        </div> : 
        <div className={classes.content}>
          <div className={classes.weatherInfoContainter}>
            <img className={classes.icon} src={`https://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`} alt="weather_icon" />

            <div>
              <p className={classes.temperature}>{Math.round(weatherData.main.temp - 273.15)}<span>°C</span></p>
            </div>

            <div className={classes.weatherInfo}>
              <p>Humidity: <span>{weatherData.main.humidity}%</span></p>
              <p>Precipitation: <span>{weatherData.rain ?? 0}%</span></p>
              <p>Wind: <span>{weatherData.wind.speed} km/h</span></p>
            </div>
          </div>

          <div className={classes.dateInfo}>
            <p className={classes.name}>{weatherData.name}</p>
            <p className={classes.date}>{dateFormatter(weatherData.date)}</p>
            <button className={classes.toggleButton} onClick={toggleForecast}>select other day</button>
          </div>

          {
            isShowForecast &&
            <div className={classes.weekDays}>
              {
                weatherForecast.map((wData, i) => 
                  <button onClick={() => selectDay(i)} key={i}>{wData.date}</button>
                )
              }
            </div>
          }
        </div>
      }
    </div>
  );
}
