<template>
  <div class="card bet-card">
    <h3>{{ bet.city }}</h3>
    <p><strong>Прогноз:</strong> {{ bet.predicted }}</p>
    <p><small>{{ bet.date }}</small></p>
    <p>
      Статус: 
      <span :style="{ color: getStatusColor(bet.status) }">
        {{ bet.status }}
      </span>
    </p>

    <div v-if="bet.isOwn" class="bet-actions">
      <button @click="updateBet">✏️</button>
      <button @click="deleteBet">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bet } from '../types'

const props = defineProps<{
  bet: Bet
}>()

const emit = defineEmits<{
  (e: 'update', id: string, predicted: string): void
  (e: 'delete', id: string): void
}>()

const getStatusColor = (status: string): string => 
{
  if (status === 'выиграно') return 'lightgreen'
  if (status === 'проиграно') return 'red'
  return 'tomato'
}

const updateBet = () => 
{
  const message = `изменить прогноз для ${props.bet.city}\n\n` +
    weatherTypes.map((emoji, i) => `${i + 1}. ${emoji}`).join('\n')
  const input = prompt(message)
  if (input === null) return
  const num = parseInt(input.trim())
  if (num < 1 || num > weatherTypes.length) 
  {
    alert("НЕ ТО")
    return
  }
  const newPredicted = weatherTypes[num - 1]
  emit('update', props.bet.id, newPredicted)
}

const deleteBet = () => 
{
  if (confirm("отменить ставку?")) 
  {
    emit('delete', props.bet.id)
  }
}

const weatherTypes = ["☀️","🌤️","⛅","☁️","🌫️","🌧️","🌦️","❄️","⛈️"]
</script>

<style scoped>
</style>