<template>
  <div class="bg-background-light dark:bg-background-dark text-[#101918] transition-colors duration-300">
    <div class="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark">
      <!-- Header -->
      <div class="flex items-center p-6 pb-2 justify-between border-b border-zinc-100 dark:border-zinc-800">
        <div @click="goBack" class="text-[#101918] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 cursor-pointer">
          <span class="material-symbols-outlined">arrow_back_ios_new</span>
        </div>
        <h2 class="text-[#101918] dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">
          {{ currentView === 'metaphors' ? 'Metáforas de Salud' : currentView === 'progress' ? 'Tu Progreso' : 'Configuración' }}
        </h2>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto pb-24">
        <!-- Metaphors View -->
        <div v-if="currentView === 'metaphors'" class="px-6">
          <div class="pt-6 pb-2">
            <h2 class="text-[#101918] dark:text-white tracking-tight text-3xl font-bold leading-tight text-center">Entiende tu Corazón</h2>
          </div>
          <div class="pb-6">
            <p class="text-zinc-500 dark:text-zinc-400 text-base font-normal leading-relaxed text-center px-4">
              Explora estas metáforas interactivas para comprender mejor tu salud cardiovascular.
            </p>
          </div>

          <!-- Metaphor Selector -->
          <div class="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
            <button
              v-for="metaphor in metaphors"
              :key="metaphor.id"
              @click="selectedMetaphor = metaphor.id"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                selectedMetaphor === metaphor.id
                  ? 'bg-clinical-blue text-white shadow-lg'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              ]"
            >
              {{ metaphor.name }}
            </button>
          </div>

          <!-- Sponge Metaphor -->
          <div v-if="selectedMetaphor === 'sponge'" class="mb-6">
            <div class="p-1">
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
                  <div class="absolute bottom-4 text-xs font-medium text-clinical-blue tracking-widest uppercase">{{ spongeExpanded ? 'Volumen Aumentado' : 'Absorbiendo agua' }}</div>
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

            <div class="mt-6 px-2">
              <div class="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                <div class="flex w-full items-center justify-between mb-6">
                  <p class="text-[#101918] dark:text-white text-sm font-bold uppercase tracking-wider">Añadir Sodio (Sal)</p>
                  <span class="bg-clinical-blue/10 text-clinical-blue px-3 py-1 rounded-full text-xs font-bold">{{ saltLevel }}</span>
                </div>
                <div class="mb-4">
                  <input
                    type="range"
                    v-model.number="sodiumLevel"
                    @input="updateSponge"
                    min="0"
                    max="100"
                    step="10"
                    class="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer slider-thumb"
                  />
                </div>
                <div class="flex justify-between mb-4">
                  <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Poca Sal</span>
                  <span class="text-xs font-bold text-clinical-blue">{{ sodiumLevel }}%</span>
                  <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Mucha Sal</span>
                </div>
                <div class="flex gap-2">
                  <button @click="decreaseSodium" class="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-2 rounded-lg font-bold">-</button>
                  <button @click="increaseSodium" class="flex-1 bg-clinical-blue text-white py-2 rounded-lg font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Heart Pump Metaphor -->
          <div v-if="selectedMetaphor === 'pump'" class="mb-6">
            <div class="p-1">
              <div class="flex flex-col items-stretch justify-start rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <div class="relative h-64 w-full bg-red-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
                  <div class="relative">
                    <div :class="['w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300', heartBeating ? 'scale-110' : 'scale-100']">
                      <span class="material-symbols-outlined text-white text-6xl">favorite</span>
                    </div>
                    <!-- Pulsating rings -->
                    <div v-if="heartBeating" class="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                  </div>
                  <div class="absolute top-4 right-4 flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur px-3 py-1 rounded-full">
                    <div class="size-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-500">{{ heartRate }} BPM</span>
                  </div>
                </div>

                <div class="p-6">
                  <p class="text-[#101918] dark:text-white text-xl font-bold mb-2">Tu Corazón como Bomba</p>
                  <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                    El corazón late constantemente bombeando sangre. El ejercicio aumenta el ritmo, pero debe volver a la normalidad al descansar.
                  </p>
                  <div class="flex gap-2">
                    <button @click="simulateExercise" class="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold">
                      Ejercicio
                    </button>
                    <button @click="simulateRest" class="flex-1 bg-health-green-500 text-white py-3 rounded-xl font-semibold">
                      Descanso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Blood Highway Metaphor -->
          <div v-if="selectedMetaphor === 'highway'" class="mb-6">
            <div class="p-1">
              <div class="flex flex-col items-stretch justify-start rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <div class="relative h-64 w-full bg-purple-50/30 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
                  <div class="relative w-full h-full flex items-center justify-center p-8">
                    <!-- Artery representation -->
                    <div class="relative w-full h-20 flex items-center justify-center">
                      <div :class="['w-full h-full rounded-full border-4 transition-all duration-500 flex items-center justify-center relative overflow-hidden', arteryBlocked ? 'border-red-500 h-10' : 'border-clinical-blue-500']">
                        <!-- Blood flow particles -->
                        <div v-for="i in 5" :key="i" :class="['absolute size-3 rounded-full bg-red-400 animate-flow', arteryBlocked ? 'opacity-50' : '']" :style="{ left: `${i * 20}%`, animationDelay: `${i * 0.2}s` }"></div>

                        <!-- Blockage -->
                        <div v-if="blockageLevel > 0" class="absolute right-1/4 size-8 bg-yellow-600 rounded-full border-2 border-yellow-700 transition-all duration-300" :style="{ transform: `scale(${1 + blockageLevel / 100})` }">
                          <span class="material-symbols-outlined text-white text-sm">warning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute top-4 right-4 flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur px-3 py-1 rounded-full">
                    <span class="text-[10px] font-bold tracking-widest uppercase" :class="blockageLevel > 50 ? 'text-red-500' : 'text-health-green-500'">
                      {{ blockageLevel > 50 ? 'BLOQUEADA' : 'FLUJO NORMAL' }}
                    </span>
                  </div>
                </div>

                <div class="p-6">
                  <p class="text-[#101918] dark:text-white text-xl font-bold mb-2">Autopista Sanguínea</p>
                  <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                    Tus arterias son como autopistas. El colesterol alto crea bloqueos que dificultan el flujo sanguíneo.
                  </p>

                  <div class="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 mb-4">
                    <p class="text-sm font-semibold mb-2 text-[#101918] dark:text-white">Nivel de Bloqueo</p>
                    <input type="range" v-model="blockageLevel" min="0" max="100" class="w-full" />
                    <div class="flex justify-between mt-2">
                      <span class="text-xs text-zinc-400">Limpio</span>
                      <span class="text-xs font-bold" :class="blockageLevel > 50 ? 'text-red-500' : 'text-clinical-blue'">{{ blockageLevel }}%</span>
                      <span class="text-xs text-zinc-400">Bloqueado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Health Tip -->
          <div class="p-6 rounded-3xl bg-health-green/10 border border-health-green/20 flex flex-col gap-3 relative overflow-hidden mb-6">
            <div class="absolute -right-4 -top-4 size-24 bg-health-green/5 rounded-full"></div>
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-health-green flex items-center justify-center shadow-lg shadow-health-green/30">
                <span class="material-symbols-outlined text-white">eco</span>
              </div>
              <h4 class="text-health-green font-bold text-lg">Tip de Salud</h4>
            </div>
            <p class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
              {{ currentTip }}
            </p>
          </div>
        </div>

        <!-- Progress View -->
        <div v-if="currentView === 'progress'" class="px-6 py-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-[#101918] dark:text-white mb-2">Tu Aprendizaje</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">Revisa tu progreso en las metáforas de salud</p>
          </div>

          <!-- Overall Progress -->
          <div class="bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-600 rounded-3xl p-6 mb-6 text-white shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-clinical-blue-100 text-sm mb-1">Progreso Total</p>
                <p class="text-4xl font-bold">{{ overallProgress }}%</p>
              </div>
              <div class="size-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <span class="material-symbols-outlined text-4xl">school</span>
              </div>
            </div>
            <div class="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div class="bg-white h-full rounded-full transition-all duration-500" :style="{ width: overallProgress + '%' }"></div>
            </div>
          </div>

          <!-- Metaphor Progress Cards -->
          <div class="space-y-4">
            <div v-for="metaphor in metaphors" :key="metaphor.id" class="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div :class="['size-12 rounded-xl flex items-center justify-center', metaphor.completed ? 'bg-health-green-100 dark:bg-health-green-900/20' : 'bg-zinc-100 dark:bg-zinc-800']">
                    <span :class="['material-symbols-outlined text-2xl', metaphor.completed ? 'text-health-green-500' : 'text-zinc-400']">{{ metaphor.icon }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-[#101918] dark:text-white">{{ metaphor.name }}</p>
                    <p class="text-xs text-zinc-500">{{ metaphor.description }}</p>
                  </div>
                </div>
                <div v-if="metaphor.completed" class="size-6 bg-health-green-500 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-sm">check</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div class="bg-clinical-blue h-full rounded-full transition-all" :style="{ width: metaphor.progress + '%' }"></div>
                </div>
                <span class="text-xs font-bold text-zinc-500">{{ metaphor.progress }}%</span>
              </div>
            </div>
          </div>

          <!-- Learning Stats -->
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <p class="text-zinc-500 text-xs mb-1">Metáforas Completadas</p>
              <p class="text-3xl font-bold text-[#101918] dark:text-white">{{ completedMetaphors }}/{{ metaphors.length }}</p>
            </div>
            <div class="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
              <p class="text-zinc-500 text-xs mb-1">Tiempo Total</p>
              <p class="text-3xl font-bold text-[#101918] dark:text-white">{{ totalTimeSpent }}m</p>
            </div>
          </div>
        </div>

        <!-- Settings View -->
        <div v-if="currentView === 'settings'" class="px-6 py-6">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-[#101918] dark:text-white mb-2">Configuración</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">Personaliza tu experiencia de aprendizaje</p>
          </div>

          <!-- Theme Settings -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-[#101918] dark:text-white mb-3 uppercase tracking-wider">Apariencia</h4>
            <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">dark_mode</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Modo Oscuro</p>
                    <p class="text-xs text-zinc-500">Reduce la fatiga visual</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.darkMode" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>
            </div>
          </div>

          <!-- Interaction Settings -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-[#101918] dark:text-white mb-3 uppercase tracking-wider">Interactividad</h4>
            <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">animation</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Animaciones</p>
                    <p class="text-xs text-zinc-500">Efectos visuales en metáforas</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.animations" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>

              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">vibration</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Retroalimentación Háptica</p>
                    <p class="text-xs text-zinc-500">Vibraciones al interactuar</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.haptics" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>

              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">volume_up</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Sonidos</p>
                    <p class="text-xs text-zinc-500">Efectos de audio</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.sounds" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>
            </div>
          </div>

          <!-- Learning Preferences -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-[#101918] dark:text-white mb-3 uppercase tracking-wider">Preferencias de Aprendizaje</h4>
            <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">quiz</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Mostrar Tips Automáticamente</p>
                    <p class="text-xs text-zinc-500">Consejos de salud al completar</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.autoTips" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>

              <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-clinical-blue">auto_awesome</span>
                  <div>
                    <p class="font-semibold text-[#101918] dark:text-white text-sm">Sugerencias Inteligentes</p>
                    <p class="text-xs text-zinc-500">Recomendaciones personalizadas</p>
                  </div>
                </div>
                <input type="checkbox" v-model="settings.smartSuggestions" class="w-5 h-5 text-clinical-blue-500 rounded" />
              </label>
            </div>
          </div>

          <!-- Reset Progress -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-[#101918] dark:text-white mb-3 uppercase tracking-wider">Datos</h4>
            <button @click="resetProgress" class="w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              Reiniciar Todo el Progreso
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around px-6">
        <button @click="currentView = 'metaphors'" :class="['flex flex-col items-center gap-1 transition-colors', currentView === 'metaphors' ? 'text-clinical-blue' : 'text-zinc-400']">
          <span :class="['material-symbols-outlined text-[28px]', currentView === 'metaphors' ? 'fill-1' : '']">school</span>
          <span class="text-[10px] font-bold">Aprender</span>
        </button>
        <button @click="currentView = 'progress'" :class="['flex flex-col items-center gap-1 transition-colors', currentView === 'progress' ? 'text-clinical-blue' : 'text-zinc-400']">
          <span :class="['material-symbols-outlined text-[28px]', currentView === 'progress' ? 'fill-1' : '']">analytics</span>
          <span class="text-[10px] font-bold">Progreso</span>
        </button>
        <button @click="currentView = 'settings'" :class="['flex flex-col items-center gap-1 transition-colors', currentView === 'settings' ? 'text-clinical-blue' : 'text-zinc-400']">
          <span :class="['material-symbols-outlined text-[28px]', currentView === 'settings' ? 'fill-1' : '']">settings</span>
          <span class="text-[10px] font-bold">Ajustes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigation
const currentView = ref<'metaphors' | 'progress' | 'settings'>('metaphors')

const goBack = () => {
  if (currentView.value !== 'metaphors') {
    currentView.value = 'metaphors'
  } else {
    router.push('/patient/dashboard')
  }
}

// Metaphors data
const metaphors = ref([
  {
    id: 'sponge',
    name: 'Esponja de Sal',
    description: 'Sodio y volumen sanguíneo',
    icon: 'water_drop',
    progress: 100,
    completed: true
  },
  {
    id: 'pump',
    name: 'Bomba Cardíaca',
    description: 'Ritmo cardíaco y ejercicio',
    icon: 'favorite',
    progress: 65,
    completed: false
  },
  {
    id: 'highway',
    name: 'Autopista Sanguínea',
    description: 'Arterias y colesterol',
    icon: 'route',
    progress: 40,
    completed: false
  }
])

const selectedMetaphor = ref('sponge')

// Sponge metaphor
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

// Heart Pump metaphor
const heartRate = ref(72)
const heartBeating = ref(false)
let heartInterval: ReturnType<typeof setInterval> | null = null

const simulateExercise = () => {
  heartBeating.value = true
  heartRate.value = 140

  if (heartInterval) clearInterval(heartInterval)

  heartInterval = setInterval(() => {
    if (heartRate.value > 72) {
      heartRate.value -= 5
    } else {
      heartBeating.value = false
      if (heartInterval) clearInterval(heartInterval)
    }
  }, 500)
}

const simulateRest = () => {
  heartBeating.value = false
  heartRate.value = 72
  if (heartInterval) clearInterval(heartInterval)
}

// Blood Highway metaphor
const blockageLevel = ref(30)
const arteryBlocked = computed(() => blockageLevel.value > 50)

// Tips
const tips = [
  'Menos sal = Menos presión. Reducir el sodio evita que tu cuerpo retenga líquidos en exceso, protegiendo tu corazón.',
  'El ejercicio regular fortalece tu corazón como músculo. Empieza despacio y aumenta gradualmente la intensidad.',
  'Una dieta baja en grasas saturadas ayuda a mantener tus arterias limpias y el flujo sanguíneo óptimo.'
]

const currentTip = computed(() => {
  if (selectedMetaphor.value === 'sponge') return tips[0]
  if (selectedMetaphor.value === 'pump') return tips[1]
  return tips[2]
})

// Progress
const overallProgress = computed(() => {
  const total = metaphors.value.reduce((sum, m) => sum + m.progress, 0)
  return Math.round(total / metaphors.value.length)
})

const completedMetaphors = computed(() => {
  return metaphors.value.filter(m => m.completed).length
})

const totalTimeSpent = ref(45)

// Settings
const settings = ref({
  darkMode: false,
  animations: true,
  haptics: true,
  sounds: false,
  autoTips: true,
  smartSuggestions: true
})

const resetProgress = () => {
  if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
    metaphors.value.forEach(m => {
      m.progress = 0
      m.completed = false
    })
    totalTimeSpent.value = 0
    alert('Progreso reiniciado exitosamente')
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

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes flow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(400%);
    opacity: 0;
  }
}

.animate-flow {
  animation: flow 3s infinite linear;
}

/* Custom Range Slider Styling */
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: 3px solid white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.slider-thumb::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.slider-thumb::-webkit-slider-thumb:active {
  transform: scale(1.1);
}

.slider-thumb::-moz-range-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: 3px solid white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.slider-thumb::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.slider-thumb::-moz-range-thumb:active {
  transform: scale(1.1);
}

/* Progress fill for slider */
.slider-thumb::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--value), #e5e7eb var(--value), #e5e7eb 100%);
  height: 8px;
  border-radius: 4px;
}

.slider-thumb::-moz-range-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

.slider-thumb::-moz-range-progress {
  background: #3b82f6;
  height: 8px;
  border-radius: 4px;
}
</style>
