import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { TiWeatherCloudy } from "react-icons/ti";
import { FaSkyatlas } from "react-icons/fa6";
import { WiCloudyWindy } from "react-icons/wi";
import { RiSunFoggyLine } from "react-icons/ri";
import axios from "axios";
import DailyCard from "./Component/DailyCard";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { FaTemperatureArrowUp } from "react-icons/fa6";

// {
//     name: "Delhi",
//     sys: {
//       country: "IN",
//       sunrise: 1716775800,
//       sunset: 1716823200,
//     },
//     main: {
//       temp: 38.5,
//       feels_like: 41.2,
//       temp_min: 35.0,
//       temp_max: 40.1,
//       humidity: 28,
//       pressure: 1002,
//     },
//     weather: [
//       {
//         main: "Clear",
//         description: "clear sky",
//         icon: "01d",
//       },
//     ],
//     wind: {
//       speed: 4.2,
//       deg: 270,
//     },
//     visibility: 10000,
//     clouds: { all: 0 },
//   }

const App = () => {
  const API_KEY= import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const[cityName, setCityName]= useState("Delhi");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [forecastData, setForecastData] = useState(null);


  const groupByDate = (list) =>{
    const grouped = {};

    list.forEach((item) =>{
      const date = new Date(item.dt*1000).toLocaleString("en-IN", {
        day:"numeric",
        month:"short",
      });

      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item);
    });
    return grouped;
  }

  const getDailyForecast = (list) =>{
    const grouped = groupByDate(list);
    return Object.entries(grouped).map(([date,entries]) =>{
      const midDay = entries[Math.floor(entries.length/2)];
      return {
        date,
        temp: midDay.main.temp,
        feels_like: midDay.main.feels_like,
        weather: midDay.weather[0].description,
        icon: midDay.weather[0].icon,
        humidity: midDay.main.humidity,
        wind: midDay.wind.speed,
      };
    });

  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&&units=metric`,
      );
      // console.log(data);
      const forecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&&units=metric`
      )

      // console.log(forecast);
      const dailyForecast = getDailyForecast(forecast.data.list);
      // console.log(dailyForecast);
      setData(data);
      setForecastData(dailyForecast);
      setCityName("");
    };
    loadData();
  }, [isLoading]);

  const loadHandler = () => {
    setIsLoading(!isLoading);
  };

  if (!data) {
    return <h1 style={{margin:"auto",color: "white"}}>Loading...</h1>
  }

  return (

    <div className="app-container">
      <div className="search-bar">
        <input type="text" placeholder="Enter your city name" 
        name="city" value={cityName} 
        onChange={(e)=>{
          setCityName(e.target.value)
        }}
         />
        <button onClick={loadHandler}>Load Data</button>
      </div>
      <div>
        <div className="top-detail">
          <div className="top-card">
            <div className="logo-container">
            {/* <TiWeatherCloudy size={70} style={{color:"white"} } className="weather-logo"/> */}
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              className="weather-logo"
            />
            <p className="place-name">
              {data.name}, {data.sys.country}
            </p>
            <p>{data.main.temp}&#xb0; C</p>
          </div>
          <div className="right-container">
            <div>
              <TiWeatherCloudy size={18} />
              <p>Feels like: {data.main.feels_like}&#xb0; C</p>
            </div>
            <div>
              <FaSkyatlas size={18} />
              <p>{capitalize(data.weather[0].description)}</p>
            </div>
            <div>
              <WiCloudyWindy size={18} />
              <p>{data.wind.speed} m/sec</p>
            </div>
            <div>
              <FaTemperatureArrowDown size={18} />
              <p >Min Temp: {data.main.temp_min}&#xb0; C</p>
            </div>
            <div>
              <FaTemperatureArrowUp size={18} />
              <p>Max Temp: {data.main.temp_max}&#xb0; C</p>
            </div>
            <div>
              <RiSunFoggyLine size={18} />
              <p title="visibility">{data.visibility/1000} km</p>
            </div>
          </div>
          </div>
        </div>

        <div className="bottom-detail">
          <p>5 Days Forecast</p>
          <hr />
          <div className="forecast-container">
            {
              forecastData.map((item) =>{
                return <DailyCard capitalize={capitalize}data={item}/>
              })
            }
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default App;
