// User types for Cardio-Band multi-profile system

export type UserRole = 'patient' | 'clinical' | 'family'

export interface PatientProfile {
  age: number
  conditions: string[]
  emergency_contact?: string
  height?: number
  weight?: number
  medications?: string[]
}

export interface ClinicalProfile {
  specialty: string
  license: string
  patients_count: number
  hospital?: string
}

export interface FamilyProfile {
  relation: string
  patient_id: number
  patient_name?: string
  emergency_contact: boolean
  phone?: string
}

export interface User {
  id: number
  email: string
  username: string
  role: UserRole
  avatar: string
  profile_data: PatientProfile | ClinicalProfile | FamilyProfile
}

export interface Measurement {
  id: number
  patient_id: number
  type: 'blood_pressure' | 'heart_rate' | 'sleep' | 'steps' | 'weight'
  value: any
  timestamp: string
  device?: string
  notes?: string
}

export interface Patient {
  id: number
  name: string
  age: number
  risk_level: 'low' | 'medium' | 'high'
  last_measurement: string
  alerts_count: number
  streak_days: number
  conditions: string[]
  avatar: string
  emergency_phones?: string[]
}

export interface Notification {
  id: number
  type: 'alert' | 'message' | 'reminder' | 'achievement'
  severity?: 'low' | 'medium' | 'high'
  patient_id?: number
  patient_name?: string
  message: string
  timestamp: string
  read: boolean
}

export interface TrendData {
  date: string
  value: number | { systolic: number, diastolic: number }
}
