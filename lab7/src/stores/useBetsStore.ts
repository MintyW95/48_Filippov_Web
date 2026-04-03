import { defineStore } from 'pinia'
import axios from 'axios'
import type { Bet } from '../types'
const Api_Link = 'http://localhost:3000'

export const useBetsStore = defineStore('bets', 
{
  state: () => ({
    bets: [] as Bet[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBets() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get<Bet[]>(`${Api_Link}/bets`)
        this.bets = response.data.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        console.log(`загружено ${this.bets.length} ставок с сервера`)
      } catch (error) {
        console.error('ошибка загрузки ставок:', error)
        this.error = 'не удалось загрузить ставки'
      } finally {
        this.loading = false
      }
    },

    async addBet(newBet: Omit<Bet, 'id'>) {
      try {
        console.log("Отправляем ставку на сервер:", newBet)
        const response = await axios.post<Bet>(`${Api_Link}/bets`, newBet)
        
        console.log("Ставка успешно сохранена, ID:", response.data.id)
        this.bets.unshift(response.data)
        return response.data
      } catch (error: any) {
        console.error("ошибка сохранения ставки:", error.response?.data || error.message)
        this.error = 'не удалось сохранить ставку'
        throw error
      }
    },

    async updateBet(id: string, updates: { predicted: string }) {
      try {
        await axios.patch(`${Api_Link}/bets/${id}`, updates)
        const index = this.bets.findIndex(b => b.id === id)
        if (index !== -1) {
          this.bets[index] = { ...this.bets[index], ...updates }
        }
      } catch (error) {
        console.error('ошибка обновления ставки:', error)
        throw error
      }
    },

    async deleteBet(id: string) {
      try {
        await axios.delete(`${Api_Link}/bets/${id}`)
        this.bets = this.bets.filter(b => b.id !== id)
      } catch (error) {
        console.error('ошибка удаления ставки:', error)
        throw error
      }
    }
  }
})