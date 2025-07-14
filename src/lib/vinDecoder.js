/** route: src/lib/vinDecoder.js */
export async function decodeVIN(vin) {
  try {
    const response = await fetch(`/api/decode-vin?vin=${vin}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("VIN decoding error:", error)
    return { success: false }
  }
}
