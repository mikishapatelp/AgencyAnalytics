import React, { Component, Fragment } from "react";
import { WeatherState } from "../../interfaces/weather";
import "./Weather.css";

export class Weather extends Component<any, WeatherState> {
  constructor(props: any) {
    super(props);
    this.state = {
      citiesList: [
        { city: "MOSCOW", coordinates: { lat: 41.33675, lon: -75.518517 } },
        { city: "OTTAWA", coordinates: { lat: 38.61557, lon: -95.267754 } },
        { city: "TOKYO", coordinates: { lat: 35.689499, lon: 139.691711 } },
      ],
      currentClimate: {},
      activeCity: "",
      previousDaysClimate: [],
    };
  }

  componentDidMount() {
    this.getCurrentDetails(this.state.citiesList[0]);
  }

  updateResults(data: any) {
    let res: any = { current: data.current, daily: [] };
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var tempResult: any = [];
    for (let i = 1; i <= 5; i++) {
      let dayData: any = {};

      let unix_timestamp = data.daily[i]?.dt;
      let date = new Date(unix_timestamp * 1000);

      dayData.day = days[date.getDay()];

      let url = `http://openweathermap.org/img/wn/${data.daily[i]?.weather[0].icon}@2x.png`;
      dayData.weatherUrl = url;

      dayData.temp = data.daily[i]?.temp.day;
      res.daily.push(dayData);
      tempResult.push(dayData);
    }

    let todayClimate = tempResult.splice(0, 1)[0];
    let previousDaysClimate = tempResult;

    this.setState((prvState) => {
      return {
        ...prvState,
        currentClimate: todayClimate,
        previousDaysClimate: previousDaysClimate,
      };
    });
  }

  updateActiveCity(data: any) {
    const { city } = data;
    this.setState((prvState) => {
      return { ...prvState, activeCity: city };
    });
  }

  getCurrentDetails(cityData: any) {
    console.log(cityData);
    const {
      coordinates: { lat, lon },
    } = cityData;
    this.updateActiveCity(cityData);

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=0bc803e79bc9bbdf6bb6ebcf6f9463c8`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((res) => this.updateResults(res));
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="main">
            <div className="nav">
              <ul>
                {" "}
                {this.state.citiesList.map((data: any, index: any) => {
                  return (
                    <li key={index}>
                      <a
                        className={`nav-link ${
                          this.state?.activeCity === data?.city ? "active" : ""
                        }`}
                        onClick={() => this.getCurrentDetails(data)}
                      >
                        {data?.city}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="weather-box">
              <div className="today-weather">
                <p className="mb-20">Today</p>
                <img
                  src={this.state?.currentClimate?.weatherUrl}
                  alt="weather1"
                />
                <p className="weather1-info">
                  <span>{this.state?.currentClimate?.temp}</span>°F
                </p>
              </div>
              <div className="weather-details">
                {this.state?.previousDaysClimate.map(
                  (data: any, index: any) => {
                    return (
                      <Fragment key={index}>
                        <div className="weather-box-small wbs1">
                          <p>{data?.day}</p>
                          <img src={data?.weatherUrl} alt="weather" />
                          <p className="weather1-info">
                            <span>{data?.temp}</span>°
                          </p>
                        </div>
                      </Fragment>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
