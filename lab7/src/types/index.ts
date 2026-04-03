export interface Bet 
{
  id: string;
  city: string;
  predicted: string;
  status: 'принято' | 'выиграно' | 'проиграно';
  date: string;
  isOwn: boolean;
}

export interface WeatherData 
{
  city: string;
  emoji: string;
  code?: number;
}

export const weatherTypes = ["☀️", "🌤️", "⛅", "☁️", "🌫️", "🌧️", "🌦️", "❄️", "⛈️"] as const;
export type WeatherEmoji = typeof weatherTypes[number];