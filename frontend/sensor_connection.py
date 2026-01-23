import time
from dataclasses import dataclass
from typing import Optional, List, Dict, Any

import serial


@dataclass
class SerialFrame:
    device_id: int
    signal_type: str
    signals: List[int]
    raw: str


def parse_frame(line: str) -> Optional[SerialFrame]:
    """
    Parse a line like: ID,TIPO,SG1,SG2,SG3
    Example: 203333,EMG,100,100,100
    Returns None if the line is invalid.
    """
    raw = line.strip()
    if not raw:
        return None

    parts = [p.strip() for p in raw.split(",")]
    if len(parts) < 3:
        return None

    device_str, signal_type = parts[0], parts[1]
    if not device_str.isdigit():
        return None

    # Parse signals (remaining fields)
    signals: List[int] = []
    for s in parts[2:]:
        if s == "":
            return None
        try:
            # If you expect floats, change to float(s) and adjust type hints
            signals.append(int(float(s)))
        except ValueError:
            return None

    return SerialFrame(
        device_id=int(device_str),
        signal_type=signal_type.upper(),
        signals=signals,
        raw=raw,
    )


def open_serial(port: str, baudrate: int = 115200, timeout_s: float = 1.0) -> serial.Serial:
    """
    Open a serial port for line-based ASCII frames.
    """
    return serial.Serial(
        port=port,
        baudrate=baudrate,
        timeout=timeout_s,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
    )


def frame_to_dict(frame: SerialFrame) -> Dict[str, Any]:
    """
    Convert frame to a dict, useful for JSON/API or logging.
    """
    return {
        "device_id": frame.device_id,
        "type": frame.signal_type,
        "signals": frame.signals,
        "raw": frame.raw,
        "ts": time.time(),
    }


def read_frames_forever(port: str, baudrate: int = 115200) -> None:
    """
    Continuously read frames from serial and print parsed output.
    Assumes the sender ends each frame with '\\n' (recommended).
    """
    ser = open_serial(port, baudrate=baudrate, timeout_s=1.0)
    try:
        # Optional: clear any startup garbage
        ser.reset_input_buffer()

        while True:
            # Read a full line (up to '\n') from serial
            line_bytes = ser.readline()
            if not line_bytes:
                continue

            # Decode bytes -> str safely
            line = line_bytes.decode("utf-8", errors="replace")

            frame = parse_frame(line)
            if frame is None:
                # Ignore corrupted/partial lines
                continue

            print(frame_to_dict(frame))

    except KeyboardInterrupt:
        pass
    finally:
        try:
            ser.close()
        except Exception:
            pass


if __name__ == "__main__":
    # Change these to your setup:
    # Windows example: "COM3"
    # Linux example: "/dev/ttyUSB0" or "/dev/ttyACM0"
    PORT = "COM3"
    BAUD = 115200

    read_frames_forever(PORT, BAUD)