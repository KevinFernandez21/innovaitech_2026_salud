<template>
  <div class="bg-background-light dark:bg-background-dark text-[#101918] transition-colors duration-300">
    <div class="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark">
      <div class="flex items-center p-6 pb-2 justify-between">
        <div @click="router.push('/patient/dashboard')" class="text-[#101918] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 cursor-pointer">
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </div>
        <h2 class="text-[#101918] dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Metáforas de Salud</h2>
      </div>

      <div class="flex-1 overflow-y-auto px-6 pb-24">
        <div class="pt-6 pb-2">
          <h2 class="text-[#101918] dark:text-white tracking-tight text-3xl font-bold leading-tight text-center">Entiende tu Corazón</h2>
        </div>
        <div class="pb-6">
          <p class="text-zinc-500 dark:text-zinc-400 text-base font-normal leading-relaxed text-center px-4">
            Desliza para ver cómo la sal afecta el volumen de tu sangre.
          </p>
        </div>

        <div class="p-1 mb-6">
          <div class="flex flex-col items-stretch justify-start rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden border border-zinc-100 dark:border-zinc-800">
            <div class="relative h-64 w-full bg-blue-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
              <div class="relative flex items-center justify-center">
                <div :class="['w-40 h-28 bg-yellow-200 rounded-2xl shadow-xl relative sponge-container sponge-texture border-4 border-yellow-300 flex items-center justify-center overflow-hidden transition-all duration-500', spongeExpanded ? 'scale-110 bg-yellow-300' : '']">
                  <div :class="['absolute inset-0 mix-blend-multiply transition-all duration-500', spongeExpanded ? 'bg-clinical-blue/40' : 'bg-clinical-blue/20']"></div>
                  <span class="material-symbols-outlined text-yellow-600/30 text-6xl">grid_view</span>
                </div>
                <div class="absolute top-0 -translate-y-12 flex gap-2">
                  <div class="size-1 bg-zinc-300 rounded-full animate-bounce"></div>
                  <div class="size-1.5 bg-zinc-200 rounded-full animate-pulse"></div>
                  <div class="size-1 bg-zinc-400 rounded-full animate-bounce delay-75"></div>
                </div>
              </div>
              <div class="absolute top-4 right-4 flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur px-3 py-1 rounded-full border border-zinc-100 dark:border-zinc-700">
                <div class="size-2 rounded-full bg-clinical-blue animate-pulse"></div>
                <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Volumen Sanguíneo</span>
              </div>
              <div class="absolute bottom-4 text-xs font-medium text-clinical-blue tracking-widest uppercase">{{ spongeExpanded ? 'Efecto: Volumen Aumentado' : 'Efecto: Absorbiendo agua' }}</div>
            </div>

            <div class="flex w-full flex-col items-stretch justify-center gap-4 p-6">
              <div>
                <p class="text-[#101918] dark:text-white text-xl font-bold leading-tight mb-2">Analogía de la Esponja</p>
                <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  La sal atrae el agua. Al comer mucha sal, tu sangre aumenta de volumen y presiona más tus arterias.
                </p>
              </div>
              <div class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-2">
                  <div class="size-8 rounded-full bg-clinical-blue/10 flex items-center justify-center">
                    <span class="material-symbols-outlined text-clinical-blue text-lg">opacity</span>
                  </div>
                  <p class="text-clinical-blue font-bold text-sm">+{{ volumePercentage }}% Volumen</p>
                </div>
                <button @click="resetSponge" class="flex items-center justify-center rounded-xl h-10 px-6 bg-zinc-100 dark:bg-zinc-800 text-[#101918] dark:text-white text-sm font-semibold transition-transform active:scale-95">
                  <span class="truncate">Reiniciar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8 px-2">
          <div class="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
            <div class="flex w-full items-center justify-between mb-6">
              <p class="text-[#101918] dark:text-white text-sm font-bold uppercase tracking-wider">Añadir Sodio (Sal)</p>
              <span class="bg-clinical-blue/10 text-clinical-blue px-3 py-1 rounded-full text-xs font-bold">{{ saltLevel }}</span>
            </div>
            <div class="flex h-6 w-full items-center gap-4">
              <div class="flex h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div class="h-full rounded-full bg-clinical-blue relative transition-all duration-300" :style="{ width: sodiumLevel + '%' }">
                  <div class="absolute -right-3 -top-2 size-6 rounded-full bg-white dark:bg-zinc-700 shadow-lg border-2 border-clinical-blue flex items-center justify-center">
                    <div class="size-2 rounded-full bg-clinical-blue"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Poca Sal</span>
              <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Mucha Sal</span>
            </div>
            <input type="range" v-model="sodiumLevel" min="0" max="100" class="w-full mt-4 opacity-0 absolute" @input="updateSponge" />
            <div class="flex gap-2 mt-4">
              <button @click="decreaseSodium" class="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-2 rounded-lg font-bold">-</button>
              <button @click="increaseSodium" class="flex-1 bg-clinical-blue text-white py-2 rounded-lg font-bold">+</button>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-3xl bg-health-green/10 border border-health-green/20 flex flex-col gap-3 relative overflow-hidden mb-6">
          <div class="absolute -right-4 -top-4 size-24 bg-health-green/5 rounded-full"></div>
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-health-green flex items-center justify-center shadow-lg shadow-health-green/30">
              <span class="material-symbols-outlined text-white">eco</span>
            </div>
            <h4 class="text-health-green font-bold text-lg">Tip de Salud</h4>
          </div>
          <p class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            <span class="font-bold">Menos sal = Menos presión.</span> Reducir el sodio evita que tu cuerpo retenga líquidos en exceso, protegiendo tu corazón.
          </p>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around px-6">
        <div class="flex flex-col items-center gap-1 text-clinical-blue">
          <span class="material-symbols-outlined text-[28px] fill-1">school</span>
          <span class="text-[10px] font-bold">Aprender</span>
        </div>
        <div @click="router.push('/patient/dashboard')" class="flex flex-col items-center gap-1 text-zinc-400 cursor-pointer hover:text-clinical-blue">
          <span class="material-symbols-outlined text-[28px]">analytics</span>
          <span class="text-[10px] font-bold">Progreso</span>
        </div>
        <div class="flex flex-col items-center gap-1 text-zinc-400">
          <span class="material-symbols-outlined text-[28px]">settings</span>
          <span class="text-[10px] font-bold">Ajustes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const sodiumLevel = ref(65)
const spongeExpanded = ref(false)

const volumePercentage = computed(() => {
  return Math.round((sodiumLevel.value / 100) * 50)
})

const saltLevel = computed(() => {
  if (sodiumLevel.value < 30) return 'Bajo'
  if (sodiumLevel.value < 70) return 'Moderado'
  return 'Alto'
})

const updateSponge = () => {
  spongeExpanded.value = sodiumLevel.value > 50
}

const resetSponge = () => {
  sodiumLevel.value = 0
  spongeExpanded.value = false
}

const increaseSodium = () => {
  if (sodiumLevel.value < 100) {
    sodiumLevel.value += 10
    updateSponge()
  }
}

const decreaseSodium = () => {
  if (sodiumLevel.value > 0) {
    sodiumLevel.value -= 10
    updateSponge()
  }
}

// Initialize
updateSponge()
</script>

<style scoped>
.sponge-texture {
  background-image: radial-gradient(#00000011 2px, transparent 2px);
  background-size: 8px 8px;
}

.sponge-container {
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>
