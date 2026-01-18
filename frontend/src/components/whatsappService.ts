// src/api/whatsappService.ts

// Definimos la estructura que espera tu backend (basado en tu código de Python)
export interface WhatsAppPayload {
  patient_id: number | string;
  message: string;
  urgency_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; // Mapeamos severity a urgency_level
  phone_numbers: string[];
}

export interface WhatsAppResponse {
  status: string;
  patient_id: number | string;
  recipients_count: number;
  urgency_level: string;
  failed_numbers: string[];
  timestamp: string;
}

const API_URL = 'https://backendinnovatech-production.up.railway.app/api/send-whatsapp';

export const sendEmergencyAlert = async (payload: WhatsAppPayload): Promise<WhatsAppResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error enviando alerta de WhatsApp:', error);
    throw error;
  }
};