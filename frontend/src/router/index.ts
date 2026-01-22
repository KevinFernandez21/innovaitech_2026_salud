import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard, roleGuard, onboardingGuard } from './guards'

// Auth Components
import LoginScreen from '../components/auth/LoginScreen.vue'

// Patient Components - Onboarding
import OnboardingWelcome from '../components/patient/OnboardingWelcome.vue'
import DataConsent from '../components/patient/DataConsent.vue'
import OnboardingPermissions from '../components/patient/OnboardingPermissions.vue'
import OnboardingProfile from '../components/patient/OnboardingProfile.vue'
import OnboardingComplete from '../components/patient/OnboardingComplete.vue'

// Patient Components - Main App
import PatientDashboard from '../components/PatientDashboard.vue'
import HealthTrends from '../components/patient/HealthTrends.vue'
import EducationHub from '../components/patient/EducationHub.vue'
import HealthMetaphors from '../components/HealthMetaphors.vue'
import Achievements from '../components/Achievements.vue'
import FindDoctor from '../components/patient/FindDoctor.vue'

// Shared Components (used in multiple contexts)
import BluetoothConnection from '../components/BluetoothConnection.vue'
import DynamicCalibration from '../components/DynamicCalibration.vue'

// Clinical Components
import ClinicalDashboard from '../components/clinical/Dashboard.vue'
import PatientList from '../components/clinical/PatientList.vue'
import ClinicalAlerts from '../components/clinical/Alerts.vue'
import PatientDetail from '../components/clinical/PatientDetail.vue'

// Family Components
import FamilyDashboard from '../components/family/Dashboard.vue'
import FamilyNotifications from '../components/family/Notifications.vue'
import FamilyMessages from '../components/family/Messages.vue'
import FamilyVitals from '../components/family/Vitals.vue'
import FamilyHistory from '../components/family/History.vue'

const routes: RouteRecordRaw[] = [
  // Root - Login Screen
  {
    path: '/',
    name: 'login',
    component: LoginScreen,
    meta: { requiresAuth: false }
  },

  // Patient Routes
  {
    path: '/patient',
    redirect: '/patient/dashboard',
    meta: { requiresAuth: true, role: 'patient' }
  },
  {
    path: '/patient/onboarding',
    meta: { requiresAuth: true, role: 'patient' },
    children: [
      {
        path: 'welcome',
        name: 'patient-onboarding-welcome',
        component: OnboardingWelcome,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 1 }
      },
      {
        path: 'consent',
        name: 'patient-onboarding-consent',
        component: DataConsent,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 2 }
      },
      {
        path: 'permissions',
        name: 'patient-onboarding-permissions',
        component: OnboardingPermissions,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 3 }
      },
      {
        path: 'bluetooth',
        name: 'patient-onboarding-bluetooth',
        component: BluetoothConnection,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 4 }
      },
      {
        path: 'calibration',
        name: 'patient-onboarding-calibration',
        component: DynamicCalibration,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 5 }
      },
      {
        path: 'profile',
        name: 'patient-onboarding-profile',
        component: OnboardingProfile,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 6 }
      },
      {
        path: 'complete',
        name: 'patient-onboarding-complete',
        component: OnboardingComplete,
        meta: { requiresAuth: true, role: 'patient', onboardingStep: 7 }
      }
    ]
  },
  {
    path: '/patient/dashboard',
    name: 'patient-dashboard',
    component: PatientDashboard,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/trends',
    name: 'patient-trends',
    component: HealthTrends,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/education',
    name: 'patient-education',
    component: EducationHub,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/metaphors',
    name: 'patient-metaphors',
    component: HealthMetaphors,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/achievements',
    name: 'patient-achievements',
    component: Achievements,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/device/bluetooth',
    name: 'patient-device-bluetooth',
    component: BluetoothConnection,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/device/calibration',
    name: 'patient-device-calibration',
    component: DynamicCalibration,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },
  {
    path: '/patient/find-doctor',
    name: 'patient-find-doctor',
    component: FindDoctor,
    meta: { requiresAuth: true, role: 'patient', requiresOnboarding: true }
  },

  // Clinical Routes
  {
    path: '/clinical',
    redirect: '/clinical/dashboard',
    meta: { requiresAuth: true, role: 'clinical' }
  },
  {
    path: '/clinical/dashboard',
    name: 'clinical-dashboard',
    component: ClinicalDashboard,
    meta: { requiresAuth: true, role: 'clinical' }
  },
  {
    path: '/clinical/patients',
    name: 'clinical-patients',
    component: PatientList,
    meta: { requiresAuth: true, role: 'clinical' }
  },
  {
    path: '/clinical/alerts',
    name: 'clinical-alerts',
    component: ClinicalAlerts,
    meta: { requiresAuth: true, role: 'clinical' }
  },
  {
    path: '/clinical/patient/:id',
    name: 'clinical-patient-detail',
    component: PatientDetail,
    props: (route) => ({ patientId: parseInt(route.params.id as string) }),
    meta: { requiresAuth: true, role: 'clinical' }
  },

  // Family Routes
  {
    path: '/family',
    redirect: '/family/dashboard',
    meta: { requiresAuth: true, role: 'family' }
  },
  {
    path: '/family/dashboard',
    name: 'family-dashboard',
    component: FamilyDashboard,
    meta: { requiresAuth: true, role: 'family' }
  },
  {
    path: '/family/notifications',
    name: 'family-notifications',
    component: FamilyNotifications,
    meta: { requiresAuth: true, role: 'family' }
  },
  {
    path: '/family/messages',
    name: 'family-messages',
    component: FamilyMessages,
    meta: { requiresAuth: true, role: 'family' }
  },
  {
    path: '/family/vitals',
    name: 'family-vitals',
    component: FamilyVitals,
    meta: { requiresAuth: true, role: 'family' }
  },
  {
    path: '/family/history',
    name: 'family-history',
    component: FamilyHistory,
    meta: { requiresAuth: true, role: 'family' }
  },

  // 404 Catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Apply global guards
router.beforeEach(authGuard)
router.beforeEach(roleGuard)
router.beforeEach(onboardingGuard)

export default router
