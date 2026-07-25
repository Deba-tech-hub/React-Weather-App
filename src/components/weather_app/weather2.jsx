import axios from "axios";
import moment from "moment";
import {useEffect,useState} from "react";

export function Weather(){

const[page,setPage]=useState("weather");
const[now]=useState(new Date());
const[changingCityName,setChangingCityName]=useState("");
const[submitCityName,setSubmitCityName]=useState("Hyderabad");

const[weatherObj,setWeatherObj]=useState({
weather:[{main:"",description:"",icon:""}],
main:{temp:0,humidity:0,feels_like:0},
wind:{speed:0},
coord:{lat:0,lon:0},
name:""
});

const[forecast,setForecast]=useState([]);
const[savedCities,setSavedCities]=useState([]);

const[air,setAir]=useState({
list:[{
main:{aqi:0},
components:{co:0,no2:0,o3:0,pm2_5:0,pm10:0}
}]
});

function handleCityChange(e){
setChangingCityName(e.target.value);
}

function handleSearchClick(){
if(changingCityName==="") return;
setSubmitCityName(changingCityName);
}

function LoadWeather(){
axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${submitCityName}&appid=a219484079b512cf8ade54d609760a71`)
.then(res=>{

setWeatherObj(res.data);

if(!savedCities.includes(res.data.name)){
setSavedCities(prev=>[...prev,res.data.name]);
}

LoadAir(res.data.coord.lat,res.data.coord.lon);

})
.catch(()=>alert("City Not Found"));
}

function LoadForecast(){
axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${submitCityName}&appid=a219484079b512cf8ade54d609760a71`)
.then(res=>setForecast(res.data.list));
}

function LoadAir(lat,lon){
axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=a219484079b512cf8ade54d609760a71`)
.then(res=>setAir(res.data));
}

useEffect(()=>{
LoadWeather();
LoadForecast();
},[submitCityName]);

let weatherImage="/sunny.jpg";

switch(weatherObj.weather[0].main){

case "Clouds":
weatherImage="/cloud.jpg";
break;

case "Rain":
case "Drizzle":
weatherImage="/rain.jpg";
break;

case "Thunderstorm":
weatherImage="/thunderstorm.jpg";
break;

case "Snow":
weatherImage="/snow.jpg";
break;

case "Mist":
case "Fog":
case "Haze":
weatherImage="/mist.jpg";
break;

default:
weatherImage="/sunny.jpg";

}

let windImage="/air.jpg";

if(weatherObj.wind.speed<3){
windImage="/wind-light.jpg";
}
else if(weatherObj.wind.speed<8){
windImage="/wind-medium.jpg";
}
else{
windImage="/wind-strong.jpg";
}

const msg={
Clear:"Beautiful Sunny Day ☀",
Clouds:"Cloudy Weather ☁",
Rain:"Carry Umbrella 🌧",
Drizzle:"Light Rain 🌦",
Thunderstorm:"Stay Safe ⛈",
Snow:"Snowfall ❄",
Mist:"Drive Carefully 🌫"
};

const weatherMsg=msg[weatherObj.weather[0].main]||"Have a Nice Day";

return(

<div
className="container-fluid py-4"
style={{
minHeight:"100vh",
background:"linear-gradient(135deg,#74ebd5,#9face6)"
}}
>

<header
className="d-flex justify-content-between align-items-center rounded-4 shadow-lg px-4 py-3 mb-4"
style={{
background:"rgba(255,255,255,.35)",
backdropFilter:"blur(12px)"
}}
>

<h3 className="fw-bold text-dark mb-0">
<span className="bi bi-cloud-fill"></span>
Weather App
</h3>

<div className="input-group w-50">

<input
className="form-control"
placeholder="Search City"
value={changingCityName}
onChange={handleCityChange}
onKeyDown={(e)=>{
if(e.key==="Enter") handleSearchClick();
}}
/>

<button
className="btn btn-primary bi bi-search"
onClick={handleSearchClick}>
</button>

</div>

</header>

<div className="row g-4">

<div className="col-2">

<div
className="card border-0 rounded-4 shadow-lg p-2"
style={{
background:"rgba(255,255,255,0.35)",
backdropFilter:"blur(15px)"
}}
>

<div
className={`d-flex align-items-center p-3 rounded-3 mb-3 fw-bold ${
page==="weather" ? "bg-primary text-white" : "bg-white"
}`}
style={{cursor:"pointer",transition:"0.3s"}}
onClick={()=>setPage("weather")}
>
<span className="bi bi-cloud-fill fs-5 me-3"></span>
Current Weather
</div>

<div
className={`d-flex align-items-center p-3 rounded-3 mb-3 fw-bold ${
page==="forecast" ? "bg-primary text-white" : "bg-white"
}`}
style={{cursor:"pointer",transition:"0.3s"}}
onClick={()=>setPage("forecast")}
>
<span className="bi bi-calendar-week fs-5 me-3"></span>
Forecast
</div>

<div
className={`d-flex align-items-center p-3 rounded-3 mb-3 fw-bold ${
page==="air" ? "bg-primary text-white" : "bg-white"
}`}
style={{cursor:"pointer",transition:"0.3s"}}
onClick={()=>setPage("air")}
>
<span className="bi bi-wind fs-5 me-3"></span>
Air Quality
</div>

<div
className={`d-flex align-items-center p-3 rounded-3 fw-bold ${
page==="saved" ? "bg-primary text-white" : "bg-white"
}`}
style={{cursor:"pointer",transition:"0.3s"}}
onClick={()=>setPage("saved")}
>
<span className="bi bi-bookmark-heart-fill fs-5 me-3"></span>
Saved Cities
</div>

</div>

</div>

<div className="col-6">

{page==="weather" && (

<div
className="card border-0 rounded-4 shadow-lg"
style={{
background:"linear-gradient(135deg,#36d1dc,#5b86e5)",
color:"white"
}}
>

<div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent">

<div>

<h2>{weatherObj.name}</h2>

<div>
{moment(now).format("dddd DD MMMM YYYY")}
</div>

</div>

<div className="text-end">

<img
src={`https://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@4x.png`}
alt=""
/>

<div>{weatherObj.weather[0].description}</div>

</div>

</div>

<div className="card-body">

<h1 className="display-1 fw-bold">
{(weatherObj.main.temp-273.15).toFixed(0)}°
</h1>

<h5 className="text-white-50">
{weatherObj.weather[0].description.toUpperCase()}
</h5>

<h6>{weatherMsg}</h6>

<div className="row mt-4">

<div className="col">
<div className="card bg-primary text-white text-center p-3 rounded-4 border-0 shadow">
<div className="bi bi-droplet-fill fs-2"></div>
<h5>{weatherObj.main.humidity}%</h5>
<small>Humidity</small>
</div>
</div>

<div className="col">
<div className="card bg-success text-white text-center p-3 rounded-4 border-0 shadow">
<div className="bi bi-wind fs-2"></div>
<h5>{weatherObj.wind.speed} m/s</h5>
<small>Wind</small>
</div>
</div>

<div className="col">
<div className="card bg-warning text-dark text-center p-3 rounded-4 border-0 shadow">
<div className="bi bi-thermometer-half fs-2"></div>
<h5>{(weatherObj.main.feels_like-273.15).toFixed(0)}°</h5>
<small>Feels Like</small>
</div>
</div>

</div>

</div>

</div>

)}

{page==="forecast"&&(

<div
className="card border-0 rounded-4 shadow-lg"
style={{
background:"rgba(255,255,255,.30)",
backdropFilter:"blur(15px)"
}}
>

<div className="card-header">
<h3>5 Day Forecast</h3>
</div>

<div className="card-body">

<div className="row">

{forecast.filter((v,i)=>i%8===0).map((item,index)=>

<div className="col-md-4 mb-3" key={index}>
    <div className="card rounded-4 border-0 shadow text-center p-3">

<h5>{moment(item.dt_txt).format("ddd")}</h5>

<img
src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
alt=""
/>

<h3>{(item.main.temp-273.15).toFixed(0)}°</h3>

<p className="mb-0">{item.weather[0].main}</p>

</div>

</div>

)}

</div>

</div>

</div>

)}

{page==="air"&&(

<div
className="card border-0 rounded-4 shadow-lg"
style={{
background:"rgba(255,255,255,.30)",
backdropFilter:"blur(15px)"
}}
>

<div className="card-header">
<h3>Air Quality</h3>
</div>

<div className="row g-3">

<div className="col-6">
<div className="card text-center shadow border-0 rounded-4 p-3">
<h5>AQI</h5>
<h2>{air.list[0].main.aqi}</h2>
</div>
</div>

<div className="col-6">
<div className="card text-center shadow border-0 rounded-4 p-3">
<h5>CO</h5>
<h2>{air.list[0].components.co}</h2>
</div>
</div>

<div className="col-6">
<div className="card text-center shadow border-0 rounded-4 p-3">
<h5>PM2.5</h5>
<h2>{air.list[0].components.pm2_5}</h2>
</div>
</div>

<div className="col-6">
<div className="card text-center shadow border-0 rounded-4 p-3">
<h5>PM10</h5>
<h2>{air.list[0].components.pm10}</h2>
</div>
</div>

</div>

</div>

)}

{page==="saved"&&(

<div
className="card border-0 rounded-4 shadow-lg"
style={{
background:"rgba(255,255,255,.30)",
backdropFilter:"blur(15px)"
}}
>

<div className="card-header">
<h3>Saved Cities</h3>
</div>

<div className="list-group">

{savedCities.map((city,index)=>

<button
key={index}
className="list-group-item list-group-item-action"
onClick={()=>{
setChangingCityName(city);
setSubmitCityName(city);
setPage("weather");
}}
>

<span className="bi bi-geo-alt-fill text-danger"></span>
{" "}
{city}

</button>

)}

</div>

</div>

)}

</div>

<div className="col-4">

<div
className="card border-0 rounded-4 shadow-lg"
style={{
background:"rgba(255,255,255,.30)",
backdropFilter:"blur(15px)"
}}
>

<div className="card-body text-center">

<img
src={page==="air"?"/air.jpg":page==="weather"?weatherImage:page==="forecast"?windImage:"/sunny.jpg"}
className="img-fluid"
style={{
height:"320px",
objectFit:"contain",
padding:"20px"
}}
/>

<h4 className="mt-3">

{page==="weather"&&weatherObj.weather[0].main}

{page==="forecast"&&"Forecast"}

{page==="air"&&"Air Quality"}

{page==="saved"&&"Saved Cities"}

</h4>

<p className="text-muted">

{page==="weather"&&weatherMsg}

{page==="forecast"&&"Weather prediction for next 5 days."}

{page==="air"&&"Live air pollution details."}

{page==="saved"&&"Click any city to view weather."}

</p>

</div>

</div>

</div>

</div>

</div>

);

}