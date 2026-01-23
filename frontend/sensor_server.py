import asyncio
import websockets
import json
import time
import math
import random
from sensor_connection import open_serial, parse_frame

# WebSocket server configuration
WS_PORT = 8765
SERIAL_PORT = "COM3"
SERIAL_BAUD = 115200
USE_DEMO_MODE = True  # Set to False to use real sensor

connected_clients = set()


async def broadcast_to_clients(message):
    """Send message to all connected WebSocket clients"""
    if connected_clients:
        await asyncio.gather(
            *[client.send(message) for client in connected_clients],
            return_exceptions=True
        )


async def sensor_reader():
    """Read from serial and broadcast to WebSocket clients"""
    try:
        ser = open_serial(SERIAL_PORT, SERIAL_BAUD)
        ser.reset_input_buffer()
        print(f"Connected to sensor on {SERIAL_PORT}")

        while True:
            line_bytes = ser.readline()
            if not line_bytes:
                await asyncio.sleep(0.01)
                continue

            line = line_bytes.decode("utf-8", errors="replace")
            frame = parse_frame(line)

            if frame is None:
                continue

            # Broadcast to all connected clients
            message = json.dumps({
                "device_id": frame.device_id,
                "type": frame.signal_type,
                "signals": frame.signals,
                "timestamp": time.time()
            })

            await broadcast_to_clients(message)

    except Exception as e:
        print(f"Error reading from sensor: {e}")
        print("Falling back to demo mode...")
        await demo_mode()
    finally:
        try:
            ser.close()
        except:
            pass


async def demo_mode():
    """Generate simulated EMG data for testing"""
    device_id = 203333
    print("Running in DEMO mode - generating simulated EMG data")

    t = 0
    while True:
        # Simulate heart-like signal with some variation
        # Channel 1: Main ECG-like signal with heartbeat pattern
        heartbeat = 100 + int(40 * math.sin(t * 6) * math.exp(-((t % 1.0) * 5)))

        # Channel 2: Respiratory-like slower wave
        respiratory = 110 + int(20 * math.sin(t * 1.5))

        # Channel 3: Higher frequency muscle activity
        muscle = 90 + int(15 * math.sin(t * 10)) + random.randint(-5, 5)

        signals = [
            max(50, min(200, heartbeat)),
            max(50, min(200, respiratory)),
            max(50, min(200, muscle))
        ]

        message = json.dumps({
            "device_id": device_id,
            "type": "EMG",
            "signals": signals,
            "timestamp": time.time()
        })

        await broadcast_to_clients(message)

        t += 0.02  # 50 Hz simulation
        await asyncio.sleep(0.02)


async def handler(websocket):
    """Handle WebSocket connection"""
    print(f"Client connected: {websocket.remote_address}")
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")


async def main():
    # Start WebSocket server
    async with websockets.serve(handler, "localhost", WS_PORT):
        print(f"WebSocket server started on ws://localhost:{WS_PORT}")

        # Start sensor reading or demo mode
        if USE_DEMO_MODE:
            await demo_mode()
        else:
            await sensor_reader()


if __name__ == "__main__":
    print("=" * 50)
    print("EMG Sensor WebSocket Server")
    print("=" * 50)
    asyncio.run(main())
