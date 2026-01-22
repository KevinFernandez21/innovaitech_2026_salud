<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockDoctors, type Doctor } from '../../api/mockData'

const router = useRouter()

const searchQuery = ref('')
const selectedSpecialty = ref<'all' | 'Cardiología' | 'Medicina General'>('all')
const selectedDoctor = ref<Doctor | null>(null)
const showBookingModal = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')
const appointmentReason = ref('')

// Filtered doctors based on search and specialty
const filteredDoctors = computed(() => {
  let filtered = mockDoctors

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      d =>
        d.name.toLowerCase().includes(query) ||
        d.specialty.toLowerCase().includes(query) ||
        d.clinic.toLowerCase().includes(query)
    )
  }

  // Filter by specialty
  if (selectedSpecialty.value !== 'all') {
    filtered = filtered.filter(d => d.specialty === selectedSpecialty.value)
  }

  return filtered
})

const openBookingModal = (doctor: Doctor) => {
  selectedDoctor.value = doctor
  showBookingModal.value = true
  selectedDate.value = ''
  selectedTime.value = ''
  appointmentReason.value = ''
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedDoctor.value = null
}

const bookAppointment = () => {
  if (selectedDate.value && selectedTime.value && appointmentReason.value) {
    // In a real app, this would make an API call
    alert(`¡Cita agendada con ${selectedDoctor.value?.name}!\nFecha: ${selectedDate.value}\nHora: ${selectedTime.value}\nMotivo: ${appointmentReason.value}`)
    closeBookingModal()
  } else {
    alert('Por favor completa todos los campos')
  }
}

// Generate star rating
const getStarArray = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  return { fullStars, hasHalfStar }
}
</script>

<template>
  <div class="min-h-screen bg-white pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div class="px-6 py-4 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-4">
          <button
            @click="router.push('/patient/dashboard')"
            class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">arrow_back</span>
          </button>
          <h1 class="text-lg font-bold text-text-main">Find Doctor</h1>
          <div class="w-10"></div>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-3">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, especialidad o clínica..."
            class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors text-sm"
          />
        </div>

        <!-- Specialty Filters -->
        <div class="flex gap-2">
          <button
            @click="selectedSpecialty = 'all'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              selectedSpecialty === 'all'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Todos
          </button>
          <button
            @click="selectedSpecialty = 'Cardiología'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all',
              selectedSpecialty === 'Cardiología'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Cardiología
          </button>
          <button
            @click="selectedSpecialty = 'Medicina General'"
            :class="[
              'flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
              selectedSpecialty === 'Medicina General'
                ? 'bg-clinical-blue-500 text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            ]"
          >
            Medicina General
          </button>
        </div>
      </div>
    </header>

    <!-- Doctors List -->
    <main class="max-w-md mx-auto px-4 py-6">
      <p class="text-sm text-text-muted mb-4 px-2">{{ filteredDoctors.length }} doctores disponibles</p>

      <div v-if="filteredDoctors.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">person_search</span>
        <p class="text-text-muted">No se encontraron doctores</p>
      </div>

      <div class="space-y-3">
        <div
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="bg-white rounded-2xl p-5 shadow-soft border-2 border-gray-100 hover:border-clinical-blue-200 transition-all"
        >
          <div class="flex gap-4">
            <!-- Doctor Avatar -->
            <img :src="doctor.avatar" :alt="doctor.name" class="w-16 h-16 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100">

            <!-- Doctor Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <div class="flex-1">
                  <h3 class="font-bold text-text-main text-base">{{ doctor.name }}</h3>
                  <p class="text-sm text-clinical-blue-500 font-medium">{{ doctor.specialty }}</p>
                </div>
                <div class="flex items-center gap-1 bg-health-green-50 px-2 py-1 rounded-lg flex-shrink-0">
                  <span class="material-symbols-outlined text-health-green-500 text-sm filled">star</span>
                  <span class="text-xs font-bold text-health-green-700">{{ doctor.rating }}</span>
                </div>
              </div>

              <!-- Experience & Clinic -->
              <div class="flex items-center gap-3 text-xs text-text-muted mb-2">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">work</span>
                  <span>{{ doctor.experience }} años</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">local_hospital</span>
                  <span>{{ doctor.clinic }}</span>
                </div>
              </div>

              <!-- Available Times -->
              <div class="mb-3">
                <p class="text-xs font-semibold text-text-muted mb-1">Próxima disponibilidad:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(time, index) in doctor.available_times.slice(0, 2)"
                    :key="index"
                    class="text-xs bg-clinical-blue-50 text-clinical-blue-600 px-2 py-1 rounded-md font-medium"
                  >
                    {{ time }}
                  </span>
                  <span
                    v-if="doctor.available_times.length > 2"
                    class="text-xs text-text-muted px-2 py-1"
                  >
                    +{{ doctor.available_times.length - 2 }} más
                  </span>
                </div>
              </div>

              <!-- Book Button -->
              <button
                @click="openBookingModal(doctor)"
                class="w-full bg-clinical-blue-500 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-clinical-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-base">calendar_month</span>
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Booking Modal -->
    <div
      v-if="showBookingModal && selectedDoctor"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeBookingModal"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-text-main">Agendar Cita</h2>
          <button
            @click="closeBookingModal"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        <!-- Doctor Info -->
        <div class="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
          <img :src="selectedDoctor.avatar" :alt="selectedDoctor.name" class="w-12 h-12 rounded-full object-cover">
          <div>
            <p class="font-bold text-text-main">{{ selectedDoctor.name }}</p>
            <p class="text-sm text-text-muted">{{ selectedDoctor.specialty }}</p>
          </div>
        </div>

        <!-- Booking Form -->
        <div class="space-y-4">
          <!-- Date Selection -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">Fecha</label>
            <input
              v-model="selectedDate"
              type="date"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Time Selection -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">Hora disponible</label>
            <select
              v-model="selectedTime"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Selecciona una hora</option>
              <option v-for="(time, index) in selectedDoctor.available_times" :key="index" :value="time">
                {{ time }}
              </option>
            </select>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-semibold text-text-main mb-2">Motivo de la consulta</label>
            <textarea
              v-model="appointmentReason"
              rows="3"
              placeholder="Describe brevemente el motivo de tu consulta..."
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-clinical-blue-500 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Contact Info -->
          <div class="bg-clinical-blue-50 rounded-xl p-4">
            <p class="text-xs font-semibold text-clinical-blue-700 mb-2">Información de contacto</p>
            <div class="space-y-1 text-xs text-clinical-blue-600">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">call</span>
                <span>{{ selectedDoctor.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">email</span>
                <span>{{ selectedDoctor.email }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-2">
            <button
              @click="closeBookingModal"
              class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="bookAppointment"
              class="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-clinical-blue-500 text-white hover:bg-clinical-blue-600 transition-all active:scale-95"
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
</style>
