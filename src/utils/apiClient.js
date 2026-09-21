// RESQ Custom API Client
// Connects frontend to our local FastAPI server (http://127.0.0.1:8000)

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAdaptiveRouteFromApi(startLat, startLon, shelterId, waterLevel) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/route/adaptive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start: { lat: startLat, lon: startLon },
        destination_shelter_id: shelterId,
        water_surcharge_meters: waterLevel
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function broadcastSOSToApi(sosPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sos/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triage_category: sosPayload.category,
        notes: sosPayload.notes,
        coords: { lat: sosPayload.coords[0], lon: sosPayload.coords[1] },
        sender_address: sosPayload.senderAddress,
        battery_percent: sosPayload.battery
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function lookupElevationFromApi(points) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/elevation/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
      signal: AbortSignal.timeout(2000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
