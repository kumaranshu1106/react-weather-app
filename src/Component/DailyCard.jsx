import React from "react";
import { WiHumidity } from "react-icons/wi";
import { WiWindy } from "react-icons/wi";

const DailyCard = ({ data ,capitalize}) => {
  return (
    <div className="daily-card">
      <div className="image-container">
        <img src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} />
      </div>
      <div className="info-div">
        <div className="date-div">
          <span className="date-text">{data.date}</span>
          <span className="weather-text">{capitalize(data.weather)}</span>
        </div>
        <div className="temp-div">Temp: {data.temp}&#xb0; C</div>
        <div className="Feels-like">Feels like: {data.feels_like}&#xb0; C</div>
        <div className="bottom-div">
          <span className="humidity">
            <WiHumidity size={21} />
            {data.humidity}%
          </span>
          <span className="wind">
            <WiWindy size={25} />
            <span>{data.wind} m/s</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyCard;
