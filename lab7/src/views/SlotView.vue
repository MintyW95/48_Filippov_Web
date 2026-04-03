<template>
  <div>
    <h2>Вспомогательный депчик</h2>

    <div class="slot-machine">
      <div class="slots">
        <div class="slot" id="slot1">❓</div>
        <div class="slot" id="slot2">❓</div>
        <div class="slot" id="slot3">❓</div>
      </div>
      <button @click="spinSlot">КРУТИТ</button>
      <div class="result" id="slotResult"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isRunning = ref(false)
const slotResult = ref('')

const weatherTypes = ["☀️","🌤️","⛅","☁️","🌫️","🌧️","🌦️","❄️","⛈️"]

const spinSlot = () => 
{
  if (isRunning.value) return
  isRunning.value = true
  const s1 = document.getElementById('slot1') as HTMLElement
  const s2 = document.getElementById('slot2') as HTMLElement
  const s3 = document.getElementById('slot3') as HTMLElement
  const resultEl = document.getElementById('slotResult') as HTMLElement
  resultEl.textContent = "штош..."
  s1.textContent = "❓"
  s2.textContent = "❓"
  s3.textContent = "❓"
  setTimeout(() => { s1.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)] }, 300)
  setTimeout(() => { s2.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)] }, 600)
  setTimeout(() => { 
    s3.textContent = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
    showResult()
    isRunning.value = false 
  }, 900)
}

const showResult = () => 
{
  const s1 = (document.getElementById('slot1') as HTMLElement).textContent || ''
  const s2 = (document.getElementById('slot2') as HTMLElement).textContent || ''
  const s3 = (document.getElementById('slot3') as HTMLElement).textContent || ''
  const resultEl = document.getElementById('slotResult') as HTMLElement
  if (s1 === s2 && s2 === s3) 
  {
    resultEl.innerHTML = `завтра точно будет ${s1}, ДЕПАЙ ВСЁ`
  } 
  else if (s1 === s2 || s1 === s3) 
  {
    resultEl.innerHTML = `скорее всего будет ${s1}`
  } 
  else if (s2 === s3) 
  {
    resultEl.innerHTML = `скорее всего будет ${s2}`
  } 
  else 
  {
    resultEl.textContent = "ну чё сказать... погода в Исландии непредсказуема"
  }
}
</script>