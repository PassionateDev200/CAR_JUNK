/** route: src/utils/types.js */
// Vehicle object structure
// {
//   id: string
//   make: string
//   model: string
//   year: number
//   vin: string
//   mileage: number
//   condition: 'excellent' | 'good' | 'fair' | 'poor'
// }

// Quote object structure
// {
//   id: string
//   vehicleId: string
//   amount: number
//   status: 'pending' | 'accepted' | 'rejected'
//   createdAt: Date
//   expiresAt: Date
// }

// User object structure
// {
//   id: string
//   name: string
//   email: string
//   phone: string
// }

export const VEHICLE_CONDITIONS = ["excellent", "good", "fair", "poor"]
export const QUOTE_STATUSES = ["pending", "accepted", "rejected"]
