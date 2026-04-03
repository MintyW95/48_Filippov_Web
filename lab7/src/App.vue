<template>
  <div id="app">
    <header>
      <h1>Hvernig er veðrið í dag, Jón?</h1>
      <nav>
        <ul>
          <li><router-link to="/" :class="{ active: $route.name === 'bets' }">СТАВКИ</router-link></li>
          <li><router-link to="/weather" :class="{ active: $route.name === 'weather' }">ПОГОДА СЕЙЧАС</router-link></li>
          <li><router-link to="/currency" :class="{ active: $route.name === 'currency' }">КУРС ВАЛЮТ</router-link></li>
          <li><router-link to="/slot" :class="{ active: $route.name === 'slot' }">СЛОТЫ</router-link></li>
        </ul>
      </nav>
      <button @click="resetAllData" class="reset-btn">🗑️</button>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer>
      <i>Как говорят, в Исландии самая непредсказуемая в мире погода. Почему бы не попытаться её предугадать?</i>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useBetsStore } from '@/stores/useBetsStore'

const betsStore = useBetsStore()

const resetAllData = async () => {
  if (confirm("обрушить рынок ставок на погоду в Исландии???")) {
    await betsStore.resetOwnBets()
  }
}
</script>

<style scoped>
</style>