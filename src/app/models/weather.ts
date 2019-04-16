export type tempUnits = 'Celsius' | 'Fahrenheit';
export enum TempQueryUnits {
  Celsius = 'metric',
  Fahrenheit = 'imperial'
}

export interface IWeatherQuery {
  units: TempQueryUnits;
  mode: 'json';
}

export interface IWeatherQueryById extends IWeatherQuery {
  id: string;
}
export interface IWeatherQueryByLatLon extends IWeatherQuery {
  lat: string;
  lon: string;
}

export interface IWeatherMainData {
  temp: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface IWeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IWeatherDay {
  dt: number;
  main: IWeatherMainData;
  weather: IWeatherInfo[];
  clouds: { all?: number };
  wind: { speed: number; deg: number };
  snow?: { '3h'?: number };
  rain?: { '3h'?: number };
  sys: { pod: string };
  dt_txt: string;
}

export interface IWeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: IWeatherDay[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
  };
}
