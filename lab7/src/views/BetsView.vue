<template>
  <div>
    <h2>Ставки на погоду завтра</h2>

    <div class="form-container">
      <select v-model="selectedCity">
        <option v-for="cityOption in icelandCities" :key="cityOption" :value="cityOption">
          {{ cityOption }}
        </option>
      </select>

      <select v-model="selectedWeather">
        <option v-for="emoji in weatherTypes" :key="emoji" :value="emoji">
          {{ emoji }}
        </option>
      </select>

      <button @click="placeBet">ПОСТАВИТЬ</button>
    </div>

    <div class="deck-container">
      <BetCard
        v-for="bet in betsStore.bets"
        :key="bet.id"
        :bet="bet"
        @update="handleUpdateBet"
        @delete="handleDeleteBet"
      />
      
      <p v-if="betsStore.bets.length === 0 && !betsStore.loading" class="empty">стань первым</p>
    </div>

    <div v-if="betsStore.loading" class="loading">загружаем ставки...</div>
    <div v-if="betsStore.error" class="error">{{ betsStore.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBetsStore } from '../stores/useBetsStore'
import BetCard from '../components/BetCard.vue'
import type { Bet } from '../types'

const betsStore = useBetsStore()

const selectedCity = ref('Reykjavík')
const selectedWeather = ref('☀️')

const icelandCities = [
  "Reykjavík", "Kópavogur", "Hafnarfjörður", "Reykjanesbær", "Akureyri",
  "Garðabær", "Mosfellsbær", "Árborg", "Akranes", "Seltjarnarnes",
  "Vestmannaeyjar", "Grindavík", "Ísafjörður", "Húsavík", "Egilsstaðir",
  "Borgarnes", "Seyðisfjörður", "Höfn", "Sauðárkrókur", "Siglufjörður",
  "Ólafsvík", "Vík í Mýrdal", "Blönduós", "Dalvík", "Hella", "Hvolsvöllur",
  "Stykkishólmur", "Patreksfjörður", "Bolungarvík", "Fáskrúðsfjörður"
]

const weatherTypes = ["☀️","🌤️","⛅","☁️","🌫️","🌧️","🌦️","❄️","⛈️"]


onMounted(async () => {
  await betsStore.fetchBets()
})

const placeBet = async () => {
  if (!selectedWeather.value) {
    alert("saar выберите погоду saar")
    return
  }

  const newBet: Omit<Bet, 'id'> = {
    city: selectedCity.value,
    predicted: selectedWeather.value,
    status: "принято",
    date: new Date().toLocaleDateString('ru-RU'),
    isOwn: true
  }

  try {
    await betsStore.addBet(newBet)
    alert("ставка принята!")
  } catch (e: any) {
    console.error(e)
    alert("ошибка при создании ставки")
  }
}

// Обновление прогноза
const handleUpdateBet = async (id: string, predicted: string) => {
  try {
    await betsStore.updateBet(id, { predicted })
    alert("прогноз обновлён")
  } catch (e) {
    alert("прогноз не был обновлён")
  }
}

const handleDeleteBet = async (id: string) => {
  if (!confirm("отменить ставку?")) return
  
  try {
    await betsStore.deleteBet(id)
    alert("ставка отменена")
  } catch (e) {
    alert("технические неполадки")
  }
}
</script>