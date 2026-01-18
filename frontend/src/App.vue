<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from './composables/useAuth'
import LoginScreen from './components/auth/LoginScreen.vue'
import OnboardingWelcome from './components/patient/OnboardingWelcome.vue'
import OnboardingPermissions from './components/patient/OnboardingPermissions.vue'
import OnboardingProfile from './components/patient/OnboardingProfile.vue'
import OnboardingComplete from './components/patient/OnboardingComplete.vue'
import HealthTrends from './components/patient/HealthTrends.vue'
import EducationHub from './components/patient/EducationHub.vue'
import BluetoothConnection from './components/BluetoothConnection.vue'
import DynamicCalibration from './components/DynamicCalibration.vue'
import HealthMetaphors from './components/HealthMetaphors.vue'
import PatientDashboard from './components/PatientDashboard.vue'
import Achievements from './components/Achievements.vue'
import ClinicalDashboard from './components/clinical/Dashboard.vue'
import ClinicalPatientList from './components/clinical/PatientList.vue'
import ClinicalAlerts from './components/clinical/Alerts.vue'
import PatientDetail from './components/clinical/PatientDetail.vue'
import FamilyDashboard from './components/family/Dashboard.vue'
import FamilyMessages from './components/family/Messages.vue'
import FamilyNotifications from './components/family/Notifications.vue'

const {
  currentUser,
  isAuthenticated,
  hasCompletedOnboarding,
  isPatient,
  isClinical,
  isFamily,
  initialize
} = useAuth()

// Screen navigation
type PatientScreen =
  | 'onboarding-welcome' | 'onboarding-permissions'
  | 'bluetooth' | 'calibration' | 'onboarding-profile' | 'onboarding-complete'
  | 'dashboard' | 'trends' | 'education' | 'metaphors' | 'achievements'

type ClinicalScreen = 'dashboard' | 'patients' | 'alerts' | `patient-detail-${number}`
type FamilyScreen = 'dashboard' | 'notifications' | 'messages'

const currentPatientScreen = ref<PatientScreen>('onboarding-welcome')
const currentClinicalScreen = ref<ClinicalScreen>('dashboard')
const currentFamilyScreen = ref<FamilyScreen>('dashboard')

// Navigation handlers
const navigatePatient = (screen: PatientScreen | string) => {
  currentPatientScreen.value = screen as PatientScreen
}

const navigateClinical = (screen: ClinicalScreen | string) => {
  currentClinicalScreen.value = screen as ClinicalScreen
}

const navigateFamily = (screen: FamilyScreen | string) => {
  currentFamilyScreen.value = screen as FamilyScreen
}

// Determine which screen to show
const showOnboarding = computed(() => {
  return isPatient.value && !hasCompletedOnboarding.value
})

// Initialize auth on mount
onMounted(() => {
  // Para el hackathon: siempre limpiar sesión al recargar para poder cambiar de perfil fácilmente
  logout()

  // No inicializar desde localStorage para que siempre vaya al login al recargar
  // initialize()
})
</script>

<template>
  <div class="app-container">
    <!-- LOGIN SCREEN -->
    <LoginScreen v-if="!isAuthenticated" />

    <!-- PATIENT PROFILE -->
    <div v-else-if="isPatient">
      <!-- Onboarding Flow (if not completed) -->
      <div v-if="showOnboarding">
        <!-- Step 1: Welcome -->
        <OnboardingWelcome
          v-if="currentPatientScreen === 'onboarding-welcome'"
          @navigate="navigatePatient"
        />

        <!-- Step 2: Permissions -->
        <OnboardingPermissions
          v-else-if="currentPatientScreen === 'onboarding-permissions'"
          @navigate="navigatePatient"
        />

        <!-- Step 3: Bluetooth (existing) -->
        <BluetoothConnection
          v-else-if="currentPatientScreen === 'bluetooth'"
          @navigate="navigatePatient"
        />

        <!-- Step 4: Calibration (existing) -->
        <DynamicCalibration
          v-else-if="currentPatientScreen === 'calibration'"
          @navigate="navigatePatient"
        />

        <!-- Step 5: Profile -->
        <OnboardingProfile
          v-else-if="currentPatientScreen === 'onboarding-profile'"
          @navigate="navigatePatient"
        />

        <!-- Step 6: Complete -->
        <OnboardingComplete
          v-else-if="currentPatientScreen === 'onboarding-complete'"
          @navigate="navigatePatient"
        />

        <!-- Default: Start with welcome -->
        <OnboardingWelcome v-else @navigate="navigatePatient" />
      </div>

      <!-- Patient Main App (after onboarding or skip) -->
      <div v-else>
        <!-- Bluetooth Connection -->
        <BluetoothConnection
          v-if="currentPatientScreen === 'bluetooth'"
          @navigate="navigatePatient"
        />

        <!-- Dynamic Calibration -->
        <DynamicCalibration
          v-else-if="currentPatientScreen === 'calibration'"
          @navigate="navigatePatient"
        />

        <!-- Health Metaphors -->
        <HealthMetaphors
          v-else-if="currentPatientScreen === 'metaphors'"
          @navigate="navigatePatient"
        />

        <!-- Patient Dashboard -->
        <PatientDashboard
          v-else-if="currentPatientScreen === 'dashboard'"
          @navigate="navigatePatient"
        />

        <!-- Achievements -->
        <Achievements
          v-else-if="currentPatientScreen === 'achievements'"
          @navigate="navigatePatient"
        />

        <!-- Health Trends -->
        <HealthTrends
          v-else-if="currentPatientScreen === 'trends'"
          @navigate="navigatePatient"
        />

        <!-- Education Hub -->
        <EducationHub
          v-else-if="currentPatientScreen === 'education'"
          @navigate="navigatePatient"
        />
      </div>
    </div>

    <!-- CLINICAL PROFILE -->
    <div v-else-if="isClinical">
      <ClinicalDashboard
        v-if="currentClinicalScreen === 'dashboard'"
        @navigate="navigateClinical"
      />
      <ClinicalPatientList
        v-else-if="currentClinicalScreen === 'patients'"
        @navigate="navigateClinical"
      />
      <ClinicalAlerts
        v-else-if="currentClinicalScreen === 'alerts'"
        @navigate="navigateClinical"
      />
      <PatientDetail
        v-else-if="currentClinicalScreen.startsWith('patient-detail-')"
        :patient-id="parseInt(currentClinicalScreen.split('-')[2])"
        @navigate="navigateClinical"
      />
    </div>

    <!-- FAMILY PROFILE -->
    <div v-else-if="isFamily">
      <FamilyDashboard
        v-if="currentFamilyScreen === 'dashboard'"
        @navigate="navigateFamily"
      />
      <FamilyNotifications
        v-else-if="currentFamilyScreen === 'notifications'"
        @navigate="navigateFamily"
      />
      <FamilyMessages
        v-else-if="currentFamilyScreen === 'messages'"
        @navigate="navigateFamily"
      />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(31, 79, 216, 0.08);
}
</style>
