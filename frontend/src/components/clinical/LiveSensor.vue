<template>
  <div class="min-h-screen bg-surface-light dark:bg-surface-dark p-6">
    <!-- Header -->
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button
            @click="$router.back()"
            class="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-text-main dark:text-white"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="text-2xl font-bold text-text-main dark:text-white">
            Sensor EMG en Vivo
          </h1>
        </div>

        <!-- Connection Status -->
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-3 h-3 rounded-full',
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            ]"
          ></div>
          <span class="text-sm text-text-muted dark:text-gray-300">
            {{ isConnected ? 'Conectado' : 'Desconectado' }}
          </span>
        </div>
      </div>

      <!-- Device Info -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-lg">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-xs text-text-muted dark:text-gray-400 mb-1">Dispositivo</p>
            <p class="text-lg font-semibold text-text-main dark:text-white">
              {{ deviceId || 'N/A' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-text-muted dark:text-gray-400 mb-1">Tipo</p>
            <p class="text-lg font-semibold text-text-main dark:text-white">
              {{ signalType || 'N/A' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-text-muted dark:text-gray-400 mb-1">BPM Estimado</p>
            <p class="text-lg font-semibold text-accent-green">
              {{ currentBPM }}
            </p>
          </div>
        </div>
      </div>

      <!-- Live Waveform Canvas -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 shadow-lg">
        <h3 class="text-sm font-semibold text-text-main dark:text-white mb-4">
          Forma de Onda en Tiempo Real
        </h3>
        <canvas
          ref="waveformCanvas"
          class="w-full rounded-lg"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>
      </div>

      <!-- Channel Values -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <h3 class="text-sm font-semibold text-text-main dark:text-white mb-3">
          Valores Actuales
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="(value, index) in currentSignals"
            :key="index"
            class="text-center p-4 rounded-lg"
            :style="{ backgroundColor: channelColors[index] + '10' }"
          >
            <p class="text-xs text-text-muted dark:text-gray-400 mb-2">
              Canal {{ index + 1 }}
            </p>
            <p class="text-3xl font-bold" :style="{ color: channelColors[index] }">
              {{ value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface SensorData {
  device_id: number
  type: string
  signals: number[]
  timestamp: number
}

// ===== MOCK MODE CONFIGURATION =====
const USE_MOCK_DATA = true  // Set to false to use real WebSocket sensor
// ===================================

// WebSocket configuration
const WS_URL = 'ws://localhost:8765'
let ws: WebSocket | null = null
let mockIntervalId: number | null = null

// Component state
const isConnected = ref(false)
const deviceId = ref<number | null>(null)
const signalType = ref<string>('')
const currentSignals = ref<number[]>([0, 0, 0])
const currentBPM = ref<number>(0)

// Canvas configuration
const waveformCanvas = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 1200
const canvasHeight = 300
const maxDataPoints = 500

// Waveform data buffer (circular buffer)
const waveformData = ref<number[][]>([])

// Channel colors
const channelColors = ['#3B82F6', '#10B981', '#A855F7'] // Blue, Green, Purple

// Mock data generator
let mockTime = 0
const startMockDataGenerator = () => {
  // Set initial mock state
  isConnected.value = true
  deviceId.value = 203333
  signalType.value = 'EMG'

  mockIntervalId = window.setInterval(() => {
    // Generate realistic EMG-like signals
    const heartbeat = 100 + Math.floor(40 * Math.sin(mockTime * 6) * Math.exp(-((mockTime % 1.0) * 5)))
    const respiratory = 110 + Math.floor(20 * Math.sin(mockTime * 1.5))
    const muscle = 90 + Math.floor(15 * Math.sin(mockTime * 10)) + Math.floor(Math.random() * 10 - 5)

    const signals = [
      Math.max(50, Math.min(200, heartbeat)),
      Math.max(50, Math.min(200, respiratory)),
      Math.max(50, Math.min(200, muscle))
    ]

    // Update current signals
    currentSignals.value = signals

    // Add to waveform buffer
    waveformData.value.push(signals)

    // Maintain max buffer size (circular buffer)
    if (waveformData.value.length > maxDataPoints) {
      waveformData.value.shift()
    }

    // Calculate BPM
    calculateBPM()

    mockTime += 0.02 // 50 Hz simulation
  }, 20) // 20ms = 50 Hz
}

// WebSocket connection
const connectWebSocket = () => {
  ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    console.log('WebSocket connected')
    isConnected.value = true
  }

  ws.onmessage = (event) => {
    const data: SensorData = JSON.parse(event.data)

    // Update device info
    deviceId.value = data.device_id
    signalType.value = data.type
    currentSignals.value = data.signals

    // Add to waveform buffer
    waveformData.value.push(data.signals)

    // Maintain max buffer size (circular buffer)
    if (waveformData.value.length > maxDataPoints) {
      waveformData.value.shift()
    }

    // Calculate BPM from signal peaks (simple peak detection)
    calculateBPM()
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    isConnected.value = false
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected')
    isConnected.value = false

    // Attempt reconnection after 3 seconds
    setTimeout(connectWebSocket, 3000)
  }
}

// BPM calculation (simple peak detection on channel 1)
const calculateBPM = () => {
  if (waveformData.value.length < 50) return

  const recentData = waveformData.value.slice(-50).map(d => d[0])
  const avg = recentData.reduce((a, b) => a + b, 0) / recentData.length

  let peaks = 0
  let inPeak = false

  for (const value of recentData) {
    if (value > avg * 1.2 && !inPeak) {
      peaks++
      inPeak = true
    } else if (value < avg * 0.8) {
      inPeak = false
    }
  }

  // Estimate BPM (assuming ~50 samples/sec in demo mode)
  const samplesPerSecond = 50
  const timeWindow = recentData.length / samplesPerSecond
  currentBPM.value = Math.round((peaks / timeWindow) * 60)
}

// Canvas drawing
let animationFrameId: number | null = null

const drawWaveform = () => {
  const canvas = waveformCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas with dark background
  ctx.fillStyle = '#1F2937' // dark background
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Draw grid lines
  ctx.strokeStyle = '#374151'
  ctx.lineWidth = 1

  // Horizontal grid lines
  for (let y = 0; y < canvasHeight; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasWidth, y)
    ctx.stroke()
  }

  // Vertical grid lines
  for (let x = 0; x < canvasWidth; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight)
    ctx.stroke()
  }

  // Draw waveforms for each channel
  const data = waveformData.value
  if (data.length < 2) {
    animationFrameId = requestAnimationFrame(drawWaveform)
    return
  }

  const pointSpacing = canvasWidth / maxDataPoints

  // Draw each channel
  for (let channelIndex = 0; channelIndex < 3; channelIndex++) {
    ctx.strokeStyle = channelColors[channelIndex]
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < data.length; i++) {
      const x = i * pointSpacing
      const value = data[i][channelIndex]

      // Normalize value to canvas height (assuming signal range 0-255)
      const y = canvasHeight - (value / 255) * canvasHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  // Continue animation loop
  animationFrameId = requestAnimationFrame(drawWaveform)
}

// Lifecycle
onMounted(() => {
  if (USE_MOCK_DATA) {
    // Use mock data generator
    startMockDataGenerator()
  } else {
    // Connect to real WebSocket sensor
    connectWebSocket()
  }
  drawWaveform()
})

onUnmounted(() => {
  // Clean up WebSocket
  if (ws) {
    ws.close()
  }

  // Clean up mock data generator
  if (mockIntervalId) {
    clearInterval(mockIntervalId)
  }

  // Clean up animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
