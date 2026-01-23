import type { User, Patient, Measurement, Notification, TrendData } from '../types/user'

// Mock Users (Patient, Clinical, Family)
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'paciente@cardioband.com',
    username: 'Sarah Johnson',
    role: 'patient',
    avatar: 'https://i.pravatar.cc/150?img=1',
    profile_data: {
      age: 45,
      conditions: ['Hipertensión'],
      emergency_contact: 'John Johnson - 555-1234',
      height: 165,
      weight: 68,
      medications: ['Losartán 50mg']
    }
  },
  {
    id: 2,
    email: 'doctor@cardioband.com',
    username: 'Dr. María García',
    role: 'clinical',
    avatar: 'https://i.pravatar.cc/150?img=5',
    profile_data: {
      specialty: 'Cardiología',
      license: 'MED-12345',
      patients_count: 24,
      hospital: 'Hospital General'
    }
  },
  {
    id: 3,
    email: 'familiar@cardioband.com',
    username: 'John Johnson',
    role: 'family',
    avatar: 'https://i.pravatar.cc/150?img=12',
    profile_data: {
      relation: 'Esposo',
      patient_id: 1,
      patient_name: 'Sarah Johnson',
      emergency_contact: true,
      phone: '+593939696606'
    }
  }
]

// Mock Patients for Clinical View
export const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 45,
    risk_level: 'low',
    last_measurement: '2026-01-17T14:30:00',
    alerts_count: 0,
    streak_days: 15,
    conditions: ['Hipertensión'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    emergency_phones: ['+593939696606']
  },
  {
    id: 4,
    name: 'Carlos Méndez',
    age: 62,
    risk_level: 'high',
    last_measurement: '2026-01-16T09:15:00',
    alerts_count: 2,
    streak_days: 3,
    conditions: ['Diabetes', 'Hipertensión'],
    avatar: 'https://i.pravatar.cc/150?img=33',
    emergency_phones: ['+593939696606']
  },
  {
    id: 5,
    name: 'Ana Torres',
    age: 38,
    risk_level: 'low',
    last_measurement: '2026-01-17T10:00:00',
    alerts_count: 0,
    streak_days: 22,
    conditions: ['Prevención'],
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 6,
    name: 'Roberto Silva',
    age: 55,
    risk_level: 'medium',
    last_measurement: '2026-01-17T08:45:00',
    alerts_count: 1,
    streak_days: 8,
    conditions: ['Hipertensión', 'Obesidad'],
    avatar: 'https://i.pravatar.cc/150?img=14'
  },
  {
    id: 7,
    name: 'Patricia López',
    age: 50,
    risk_level: 'low',
    last_measurement: '2026-01-17T13:20:00',
    alerts_count: 0,
    streak_days: 12,
    conditions: ['Prevención'],
    avatar: 'https://i.pravatar.cc/150?img=23'
  },
  {
    id: 8,
    name: 'Miguel Rojas',
    age: 68,
    risk_level: 'high',
    last_measurement: '2026-01-15T16:00:00',
    alerts_count: 3,
    streak_days: 1,
    conditions: ['Hipertensión', 'Arritmia'],
    avatar: 'https://i.pravatar.cc/150?img=68',
    emergency_phones: ['+593939696606']
  },
  {
    id: 9,
    name: 'Laura Jiménez',
    age: 42,
    risk_level: 'medium',
    last_measurement: '2026-01-17T11:30:00',
    alerts_count: 1,
    streak_days: 6,
    conditions: ['Hipertensión'],
    avatar: 'https://i.pravatar.cc/150?img=45'
  },
  {
    id: 10,
    name: 'Jorge Castro',
    age: 58,
    risk_level: 'low',
    last_measurement: '2026-01-17T09:00:00',
    alerts_count: 0,
    streak_days: 18,
    conditions: ['Prevención'],
    avatar: 'https://i.pravatar.cc/150?img=52'
  },
  {
    id: 11,
    name: 'Diana Vargas',
    age: 47,
    risk_level: 'medium',
    last_measurement: '2026-01-16T15:45:00',
    alerts_count: 1,
    streak_days: 4,
    conditions: ['Diabetes'],
    avatar: 'https://i.pravatar.cc/150?img=29'
  },
  {
    id: 12,
    name: 'Fernando Cruz',
    age: 60,
    risk_level: 'high',
    last_measurement: '2026-01-17T07:30:00',
    alerts_count: 2,
    streak_days: 2,
    conditions: ['Hipertensión', 'Colesterol alto'],
    avatar: 'https://i.pravatar.cc/150?img=70',
    emergency_phones: ['+593939696606']
  },
  {
    id: 13,
    name: 'Gabriela Ríos',
    age: 52,
    risk_level: 'low',
    last_measurement: '2026-01-17T12:00:00',
    alerts_count: 0,
    streak_days: 14,
    conditions: ['Prevención'],
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: 14,
    name: 'Andrés Morales',
    age: 65,
    risk_level: 'medium',
    last_measurement: '2026-01-17T10:15:00',
    alerts_count: 1,
    streak_days: 7,
    conditions: ['Hipertensión'],
    avatar: 'https://i.pravatar.cc/150?img=60'
  },
  {
    id: 15,
    name: 'Carmen Soto',
    age: 44,
    risk_level: 'low',
    last_measurement: '2026-01-17T14:00:00',
    alerts_count: 0,
    streak_days: 20,
    conditions: ['Prevención'],
    avatar: 'https://i.pravatar.cc/150?img=38'
  }
]

// Mock Measurements for Patient 1 (last 30 days)
export const mockMeasurements: Measurement[] = [
  {
    id: 1,
    patient_id: 1,
    type: 'blood_pressure',
    value: { systolic: 120, diastolic: 80 },
    timestamp: '2026-01-17T14:30:00',
    device: 'Cardio-Band X1',
    notes: 'Medición post-ejercicio',
    heart_rate: 72,
    blood_pressure: { systolic: 120, diastolic: 80 }
  },
  {
    id: 2,
    patient_id: 1,
    type: 'heart_rate',
    value: 72,
    timestamp: '2026-01-17T14:30:00',
    device: 'Cardio-Band X1',
    heart_rate: 72
  },
  {
    id: 3,
    patient_id: 1,
    type: 'sleep',
    value: 7.5,
    timestamp: '2026-01-17T08:00:00',
    device: 'Cardio-Band X1',
    notes: 'Buen descanso',
    sleep: 7.5
  },
  {
    id: 4,
    patient_id: 1,
    type: 'blood_pressure',
    value: { systolic: 118, diastolic: 78 },
    timestamp: '2026-01-16T09:15:00',
    device: 'Cardio-Band X1',
    heart_rate: 68,
    blood_pressure: { systolic: 118, diastolic: 78 }
  },
  {
    id: 5,
    patient_id: 1,
    type: 'heart_rate',
    value: 68,
    timestamp: '2026-01-16T09:15:00',
    device: 'Cardio-Band X1',
    heart_rate: 68
  },
  {
    id: 6,
    patient_id: 1,
    type: 'sleep',
    value: 8.0,
    timestamp: '2026-01-16T08:00:00',
    device: 'Cardio-Band X1',
    sleep: 8.0
  },
  // Additional measurements for Patient 1 - Sarah Johnson
  { id: 7, patient_id: 1, type: 'blood_pressure', value: { systolic: 122, diastolic: 82 }, timestamp: '2026-01-23T10:00:00', device: 'Cardio-Band X1', heart_rate: 70, blood_pressure: { systolic: 122, diastolic: 82 } },
  { id: 8, patient_id: 1, type: 'blood_pressure', value: { systolic: 119, diastolic: 79 }, timestamp: '2026-01-22T15:30:00', device: 'Cardio-Band X1', heart_rate: 69, blood_pressure: { systolic: 119, diastolic: 79 } },
  { id: 9, patient_id: 1, type: 'sleep', value: 7.8, timestamp: '2026-01-23T08:00:00', device: 'Cardio-Band X1', sleep: 7.8 },
  { id: 123, patient_id: 1, type: 'blood_pressure', value: { systolic: 121, diastolic: 81 }, timestamp: '2026-01-21T11:45:00', device: 'Cardio-Band X1', heart_rate: 71, blood_pressure: { systolic: 121, diastolic: 81 } },
  { id: 124, patient_id: 1, type: 'blood_pressure', value: { systolic: 117, diastolic: 77 }, timestamp: '2026-01-20T09:20:00', device: 'Cardio-Band X1', heart_rate: 67, blood_pressure: { systolic: 117, diastolic: 77 } },
  { id: 125, patient_id: 1, type: 'sleep', value: 8.2, timestamp: '2026-01-22T08:00:00', device: 'Cardio-Band X1', sleep: 8.2 },
  { id: 126, patient_id: 1, type: 'blood_pressure', value: { systolic: 123, diastolic: 83 }, timestamp: '2026-01-19T14:10:00', device: 'Cardio-Band X1', heart_rate: 72, blood_pressure: { systolic: 123, diastolic: 83 } },
  { id: 127, patient_id: 1, type: 'sleep', value: 7.6, timestamp: '2026-01-21T08:00:00', device: 'Cardio-Band X1', sleep: 7.6 },
  // Patient 4 - Carlos Méndez (High Risk)
  { id: 10, patient_id: 4, type: 'blood_pressure', value: { systolic: 165, diastolic: 95 }, timestamp: '2026-01-23T09:15:00', device: 'Cardio-Band X1', heart_rate: 88, blood_pressure: { systolic: 165, diastolic: 95 } },
  { id: 11, patient_id: 4, type: 'blood_pressure', value: { systolic: 155, diastolic: 92 }, timestamp: '2026-01-22T14:30:00', device: 'Cardio-Band X1', heart_rate: 85, blood_pressure: { systolic: 155, diastolic: 92 } },
  { id: 12, patient_id: 4, type: 'blood_pressure', value: { systolic: 160, diastolic: 94 }, timestamp: '2026-01-21T10:00:00', device: 'Cardio-Band X1', heart_rate: 90, blood_pressure: { systolic: 160, diastolic: 94 } },
  { id: 13, patient_id: 4, type: 'sleep', value: 6.5, timestamp: '2026-01-23T08:00:00', device: 'Cardio-Band X1', sleep: 6.5 },
  { id: 14, patient_id: 4, type: 'blood_pressure', value: { systolic: 158, diastolic: 93 }, timestamp: '2026-01-20T15:45:00', device: 'Cardio-Band X1', heart_rate: 87, blood_pressure: { systolic: 158, diastolic: 93 } },
  { id: 15, patient_id: 4, type: 'blood_pressure', value: { systolic: 162, diastolic: 96 }, timestamp: '2026-01-19T11:20:00', device: 'Cardio-Band X1', heart_rate: 92, blood_pressure: { systolic: 162, diastolic: 96 } },
  { id: 16, patient_id: 4, type: 'blood_pressure', value: { systolic: 157, diastolic: 91 }, timestamp: '2026-01-18T09:00:00', device: 'Cardio-Band X1', heart_rate: 84, blood_pressure: { systolic: 157, diastolic: 91 } },
  { id: 17, patient_id: 4, type: 'blood_pressure', value: { systolic: 163, diastolic: 95 }, timestamp: '2026-01-17T14:15:00', device: 'Cardio-Band X1', heart_rate: 89, blood_pressure: { systolic: 163, diastolic: 95 } },
  { id: 18, patient_id: 4, type: 'sleep', value: 6.2, timestamp: '2026-01-22T08:00:00', device: 'Cardio-Band X1', sleep: 6.2 },
  { id: 19, patient_id: 4, type: 'sleep', value: 6.8, timestamp: '2026-01-21T08:00:00', device: 'Cardio-Band X1', sleep: 6.8 },
  // Patient 5 - Ana Torres (Low Risk)
  { id: 20, patient_id: 5, type: 'blood_pressure', value: { systolic: 115, diastolic: 75 }, timestamp: '2026-01-17T10:00:00', device: 'Cardio-Band X1', heart_rate: 68 },
  { id: 21, patient_id: 5, type: 'blood_pressure', value: { systolic: 118, diastolic: 76 }, timestamp: '2026-01-16T09:30:00', device: 'Cardio-Band X1', heart_rate: 70 },
  { id: 22, patient_id: 5, type: 'sleep', value: 7.8, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 6 - Roberto Silva (Medium Risk)
  { id: 30, patient_id: 6, type: 'blood_pressure', value: { systolic: 138, diastolic: 88 }, timestamp: '2026-01-17T08:45:00', device: 'Cardio-Band X1', heart_rate: 78 },
  { id: 31, patient_id: 6, type: 'blood_pressure', value: { systolic: 135, diastolic: 85 }, timestamp: '2026-01-16T11:00:00', device: 'Cardio-Band X1', heart_rate: 76 },
  { id: 32, patient_id: 6, type: 'sleep', value: 6.8, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 7 - Patricia López (Low Risk)
  { id: 40, patient_id: 7, type: 'blood_pressure', value: { systolic: 120, diastolic: 78 }, timestamp: '2026-01-17T13:20:00', device: 'Cardio-Band X1', heart_rate: 72 },
  { id: 41, patient_id: 7, type: 'blood_pressure', value: { systolic: 118, diastolic: 76 }, timestamp: '2026-01-16T10:15:00', device: 'Cardio-Band X1', heart_rate: 70 },
  { id: 42, patient_id: 7, type: 'sleep', value: 8.2, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 8 - Miguel Rojas (High Risk)
  { id: 50, patient_id: 8, type: 'blood_pressure', value: { systolic: 170, diastolic: 98 }, timestamp: '2026-01-15T16:00:00', device: 'Cardio-Band X1', heart_rate: 95 },
  { id: 51, patient_id: 8, type: 'blood_pressure', value: { systolic: 168, diastolic: 96 }, timestamp: '2026-01-14T14:30:00', device: 'Cardio-Band X1', heart_rate: 92 },
  { id: 52, patient_id: 8, type: 'sleep', value: 5.5, timestamp: '2026-01-15T08:00:00', device: 'Cardio-Band X1' },
  // Patient 9 - Laura Jiménez (Medium Risk)
  { id: 60, patient_id: 9, type: 'blood_pressure', value: { systolic: 132, diastolic: 84 }, timestamp: '2026-01-17T11:30:00', device: 'Cardio-Band X1', heart_rate: 74 },
  { id: 61, patient_id: 9, type: 'blood_pressure', value: { systolic: 130, diastolic: 82 }, timestamp: '2026-01-16T09:00:00', device: 'Cardio-Band X1', heart_rate: 73 },
  { id: 62, patient_id: 9, type: 'sleep', value: 7.0, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 10 - Jorge Castro (Low Risk)
  { id: 70, patient_id: 10, type: 'blood_pressure', value: { systolic: 118, diastolic: 74 }, timestamp: '2026-01-17T09:00:00', device: 'Cardio-Band X1', heart_rate: 66 },
  { id: 71, patient_id: 10, type: 'blood_pressure', value: { systolic: 116, diastolic: 73 }, timestamp: '2026-01-16T10:30:00', device: 'Cardio-Band X1', heart_rate: 65 },
  { id: 72, patient_id: 10, type: 'sleep', value: 8.0, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 11 - Diana Vargas (Medium Risk)
  { id: 80, patient_id: 11, type: 'blood_pressure', value: { systolic: 135, diastolic: 86 }, timestamp: '2026-01-16T15:45:00', device: 'Cardio-Band X1', heart_rate: 80 },
  { id: 81, patient_id: 11, type: 'blood_pressure', value: { systolic: 133, diastolic: 84 }, timestamp: '2026-01-15T12:00:00', device: 'Cardio-Band X1', heart_rate: 78 },
  { id: 82, patient_id: 11, type: 'sleep', value: 6.5, timestamp: '2026-01-16T08:00:00', device: 'Cardio-Band X1' },
  // Patient 12 - Fernando Cruz (High Risk)
  { id: 90, patient_id: 12, type: 'blood_pressure', value: { systolic: 158, diastolic: 92 }, timestamp: '2026-01-17T07:30:00', device: 'Cardio-Band X1', heart_rate: 86 },
  { id: 91, patient_id: 12, type: 'blood_pressure', value: { systolic: 162, diastolic: 94 }, timestamp: '2026-01-16T08:00:00', device: 'Cardio-Band X1', heart_rate: 88 },
  { id: 92, patient_id: 12, type: 'sleep', value: 6.0, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 13 - Gabriela Ríos (Low Risk)
  { id: 100, patient_id: 13, type: 'blood_pressure', value: { systolic: 112, diastolic: 72 }, timestamp: '2026-01-17T12:00:00', device: 'Cardio-Band X1', heart_rate: 64 },
  { id: 101, patient_id: 13, type: 'blood_pressure', value: { systolic: 115, diastolic: 74 }, timestamp: '2026-01-16T11:30:00', device: 'Cardio-Band X1', heart_rate: 66 },
  { id: 102, patient_id: 13, type: 'sleep', value: 8.5, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 14 - Andrés Morales (Medium Risk)
  { id: 110, patient_id: 14, type: 'blood_pressure', value: { systolic: 140, diastolic: 88 }, timestamp: '2026-01-17T10:15:00', device: 'Cardio-Band X1', heart_rate: 76 },
  { id: 111, patient_id: 14, type: 'blood_pressure', value: { systolic: 138, diastolic: 86 }, timestamp: '2026-01-16T09:45:00', device: 'Cardio-Band X1', heart_rate: 75 },
  { id: 112, patient_id: 14, type: 'sleep', value: 7.2, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' },
  // Patient 15 - Carmen Soto (Low Risk)
  { id: 120, patient_id: 15, type: 'blood_pressure', value: { systolic: 118, diastolic: 76 }, timestamp: '2026-01-17T14:00:00', device: 'Cardio-Band X1', heart_rate: 68 },
  { id: 121, patient_id: 15, type: 'blood_pressure', value: { systolic: 116, diastolic: 74 }, timestamp: '2026-01-16T13:00:00', device: 'Cardio-Band X1', heart_rate: 67 },
  { id: 122, patient_id: 15, type: 'sleep', value: 7.8, timestamp: '2026-01-17T08:00:00', device: 'Cardio-Band X1' }
]

// Mock Trend Data (30 days)
function generateTrendData(): { blood_pressure: TrendData[], heart_rate: TrendData[], sleep: TrendData[] } {
  const blood_pressure: TrendData[] = []
  const heart_rate: TrendData[] = []
  const sleep: TrendData[] = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Blood Pressure with some variation
    const systolic = 118 + Math.floor(Math.random() * 12) - 6
    const diastolic = 78 + Math.floor(Math.random() * 8) - 4
    blood_pressure.push({
      date: dateStr,
      value: { systolic, diastolic }
    })

    // Heart Rate with variation
    const hr = 70 + Math.floor(Math.random() * 12) - 6
    heart_rate.push({
      date: dateStr,
      value: hr
    })

    // Sleep hours with variation
    const sleepHours = 7 + Math.random() * 2 - 0.5
    sleep.push({
      date: dateStr,
      value: parseFloat(sleepHours.toFixed(1))
    })
  }

  return { blood_pressure, heart_rate, sleep }
}

export const mockTrends = generateTrendData()

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'alert',
    severity: 'high',
    patient_id: 4,
    patient_name: 'Carlos Méndez',
    message: 'Presión arterial elevada: 165/95 mmHg',
    timestamp: '2026-01-16T08:00:00',
    read: false
  },
  {
    id: 2,
    type: 'alert',
    severity: 'high',
    patient_id: 8,
    patient_name: 'Miguel Rojas',
    message: 'Frecuencia cardíaca irregular detectada',
    timestamp: '2026-01-15T16:00:00',
    read: false
  },
  {
    id: 3,
    type: 'alert',
    severity: 'medium',
    patient_id: 4,
    patient_name: 'Carlos Méndez',
    message: 'Medicación no registrada hoy',
    timestamp: '2026-01-17T10:00:00',
    read: false
  },
  {
    id: 4,
    type: 'achievement',
    patient_id: 1,
    message: '¡Racha de 15 días completada!',
    timestamp: '2026-01-17T08:00:00',
    read: true
  },
  {
    id: 5,
    type: 'message',
    patient_id: 1,
    patient_name: 'Dr. García',
    message: 'Excelente progreso esta semana. Continúa así.',
    timestamp: '2026-01-16T14:30:00',
    read: true
  },
  {
    id: 6,
    type: 'alert',
    severity: 'medium',
    patient_id: 10,
    patient_name: 'Fernando Cruz',
    message: 'Presión arterial ligeramente elevada: 145/90 mmHg',
    timestamp: '2026-01-17T07:30:00',
    read: false
  },
  {
    id: 7,
    type: 'reminder',
    patient_id: 1,
    message: 'Recuerda tomar tu medición de la tarde',
    timestamp: '2026-01-17T15:00:00',
    read: false
  }
]

// Helper functions
export function getUserById(id: number): User | undefined {
  return mockUsers.find(u => u.id === id)
}

export function getPatientById(id: number): Patient | undefined {
  return mockPatients.find(p => p.id === id)
}

// Doctor type for Find Doctor feature
export interface Doctor {
  id: number
  name: string
  avatar: string
  specialty: string
  rating: number
  experience: number
  clinic: string
  available_times: string[]
  phone: string
  email: string
  languages: string[]
}

// Mock Doctors for Patient Find Doctor
export const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dra. María García',
    avatar: 'https://i.pravatar.cc/150?img=5',
    specialty: 'Cardiología',
    rating: 4.9,
    experience: 15,
    clinic: 'Hospital General',
    available_times: ['Hoy 3:00 PM', 'Mañana 10:00 AM', 'Mañana 4:00 PM'],
    phone: '+593-99-123-4567',
    email: 'maria.garcia@hospital.com',
    languages: ['Español', 'Inglés']
  },
  {
    id: 2,
    name: 'Dr. Carlos Mendoza',
    avatar: 'https://i.pravatar.cc/150?img=13',
    specialty: 'Cardiología',
    rating: 4.8,
    experience: 12,
    clinic: 'Clínica del Corazón',
    available_times: ['Mañana 11:00 AM', 'Lunes 2:00 PM'],
    phone: '+593-99-234-5678',
    email: 'carlos.mendoza@clinica.com',
    languages: ['Español']
  },
  {
    id: 3,
    name: 'Dra. Ana Rodríguez',
    avatar: 'https://i.pravatar.cc/150?img=9',
    specialty: 'Medicina General',
    rating: 4.7,
    experience: 8,
    clinic: 'Centro Médico San José',
    available_times: ['Hoy 5:00 PM', 'Mañana 9:00 AM', 'Lunes 11:00 AM'],
    phone: '+593-99-345-6789',
    email: 'ana.rodriguez@sanjos e.com',
    languages: ['Español', 'Inglés', 'Portugués']
  },
  {
    id: 4,
    name: 'Dr. Luis Fernández',
    avatar: 'https://i.pravatar.cc/150?img=14',
    specialty: 'Cardiología',
    rating: 4.9,
    experience: 20,
    clinic: 'Hospital General',
    available_times: ['Lunes 10:00 AM', 'Martes 3:00 PM'],
    phone: '+593-99-456-7890',
    email: 'luis.fernandez@hospital.com',
    languages: ['Español', 'Inglés']
  },
  {
    id: 5,
    name: 'Dra. Patricia Vega',
    avatar: 'https://i.pravatar.cc/150?img=10',
    specialty: 'Medicina General',
    rating: 4.6,
    experience: 10,
    clinic: 'Clínica La Familia',
    available_times: ['Hoy 2:00 PM', 'Mañana 1:00 PM', 'Martes 10:00 AM'],
    phone: '+593-99-567-8901',
    email: 'patricia.vega@lafamilia.com',
    languages: ['Español']
  },
  {
    id: 6,
    name: 'Dr. Roberto Sánchez',
    avatar: 'https://i.pravatar.cc/150?img=15',
    specialty: 'Cardiología',
    rating: 4.8,
    experience: 18,
    clinic: 'Centro Cardiológico',
    available_times: ['Mañana 8:00 AM', 'Lunes 4:00 PM'],
    phone: '+593-99-678-9012',
    email: 'roberto.sanchez@cardio.com',
    languages: ['Español', 'Inglés']
  }
]

export function getMeasurementsByPatient(patientId: number): Measurement[] {
  return mockMeasurements.filter(m => m.patient_id === patientId)
}

export function getNotificationsByPatient(patientId: number): Notification[] {
  return mockNotifications.filter(n => n.patient_id === patientId)
}

export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(n => !n.read)
}
