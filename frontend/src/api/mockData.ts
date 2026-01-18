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
    notes: 'Medición post-ejercicio'
  },
  {
    id: 2,
    patient_id: 1,
    type: 'heart_rate',
    value: 72,
    timestamp: '2026-01-17T14:30:00',
    device: 'Cardio-Band X1'
  },
  {
    id: 3,
    patient_id: 1,
    type: 'sleep',
    value: 7.5,
    timestamp: '2026-01-17T08:00:00',
    device: 'Cardio-Band X1',
    notes: 'Buen descanso'
  },
  {
    id: 4,
    patient_id: 1,
    type: 'blood_pressure',
    value: { systolic: 118, diastolic: 78 },
    timestamp: '2026-01-16T09:15:00',
    device: 'Cardio-Band X1'
  },
  {
    id: 5,
    patient_id: 1,
    type: 'heart_rate',
    value: 68,
    timestamp: '2026-01-16T09:15:00',
    device: 'Cardio-Band X1'
  },
  {
    id: 6,
    patient_id: 1,
    type: 'sleep',
    value: 8.0,
    timestamp: '2026-01-16T08:00:00',
    device: 'Cardio-Band X1'
  }
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

export function getMeasurementsByPatient(patientId: number): Measurement[] {
  return mockMeasurements.filter(m => m.patient_id === patientId)
}

export function getNotificationsByPatient(patientId: number): Notification[] {
  return mockNotifications.filter(n => n.patient_id === patientId)
}

export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(n => !n.read)
}
