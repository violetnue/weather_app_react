import React from 'react';
import './App.scss';
import { WeatherData } from './components/WeatherData'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'init',
            isLoaded: false,
            weatherData: null
        }
    }

    abortController = new AbortController();
    controllerSignal = this.abortController.signal;

    weatherInit = () => {

        const success = (position) => {
            this.getWeatherData(position.coords.latitude, position.coords.longitude);
        }

        const error = () => {
            alert('Unable to retrieve location.');
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert('Your browser does not support location tracking, or permission is denied.');
        }
    }

    getWeatherData = (lat, lon) => {
        const weatherApi = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_WEATHER_KEY}`;

        fetch(weatherApi, { signal: this.controllerSignal })
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result);
                    const { name } = result;
                    const { country } = result.sys;
                    const { temp, temp_min, temp_max, feels_like, humidity } = result.main;
                    const { description, icon } = result.weather[0];
                    const { speed, deg } = result.wind;

                    this.setState({
                        isLoaded: true,
                        weatherData: {
                            name,
                            country,
                            description,
                            icon,
                            temp: temp.toFixed(1),
                            feels_like: feels_like.toFixed(1),
                            temp_min: temp_min.toFixed(1),
                            temp_max: temp_max.toFixed(1),
                            speed,
                            deg,
                            humidity
                        }
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    componentDidMount() {
        this.weatherInit();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className='App'>
                <div className='container'>
                    <WeatherData />
                </div>
            </div>
        );
    }
}

export default App;