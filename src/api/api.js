class API {
  static #API_VERSION = "2.5";
  static #API_KEY = "8e2a16c8657482beaaec9bc87370f9ca";
  static #URL = "https://api.openweathermap.org/data";
  static #URL_WEATHER = `${API.#URL}/${API.#API_VERSION}/weather`;
  static #URL_FORECAST = `${API.#URL}/${API.#API_VERSION}/forecast`;

  static getUserWeatherByLatLon(lat, lon, response = () => {}, reject = () => {}) {
    fetch(`${API.#URL_WEATHER}?lat=${lat}&lon=${lon}&appid=${API.#API_KEY}`)
    .then(r => {
      if (r.status > 400) {
        reject(r.status);
      }

      return r.json();
    })
    .then(d => {
      d.date = new Date();
      response(d);
    });
  }

  static getUserWeatherForSevenDays(lat, lon, response = () => {}, reject = () => {}) {
    fetch(`${API.#URL_FORECAST}?lat=${lat}&lon=${lon}&appid=${API.#API_KEY}`)
    .then(r => {
      if (r.status > 400) {
        reject(r.status);
      }

      return r.json();
    })
    .then(d => {
      let daysData = new Map(); // [date, [count, temp summary, data(object)]]

      // calculating intermediate temperature
      for (let i = 0; i < d.list.length; ++i) {
        const wData = d.list[i];
        const [date] = wData.dt_txt.split(" ");

        if (daysData.has(date)) {
          const [count, tempSum, data] = daysData.get(date);
          daysData.set(date, [count + 1, tempSum + wData.main.temp, data]);
        } else {
          daysData.set(date, [1, wData.main.temp, wData]);
        }
      }
      
      // converting calculated data to array
      daysData = Array.from(daysData, ([date, value]) => {
        const weatherData = value[2];
        weatherData.main.temp = value[1] / value[0];
        weatherData.date = date;
        return weatherData;
      });

      response(daysData);
    });
  }
}

export default API;