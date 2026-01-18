<template>
  <div class="bg-clinical-white text-text-main font-body min-h-screen flex flex-col overflow-x-hidden selection:bg-clinical-blue-100 selection:text-clinical-blue-600">
    <header class="sticky top-0 z-30 bg-clinical-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-50">
      <div class="flex flex-col">
        <h1 class="text-2xl font-display font-bold text-clinical-blue-500 tracking-tight">Hola, Sarah! 👋</h1>
        <p class="text-sm text-text-muted font-medium">Monday, Oct 24</p>
      </div>
      <button class="relative h-11 w-11 rounded-full p-1 bg-white shadow-card overflow-hidden transition-transform active:scale-95 ring-2 ring-clinical-blue-100">
        <img class="h-full w-full rounded-full object-cover" alt="User profile avatar portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_yeCigtYGAs6h4Q4mmDsrpneVTk_sK5d1U98U53ahDX9igXFjx6idHwNeJT2_8zonZMZsCXvfaF7HdK-UOpTBTB8VVA2up2lSqocIdrjSeeRGrOMqoJSmMTMPn82pyTBx6dlvmHqr3KzdGPpIjYo1C2DQz-qkItoYQPGCcx0-YYYGVfRVtv3BNetJZIeR4wpWV4c_yzNmvI-WOB0HIqrym0h_jHJvZAPjqdoUvAc7MaMDVQl4MAILDuL3f8Ljqyz1S9YnyaT5zXM"/>
        <div class="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-health-green-500 border-2 border-white"></div>
      </button>
    </header>

    <main class="flex-1 px-5 pb-28 space-y-6 max-w-md mx-auto w-full pt-4">
      <!-- Biometric Watch Card -->
      <section class="rounded-3xl bg-white p-5 relative overflow-hidden shadow-soft flex items-center justify-between border border-clinical-blue-50">
        <div class="flex flex-col gap-1 z-10">
          <div class="flex items-center gap-2 mb-1">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-health-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-health-green-500"></span>
            </span>
            <span class="text-health-green-500 text-xs font-bold uppercase tracking-wider">Connected</span>
          </div>
          <h2 class="text-lg font-display font-bold text-clinical-blue-500 leading-tight">Biometric Watch</h2>
          <div class="flex items-center gap-2 text-text-muted text-xs">
            <span class="material-symbols-outlined text-[14px]">sync</span>
            <span>Synced 2m ago</span>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-clinical-blue-500 bg-clinical-blue-50 px-3 py-1 rounded-full w-fit">
            <span class="material-symbols-outlined text-[16px]">battery_5_bar</span>
            <span class="text-xs font-bold">85%</span>
          </div>
        </div>
        <div class="w-24 h-24 relative flex-shrink-0">
          <div class="absolute inset-0 bg-clinical-blue-100 rounded-full blur-2xl opacity-60"></div>
          <img class="relative z-10 w-full h-full object-contain transform -rotate-12" alt="Smart wearable watch device angled view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEeb1potnuOvtBGIf7lH4Fc0KumKWkTl6q_F59kO6Ovwp6DpXNDTcMWkx5_5MaeD8OtOVn6biEllLj2fDC2ZEcrHPSQJOvatGrlxY2Na3wz-yxq2X8rl_5A-gVPQ0fNTv3iY6rgBcVpNus7SegZy02t6lHVCJntYYs8zpO5h98m6fNr5lM5BPg9Xy1v4YehnxGwP3ZWEjW8Cg9mN67QSD6qyXmgHt70ATuqMd27jSJ6DYgKrPf_qNiIiQGbqKJ9aXfqJf58m-eO0"/>
        </div>
      </section>

      <!-- Streak Card -->
      <section class="rounded-3xl bg-gradient-to-br from-clinical-blue-50 to-white border border-clinical-blue-100 p-5 shadow-soft relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-health-green-100/30 rounded-full blur-xl"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-white rounded-full shadow-sm text-clinical-blue-500">
                <span class="material-symbols-outlined filled text-[24px]">local_fire_department</span>
              </div>
              <div>
                <h3 class="font-display font-bold text-lg text-clinical-blue-500">7 Day Streak!</h3>
                <p class="text-xs text-text-muted font-medium">You're on track, keep it up!</p>
              </div>
            </div>
            <div class="text-center">
              <span class="text-2xl font-display font-bold text-clinical-blue-500">7</span>
              <span class="block text-[10px] text-text-muted uppercase font-bold">Days</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold text-text-muted">
              <span>Progress to Silver Badge</span>
              <span class="text-health-green-500">70%</span>
            </div>
            <div class="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner p-0.5">
              <div class="bg-health-green-500 h-full w-[70%] rounded-full relative">
                <div class="absolute right-0 top-0 bottom-0 w-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p class="text-right text-[10px] text-health-green-600 font-medium pt-1">3 more days to unlock reward!</p>
          </div>
        </div>
      </section>

      <!-- My Circle -->
      <section>
        <div class="flex items-center justify-between px-2 mb-3">
          <h3 class="text-base font-display font-bold text-clinical-blue-500">My Circle</h3>
          <button class="text-xs text-clinical-blue-500 font-bold hover:text-clinical-blue-600">Manage</button>
        </div>
        <div class="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar pl-1">
          <button class="flex-shrink-0 flex flex-col items-center gap-2 group">
            <div class="h-14 w-14 rounded-full border-2 border-dashed border-clinical-blue-200 flex items-center justify-center text-clinical-blue-400 bg-white group-hover:bg-clinical-blue-50 transition-colors">
              <span class="material-symbols-outlined">add</span>
            </div>
            <span class="text-[10px] font-medium text-text-muted">Invite</span>
          </button>
          <div class="flex-shrink-0 flex flex-col items-center gap-2 relative">
            <div class="relative">
              <img alt="Mom" class="h-14 w-14 rounded-full border-2 border-white shadow-sm object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUqbvh8-hrRfjwTpWY3yYfj3mm-qWZ8tOZvtO5gBdV25E6EsqDedR8prf-kTUS338EhVnCxBmLN_TeUUKATZFVdCseCTLKvzqUNjJH5VXx4baPOewG8vjhloF9uk1OZkBcmWWfVRb6WONL74GZm6zoGtzhPg0HrLFC07WhhKW1YNMgLiABo-MqHoWTq_rWfp5SMNRg0f8W4G43vz-vL28VOiF4pGfPaHxKSfdpZ773Uk7k-vBJXXwT0airKXw7sERRgphYP8MZP8"/>
              <div class="absolute bottom-0 right-0 h-3.5 w-3.5 bg-health-green-400 border-2 border-white rounded-full"></div>
            </div>
            <span class="text-[10px] font-medium text-text-main">Mom</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2 relative">
            <div class="relative">
              <img alt="Dr. Smith" class="h-14 w-14 rounded-full border-2 border-white shadow-sm object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6fkaZrd-XgPLTOTZ_bMtgko1-IAhBSiM41RnQxZ9X1O8ntPw4rsRjUeuADRF-dnXMFN2dlaMYMkDmJb_nwz8D7ZoMg4JNnRzjD4proPW--USoDzlZWJIp9tKQtgbi5Y_t46i0BIrzudaswCRBn6mw67RuTeiuGcZCi0FS_DArU9LG81VmlAMGTYtSaMkQxAsXMOqoezzHEgtmgCddnFs2ufphEasxRsTH0QuB6YF5Sc_LYY4-qtp7Oskd2EevBC7iNmuhnF1K1b8"/>
              <div class="absolute bottom-0 right-0 h-3.5 w-3.5 bg-gray-300 border-2 border-white rounded-full"></div>
            </div>
            <span class="text-[10px] font-medium text-text-main">Dr. Lee</span>
          </div>
          <div class="flex-shrink-0 flex flex-col items-center gap-2 relative">
            <div class="relative">
              <img alt="Sister" class="h-14 w-14 rounded-full border-2 border-white shadow-sm object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwlHWvRCaX3g0S5wqsD71MSRZkqLW14v54-PPoGKZwHJhiUydo_Ojjbye9UinTz8fJRv5XKelCDB8psPP9gvZhcMHsEoUV9wHdGZKoO-Zn9Z_F7pmDKbqeb4-Kh1OJcks1TFRoRdShKVUgHXgDRPz5PXqtXA3V-5ZmbdZI7cNLKJVFA-Q7DhG7ZZfHQn3Zb3s0MrmgBjXN2rXg3wbKUk1IxIyRjgySnMu2OurbU0HH3mfZAAAXoRDhkg7QVXCrauDhZ551l0VY_Wc"/>
              <div class="absolute bottom-0 right-0 h-3.5 w-3.5 bg-health-green-400 border-2 border-white rounded-full"></div>
            </div>
            <span class="text-[10px] font-medium text-text-main">Carla</span>
          </div>
        </div>
      </section>

      <!-- Health Metrics Grid -->
      <section class="grid grid-cols-2 gap-4">
        <!-- BP Card -->
        <div class="col-span-2 sm:col-span-1 rounded-3xl bg-white p-5 shadow-soft flex flex-col items-center relative border border-gray-50">
          <div class="w-full flex justify-between items-center mb-1">
            <span class="text-text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-clinical-blue-400">favorite</span>
              BP
            </span>
            <span class="material-symbols-outlined text-gray-300 text-[18px]">more_horiz</span>
          </div>
          <div class="relative w-36 h-20 mt-1 flex justify-center overflow-hidden">
            <svg class="w-full h-full transform translate-y-2" viewBox="0 0 100 55">
              <path class="gauge-bg" d="M 10 50 A 40 40 0 0 1 90 50"></path>
              <path class="gauge-value" d="M 10 50 A 40 40 0 0 1 90 50"></path>
            </svg>
            <div class="absolute bottom-0 flex flex-col items-center">
              <span class="text-2xl font-display font-bold text-clinical-blue-500">120/80</span>
              <span class="text-[10px] text-text-muted">mmHg</span>
            </div>
          </div>
          <div class="mt-2 text-xs font-semibold text-health-green-600 bg-health-green-50 px-3 py-1 rounded-full">
            Normal Range
          </div>
        </div>

        <!-- Heart & Sleep -->
        <div class="col-span-2 sm:col-span-1 grid grid-cols-2 gap-3">
          <div class="col-span-1 sm:col-span-2 rounded-3xl bg-white p-4 shadow-soft flex flex-col justify-center border border-gray-50">
            <div class="flex items-center gap-1.5 mb-2">
              <div class="p-1.5 bg-clinical-blue-50 rounded-full text-clinical-blue-400">
                <span class="material-symbols-outlined text-[16px]">ecg_heart</span>
              </div>
              <span class="text-[10px] font-bold text-text-muted uppercase">Heart</span>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-xl font-display font-bold text-text-main">72</span>
              <span class="text-[10px] text-text-muted mb-1">bpm</span>
            </div>
          </div>
          <div class="col-span-1 sm:col-span-2 rounded-3xl bg-clinical-blue-50/50 p-4 shadow-sm flex flex-col justify-center border border-clinical-blue-100/50">
            <div class="flex items-center gap-1.5 mb-2">
              <div class="p-1.5 bg-white rounded-full text-clinical-blue-500">
                <span class="material-symbols-outlined text-[16px]">bedtime</span>
              </div>
              <span class="text-[10px] font-bold text-text-muted uppercase">Sleep</span>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-xl font-display font-bold text-text-main">7h 20</span>
              <span class="text-[10px] text-text-muted mb-1">hrs</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section>
        <h3 class="text-base font-display font-bold text-clinical-blue-500 mb-3 px-2">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          <button class="flex flex-col gap-3 p-4 rounded-2xl bg-white shadow-card border border-gray-100 active:scale-95 transition-transform text-left group">
            <div class="w-10 h-10 rounded-full bg-clinical-blue-50 flex items-center justify-center group-hover:bg-clinical-blue-100 transition-colors text-clinical-blue-500">
              <span class="material-symbols-outlined">ios_share</span>
            </div>
            <div>
              <span class="block text-sm font-bold text-text-main">Share Data</span>
              <span class="block text-xs text-text-muted mt-0.5">Send PDF report</span>
            </div>
          </button>
          <button class="flex flex-col gap-3 p-4 rounded-2xl bg-white shadow-card border border-gray-100 active:scale-95 transition-transform text-left group">
            <div class="w-10 h-10 rounded-full bg-clinical-blue-50 flex items-center justify-center group-hover:bg-clinical-blue-100 transition-colors text-clinical-blue-500">
              <span class="material-symbols-outlined">stethoscope</span>
            </div>
            <div>
              <span class="block text-sm font-bold text-text-main">Find Doctor</span>
              <span class="block text-xs text-text-muted mt-0.5">Book visit</span>
            </div>
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-6 left-6 right-6 z-40">
      <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(31,79,216,0.12)] border border-clinical-blue-50/50 px-6 py-4 flex justify-between items-center max-w-sm mx-auto">
        <button @click="$emit('navigate', 'dashboard')" class="flex flex-col items-center gap-1 text-clinical-blue-500">
          <span class="material-symbols-outlined filled">grid_view</span>
        </button>
        <button @click="$emit('navigate', 'achievements')" class="flex flex-col items-center gap-1 text-gray-400 hover:text-clinical-blue-500 transition-colors">
          <span class="material-symbols-outlined">insert_chart</span>
        </button>
        <div class="relative -top-8">
          <button @click="$emit('navigate', 'bluetooth')" class="h-14 w-14 rounded-full bg-clinical-blue-500 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-white border-4 border-white">
            <span class="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
        <button @click="$emit('navigate', 'metaphors')" class="flex flex-col items-center gap-1 text-gray-400 hover:text-clinical-blue-500 transition-colors">
          <span class="material-symbols-outlined">watch</span>
        </button>
        <button @click="handleLogout" class="flex flex-col items-center gap-1 text-gray-400 hover:text-clinical-blue-500 transition-colors">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['navigate'])
const { logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

<style scoped>
.gauge-bg {
  stroke: #e8effd;
  stroke-width: 10;
  fill: none;
  stroke-linecap: round;
}

.gauge-value {
  stroke: #2FBF9B;
  stroke-width: 10;
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 251;
  stroke-dashoffset: 60;
  transition: stroke-dashoffset 1s ease-out;
}

body {
  -webkit-tap-highlight-color: transparent;
}
</style>
