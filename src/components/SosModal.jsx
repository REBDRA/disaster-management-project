import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  X, 
  PhoneCall, 
  MapPin, 
  Battery, 
  Send,
  CloudOff,
  Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { queueOfflineSOS, isOnline } from '../utils/offlineManager';
import { playSound } from '../utils/audioEffects';
import { broadcastSOSToApi } from '../utils/apiClient';

export default function SosModal({ isOpen, onClose, soundEnabled, onSosBroadcast }) {
  const [triageCategory, setTriageCategory] = useState('TRAPPED_FLOOD');
  const [phone, setPhone] = useState('+91-98765-43210');
  const [notes, setNotes] = useState('');
  const [dispatchedSos, setDispatchedSos] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [liveGps, setLiveGps] = useState([26.183, 91.745]);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveGps([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {}
      );
    }
  }, []);

  if (!isOpen) return null;

  const handleSendSOS = (e) => {
    e.preventDefault();
    setIsSending(true);

    if (soundEnabled) playSound('sos');

    setTimeout(() => {
      const sosPayload = {
        sosId: `SOS-IN-${Date.now().toString().slice(-6)}`,
        category: triageCategory,
        phone: phone || 'Emergency Citizen Contact',
        notes: notes || 'Immediate evacuation required at GPS coordinates',
        coords: liveGps,
        elevation: 49.2,
        battery: 88,
        dispatchedAt: new Date().toLocaleTimeString(),
        status: 'DISPATCHED_TO_NDRF'
      };

      // Store locally if offline
      queueOfflineSOS(sosPayload);

      // Attempt API broadcast
      broadcastSOSToApi(sosPayload);

      setDispatchedSos(sosPayload);
      setIsSending(false);

      if (soundEnabled) playSound('success');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSosBroadcast) {
        onSosBroadcast(sosPayload);
      }
    }, 700);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(5, 8, 15, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-panel" style={{
        width: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--accent-red)',
        boxShadow: 'var(--shadow-glow-red)',
        padding: 24
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #e11d48, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Citizen Emergency SOS Beacon
              </h2>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                NDRF 112 & SDRF Emergency Triage Network
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px 8px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {dispatchedSos ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              border: '1px solid var(--accent-emerald)',
              padding: 16,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <CheckCircle2 size={24} color="var(--accent-emerald)" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  SOS BEACON TRANSMITTED
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                  Incident Ticket: <b>{dispatchedSos.sosId}</b>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 10, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GPS Coordinates:</span>
                <span style={{ fontWeight: 700 }}>{dispatchedSos.coords[0].toFixed(5)}, {dispatchedSos.coords[1].toFixed(5)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Triage Urgency:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{dispatchedSos.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Offline Storage:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>QUEUED & SAVED TO INDEXEDDB</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDispatchedSos(null)}
                className="btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Send Another Alert
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendSOS} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                TRIAGE CLASSIFICATION
              </label>
              <select
                value={triageCategory}
                onChange={(e) => setTriageCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <option value="TRAPPED_FLOOD">Trapped in Rising Water / Submerged Building</option>
                <option value="MEDICAL_EMERGENCY">Critical Medical Emergency / Oxygen Needed</option>
                <option value="INFANT_ELDERLY">Infants / Elderly Evacuation Assistance</option>
                <option value="FOOD_WATER_DEPLETED">Potable Water & Food Rations Exhausted</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                CITIZEN CONTACT NUMBER / AADHAAR ID
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-XXXXXXXXXX or Citizen ID"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                ADDITIONAL FIELD NOTES (LANDMARKS / NUMBER OF CITIZENS)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. 4 family members on 2nd floor terrace, flood level reaching staircase"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={14} color="var(--accent-cyan)" />
              <span>GPS Pinpoint: <b>{liveGps[0].toFixed(4)}, {liveGps[1].toFixed(4)}</b> (Auto-attached)</span>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="btn-sos"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px 18px',
                fontSize: 14,
                marginTop: 4
              }}
            >
              {isSending ? 'Transmitting Emergency Beacon...' : 'BROADCAST EMERGENCY SOS'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
