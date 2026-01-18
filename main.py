import serial
from typing import Dict, List, Optional, Tuple

PORT = "/dev/ttyUSB0"  # Windows: "COM3"
BAUDRATE = 115200

ALLOWED_TYPES = {"EMG", "ECG", "PPH"}  # si es PPG, cambia "PPH" por "PPG"


def parse_frame(line: str) -> Optional[Tuple[str, str, List[int]]]:
    """
    Espera: ID,Tipo,<nums...>
    Devuelve: (device_id, tipo, values[])
    """
    line = line.strip()
    if not line:
        return None

    parts = [p.strip() for p in line.split(",")]

    # Ignorar posibles cabeceras
    if len(parts) >= 2 and parts[0].lower() in {"id_dispositivo", "id", "device_id"}:
        return None

    if len(parts) < 3:
        return None  # mínimo: ID,Tipo,valor

    device_id = parts[0]
    tipo = parts[1].upper()

    if tipo not in ALLOWED_TYPES:
        return None

    # Convertir valores numéricos
    try:
        values = [int(x) for x in parts[2:] if x != ""]
    except ValueError:
        return None

    # Validación por tipo
    if tipo == "EMG":
        if not (1 <= len(values) <= 9):
            return None
    elif tipo in {"ECG", "PPH"}:
        if len(values) != 1:
            return None

    return device_id, tipo, values


def values_to_channels(tipo: str, values: List[int]) -> Dict[str, int]:
    """
    Mapea values a CH0..CH8 para EMG; para ECG/PPH usa CH0.
    """
    if tipo == "EMG":
        return {f"CH{i}": values[i] for i in range(len(values))}
    # ECG / PPH
    return {"CH0": values[0]}


def main() -> None:
    ser = serial.Serial(PORT, BAUDRATE, timeout=1)
    print(f"Leyendo serial en {PORT} @ {BAUDRATE}... (Ctrl+C para salir)")

    try:
        while True:
            raw = ser.readline()
            if not raw:
                continue

            # Decodificación robusta ante bytes raros
            line = raw.decode("utf-8", errors="ignore")
            parsed = parse_frame(line)
            if not parsed:
                continue

            device_id, tipo, values = parsed
            channels = values_to_channels(tipo, values)

            # Ejemplo de salida estructurada
            if tipo == "EMG":
                # Imprime solo CH0 y CH1 si existen, y cantidad total
                ch0 = channels.get("CH0", 0)
                ch1 = channels.get("CH1", 0)
                print(f"ID={device_id} Tipo={tipo} n={len(values)} CH0={ch0} CH1={ch1}")
            else:
                print(f"ID={device_id} Tipo={tipo} CH0={channels['CH0']}")

    except KeyboardInterrupt:
        print("Cerrando...")
    finally:
        ser.close()


if __name__ == "__main__":
    main()
