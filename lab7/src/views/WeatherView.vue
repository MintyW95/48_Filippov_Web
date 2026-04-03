<template>
  <div>
    <h2>Погода в Исландии сейчас</h2>

    <div class="form-container">
      <select v-model="selectedCity" style="flex:1; min-width:240px;">
        <option v-for="city in icelandCities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
      <button @click="fetchWeather">ОБНОВИТЬ ПОГОДУ</button>
    </div>

    <div id="weatherResult">
      <div v-if="loading" class="loading">загружаем погоду для {{ selectedCity }}...</div>
      
      <div v-else-if="weather" class="card weather-card">
        <div class="emoji" style="font-size:64px">{{ weather.emoji }}</div>
        <h3>{{ weather.city }}, Исландия</h3>
      </div>

      <div v-else-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WeatherData } from '@/types'

const selectedCity = ref('Reykjavík')
const weather = ref<WeatherData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const icelandCities = [
  "Reykjavík","Kópavogur","Hafnarfjörður","Reykjanesbær","Akureyri","Garðabær",
  "Mosfellsbær","Árborg","Akranes","Seltjarnarnes","Vestmannaeyjar","Grindavík",
  "Ísafjörður","Húsavík","Egilsstaðir","Borgarnes","Seyðisfjörður","Höfn",
  "Sauðárkrókur","Siglufjörður","Ólafsvík","Vík í Mýrdal","Blönduós","Dalvík",
  "Hella","Hvolsvöllur","Stykkishólmur","Patreksfjörður","Bolungarvík","Fáskrúðsfjörður"
]

const citySearchMap: Record<string, string> = {
  "Reykjavík": "Reykjavik", "Kópavogur": "Kopavogur", "Hafnarfjörður": "Hafnarfjordur",
  "Reykjanesbær": "Reykjanesbaer", "Akureyri": "Akureyri", "Garðabær": "Gardabaer",
  "Mosfellsbær": "Mosfellsbaer", "Árborg": "Arborg", "Akranes": "Akranes",
  "Seltjarnarnes": "Seltjarnarnes", "Vestmannaeyjar": "Vestmannaeyjar", "Grindavík": "Grindavik",
  "Ísafjörður": "Isafjordur", "Húsavík": "Husavik", "Egilsstaðir": "Egilsstadir",
  "Borgarnes": "Borgarnes", "Seyðisfjörður": "Seydisfjordur", "Höfn": "Hofn",
  "Sauðárkrókur": "Saudarkrokur", "Siglufjörður": "Siglufjordur", "Ólafsvík": "Olafsvik",
  "Vík í Mýrdal": "Vik", "Blönduós": "Blonduos", "Dalvík": "Dalvik",
  "Hella": "Hella", "Hvolsvöllur": "Hvolsvollur", "Stykkishólmur": "Stykkisholmur",
  "Patreksfjörður": "Patreksfjordur", "Bolungarvík": "Bolungarvik", "Fáskrúðsfjörður": "Faskrudsfjordur"
}

const fetchWeather = async () => 
{
  loading.value = true
  error.value = null
  weather.value = null

  const displayCity = selectedCity.value
  const searchCity = citySearchMap[displayCity] || displayCity

  try 
  {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=5&language=en`)
    const geoData = await geoRes.json()
    if (!geoData.results || geoData.results.length === 0) 
    {
      throw new Error('город не найден')
    }
    const location = geoData.results[0]
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=weather_code`
    )

    if (!weatherRes.ok) throw new Error('ошибка погодного сервиса')
    const data = await weatherRes.json()
    const code = data.current.weather_code
    const emojiMap: Record<number, string> = 
    {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
      45: "🌫️", 48: "🌫️",
      51: "🌧️", 53: "🌧️", 55: "🌧️",
      61: "🌧️", 63: "🌧️", 65: "🌧️",
      71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️",
      80: "🌦️", 81: "🌦️", 82: "🌦️",
      85: "❄️", 86: "❄️",
      95: "⛈️", 96: "⛈️", 99: "⛈️"
    }
    const emoji = emojiMap[code] || "❓"
    weather.value = 
    {
      city: displayCity,
      emoji: emoji
    }
  } 
  catch (e: any) 
  {
    error.value = `не получилось загрузить погоду для ${displayCity}`
    console.error(e)
  } 
  finally 
  {
    loading.value = false
  }
}
</script>