import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    vehicleAlert: false,
  }),
  actions: {
    setVehicleAlert(value:any) {
      this.vehicleAlert = value
    },
    clearVehicleAlert() {
      this.vehicleAlert = false
    }
  }
})