<template>
  <div>
    <h2>Курс валют $ (доллар USD)</h2>

    <div class="form-container">
      <button @click="fetchCurrencyRates">ОБНОВИТЬ КУРС</button>
    </div>

    <div id="currencyResult">
      <div v-if="loading" class="loading">проникаем на биржу...</div>
      
      <div v-else-if="Object.keys(rates).length > 0" class="card">
        <h3>1 USD =</h3>
        <table>
          <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rate, currency) in rates" :key="currency">
              <td>{{ currency }}</td>
              <td>{{ rate.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="!loading" class="loading">Нажмите кнопку, чтобы загрузить курсы</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const error = ref<string | null>(null)
const rates = ref<Record<string, number>>({})

const fetchCurrencyRates = async () => 
{
  loading.value = true
  error.value = null
  try 
  {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    if (!res.ok) throw new Error('ошибка сервера')
    const data = await res.json()
    rates.value = data.rates
  } 
  catch (e) 
  {
    error.value = 'мировая экономика обрушена'
    console.error(e)
  } 
  finally 
  {
    loading.value = false
  }
}
</script>