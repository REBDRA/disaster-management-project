import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink,
  ShieldAlert,
  CloudOff,
  Radio,
  Layers,
  Zap,
  Users,
  DollarSign,
  Leaf
} from 'lucide-react';
import { playSound } from '../utils/audioEffects';
import { RESEARCH_PAPERS, DATA_SOURCES_INFO } from '../utils/researchData';

export default function SlideDeckModal({ isOpen, onClose, soundEnabled }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 1: Problem Statement & Theme
    {
      id: 1,
      tag: 'SLIDE 1',
      title: 'SMART EVACUATION ROUTE PLANNING USING REAL-TIME CONDITIONS',
      subtitle: 'Problem Statement Title • Disaster Management Hackathon Presentation',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(255, 42, 95, 0.12) 100%)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 14,
            padding: 24,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 20, background: 'rgba(0, 242, 254, 0.15)', border: '1px solid var(--border-cyan)', marginBottom: 12 }}>
              <ShieldAlert size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: 1 }}>RESQ CORE INITIATIVE</span>
            </div>
            
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: 0.5, marginBottom: 8 }}>
              RESQ — ADAPTIVE DUAL-MODE EVACUATION INTELLIGENCE
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
              A decentralized dual-engine disaster response platform that automatically switches during telecom blackouts to run on-device, elevation-aware adaptive routing on pre-cached maps while using zero-hardware device-to-device (BLE / Wi-Fi Direct) mesh to propagate distress signals to first responders.
            </p>
          </div>

          <div className="resq-deck-slide1-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>THEME</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ff4d79', marginTop: 6 }}>DISASTER MANAGEMENT</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>PS CATEGORY</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 6 }}>SOFTWARE</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>TEAM NAME</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 6 }}>TEAM RESQ</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>TARGET BASINS</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-amber)', marginTop: 6 }}>Assam, Bihar, Bengal</div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: The Problem, Solution, Innovations & Architecture
    {
      id: 2,
      tag: 'SLIDE 2',
      title: 'RESQ — ADAPTIVE DUAL-MODE EVACUATION INTELLIGENCE',
      subtitle: 'The Problem, Our Solution, Innovations, and Proposed Architecture Flowchart',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Problem vs Solution */}
          <div className="resq-deck-slide2-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: 'rgba(255, 42, 95, 0.08)', border: '1px solid rgba(255, 42, 95, 0.35)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ff4d79', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                <CloudOff size={18} />
                <span>THE PROBLEM</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                When disasters destroy cellular towers and power grids, standard cloud-based navigation and emergency services shut down completely — leaving fleeing citizens blind to rising floodwaters/blocked roads and trapped victims unable to call for rescue.
              </p>
            </div>

            <div style={{ background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.35)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                <Radio size={18} />
                <span>OUR SOLUTION</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                A decentralized, dual-engine mobile platform that automatically switches during blackouts to run on-device, elevation-aware adaptive routing on pre-cached maps, while using device-to-device (Bluetooth/Wi-Fi Direct) mesh to share live road hazards and hop offline SOS distress signals to First Responders with zero internet or cell towers required.
              </p>
            </div>
          </div>

          {/* Innovations & Uniqueness */}
          <div className="resq-deck-innovations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { title: 'Zero-Hardware P2P Mesh', desc: 'Runs directly on consumer phone BLE/Wi-Fi with offline consensus' },
              { title: 'Dynamic Route Confidence', desc: 'Real-time hazard scoring and stochastic corridor reliability' },
              { title: 'Adaptive Safe Routing', desc: 'Digital elevation model (DEM) keeps citizens on dry high ground' },
              { title: 'Store-and-Forward SOS Relay', desc: 'Packets hop phone-to-phone until reaching responder gateway' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-cyan)' }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Proposed Solution Architecture Diagram */}
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5, marginBottom: 10, textAlign: 'center' }}>
              PROPOSED SOLUTION ARCHITECTURE (INPUTS ➔ PROCESSING ➔ OUTPUTS)
            </div>

            <div className="resq-deck-arch-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12, alignItems: 'center' }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>INPUTS</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>📍 GPS Fix</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>🗺️ Pre-cached Region Pack</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>⛰️ DEM Elevation Grid</div>
              </div>

              {/* Processing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 10px', borderLeft: '1px dashed var(--border-subtle)', borderRight: '1px dashed var(--border-subtle)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-cyan)', textAlign: 'center' }}>DUAL-ENGINE PROCESSING</div>
                <div style={{ background: 'rgba(0, 242, 254, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--border-cyan)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-cyan)' }}>ONLINE CLOUD ENGINE</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>FastAPI + PostGIS + GraphHopper Server-Side Routing</div>
                </div>
                <div style={{ background: 'rgba(255, 42, 95, 0.1)', padding: 8, borderRadius: 6, border: '1px solid rgba(255, 42, 95, 0.4)', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#ff4d79' }}>OFFLINE RESILIENCE ENGINE</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>Elevation A* Routing & P2P Bluetooth / Wi-Fi Direct Mesh</div>
                </div>
              </div>

              {/* Outputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-emerald)', textAlign: 'center' }}>OUTPUTS</div>
                <div style={{ background: 'rgba(0, 245, 155, 0.08)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid rgba(0, 245, 155, 0.3)', color: 'var(--accent-emerald)', fontWeight: 700 }}>High-Ground Safe Route</div>
                <div style={{ background: 'rgba(0, 245, 155, 0.08)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid rgba(0, 245, 155, 0.3)', color: 'var(--accent-emerald)', fontWeight: 700 }}>P2P Hazard Sharing</div>
                <div style={{ background: 'rgba(0, 245, 155, 0.08)', padding: '6px 10px', borderRadius: 6, fontSize: 10, textAlign: 'center', border: '1px solid rgba(0, 245, 155, 0.3)', color: 'var(--accent-emerald)', fontWeight: 700 }}>Store-and-Forward SOS Relay</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 3: Technical Approach (Tech Stack & 4-Step Implementation Flow)
    {
      id: 3,
      tag: 'SLIDE 3',
      title: 'TECHNICAL APPROACH & SYSTEM FLOW',
      subtitle: 'Complete Technology Stack & 4-Step End-to-End Implementation Flow',
      content: (
        <div className="resq-deck-slide3-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Tech Stack Matrix (8 Boxes) */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={15} />
              <span>TECHNOLOGY STACK</span>
            </div>

            <div className="resq-deck-techstack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>MOBILE & MAPS</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• Flutter / React<br/>• MapLibre GL<br/>• OpenStreetMap</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>DATABASE & STORAGE</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• SQLite (on-device)<br/>• GeoPackage (offline)<br/>• Supabase Storage</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>CONNECTIVITY & ALERTS</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• Google Nearby / BLE<br/>• Firebase FCM<br/>• Supabase Auth</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>GEOSPATIAL PROCESSING</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• GeoPandas<br/>• Rasterio + GDAL<br/>• SRTM DEM 30m</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>ROUTING ENGINES</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• A* (on-device offline)<br/>• GraphHopper (online)</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>BACKEND & REAL TIME</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• FastAPI (Python)<br/>• WebSocket Telemetry<br/>• Redis Message Bus</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>RISK & WEATHER INTEL</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• WeatherAPI<br/>• Rule Based Risk Engine</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>DASHBOARD & HOSTING</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>• React Authority HUD<br/>• Render Cloud Edge</div>
              </div>
            </div>
          </div>

          {/* How it Works - 4-step Flow */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-emerald)', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={15} />
              <span>HOW IT WORKS — IMPLEMENTATION FLOW</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { step: '1. Capture & Request', tool: 'Flutter / React', desc: 'App captures GPS fix + citizen reports; requests route via FastAPI (online) or on-device A* (offline).' },
                { step: '2. Compute Safest Path', tool: 'PostGIS / A* / GraphHopper', desc: 'Risk Engine scores roads using DEM elevation and live hazards to return the safest dry route.' },
                { step: '3. Sync & Alert', tool: 'WebSocket + P2P Mesh', desc: 'WebSocket pushes live updates when online; Nearby Connections relays them peer-to-peer when offline.' },
                { step: '4. Monitor & Respond', tool: 'React Authority HUD', desc: 'Authority dashboard tracks SOS queues, shelter capacities, and flood hazards live to coordinate rescue.' }
              ].map((flow, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>{flow.step}</div>
                    <span className="tactical-badge badge-cyan" style={{ fontSize: 9, padding: '1px 6px' }}>{flow.tool}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{flow.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: Feasibility and Viability
    {
      id: 4,
      tag: 'SLIDE 4',
      title: 'FEASIBILITY AND VIABILITY',
      subtitle: 'Technical Feasibility, Offline Resilience Pipeline, and Economic Viability Chart',
      content: (
        <div className="resq-deck-slide4-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: Technical Feasibility & Offline Resilience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: 8 }}>
                TECHNICAL FEASIBILITY
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                • <b>Leverages open source frameworks:</b> Leaflet, FastAPI, SQLite, GDAL.<br/>
                • <b>Modular Microservices Architecture:</b> Decoupled routing, hazard scoring, and telemetry.<br/>
                • <b>Dual Engine:</b> Seamless transition between ON-device offline and Cloud online.
              </div>
            </div>

            {/* Offline Resilience Flow */}
            <div style={{ background: 'rgba(255, 42, 95, 0.08)', border: '1px solid rgba(255, 42, 95, 0.3)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ff4d79', marginBottom: 8, textAlign: 'center' }}>
                OFFLINE RESILIENCE PIPELINE
              </div>
              <div className="resq-deck-offline-flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 10px', borderRadius: 6, flex: 1, border: '1px solid rgba(255, 42, 95, 0.5)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#ff4d79' }}>NETWORK FAIL</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>Towers knocked out</div>
                </div>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>➔</div>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 10px', borderRadius: 6, flex: 1, border: '1px solid rgba(0, 242, 254, 0.5)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-cyan)' }}>MESH P2P</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>Zero hardware mesh</div>
                </div>
                <div style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>➔</div>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 10px', borderRadius: 6, flex: 1, border: '1px solid rgba(0, 245, 155, 0.5)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-emerald)' }}>CONTINUOUS ROUTING</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>Elevation A* active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Economic Viability & Simulated Return */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-emerald)', marginBottom: 6 }}>
                ECONOMIC VIABILITY (SIMULATED DATA)
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                • <b>Low implementation cost:</b> No specialized hardware required — runs on existing citizen smartphones.<br/>
                • <b>Low data cost:</b> Pre-cached vector maps reduce cellular bandwidth by &gt;95%.<br/>
                • <b>Target Market:</b> SDRF, NDRF, and citizens in high-risk zones (Assam, Bihar, West Bengal).
              </div>

              {/* Multi-Bar Graph (From Slide 4) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8 }}>
                {[
                  { year: 'Year 1', capex: 7.0, opex: 9.5, returnVal: 15.0 },
                  { year: 'Year 2', capex: 4.5, opex: 7.5, returnVal: 18.5 },
                  { year: 'Year 3', capex: 12.5, opex: 23.0, returnVal: 32.0 }
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{d.year}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 50, margin: '6px 0' }}>
                      <div title={`Capex: ${d.capex}`} style={{ width: 10, height: `${(d.capex / 35) * 100}%`, background: '#eab308', borderRadius: '2px 2px 0 0' }} />
                      <div title={`Opex: ${d.opex}`} style={{ width: 10, height: `${(d.opex / 35) * 100}%`, background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                      <div title={`Return: ${d.returnVal}`} style={{ width: 10, height: `${(d.returnVal / 35) * 100}%`, background: '#10b981', borderRadius: '2px 2px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-emerald)' }}>+{d.returnVal}x</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8, fontSize: 9, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#eab308', borderRadius: 2 }}></span> CAPEX</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 2 }}></span> OPEX</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: 2 }}></span> PROJECTED RETURN</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 5: Impact and Benefits (The Ultimate Resilience Cycle & Metrics)
    {
      id: 5,
      tag: 'SLIDE 5',
      title: 'IMPACT AND BENEFITS',
      subtitle: 'The Ultimate Resilience Cycle, Estimated Impact Simulated Data, and Tri-Fold Benefits',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* The Ultimate Resilience Cycle (6 Steps) */}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: 0.5, marginBottom: 8 }}>
              THE ULTIMATE RESILIENCE CYCLE (WHO IT PROTECTS)
            </div>

            <div className="resq-deck-cycle-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, textAlign: 'center' }}>
              {[
                { step: '1. HAZARD DETECTION', note: 'Automated hub/beacon sensors detect critical flood condition' },
                { step: '1.5 DATA TRANSMISSION', note: 'Signal mesh relays telemetry peer-to-peer' },
                { step: '2. ALERT VALIDATION', note: 'Byzantine voting confirms community alert' },
                { step: '3. USERS RECEIVE SOS', note: 'Accessible alerts + one-tap SOS trigger' },
                { step: '4. DISPATCH ALLOCATION', note: 'Verified queues prioritized for responders' },
                { step: '5. COORDINATED MGMT', note: 'Multi-modal traffic safe high-ground flow' }
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1.2 }}>{c.step}</div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.2 }}>{c.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Estimated Impact Progress Bars */}
          <div className="resq-deck-impact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                ESTIMATED IMPACT (SIMULATED DATA)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'POPULATION REACHABLE WITHOUT NETWORK', val: 100, color: 'var(--accent-cyan)' },
                  { label: 'SOS DELIVERY SUCCESS', val: 89, color: 'var(--accent-emerald)' },
                  { label: 'EST. REDUCTION IN EVACUATION TIME', val: 54, color: '#a855f7' },
                  { label: 'EST. REDUCTION IN ROUTE CONGESTION', val: 47, color: 'var(--accent-amber)' }
                ].map((m, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      <span style={{ color: m.color, fontWeight: 800 }}>{m.val}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${m.val}%`, height: '100%', background: m.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tri-Fold Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ background: 'rgba(255, 42, 95, 0.08)', border: '1px solid rgba(255, 42, 95, 0.3)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff4d79', fontSize: 11, fontWeight: 800 }}>
                  <Users size={14} /> <span>SOCIAL BENEFIT</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Protects the golden hour for at-risk groups; equitable access regardless of literacy, income, or device.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--border-cyan)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: 11, fontWeight: 800 }}>
                  <DollarSign size={14} /> <span>ECONOMIC BENEFIT</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Earlier, verified warnings cut property damage and rescue costs; smoother evacuation limits business disruption.
                </div>
              </div>

              <div style={{ background: 'rgba(0, 245, 155, 0.08)', border: '1px solid rgba(0, 245, 155, 0.3)', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)', fontSize: 11, fontWeight: 800 }}>
                  <Leaf size={14} /> <span>ENVIRONMENTAL BENEFIT</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2 }}>
                  On-device routing cuts constant cloud calls; load balancing reduces fuel burn and emissions from gridlock.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 6: Research and References
    {
      id: 6,
      tag: 'SLIDE 6',
      title: 'RESEARCH AND REFERENCES',
      subtitle: 'Peer-Reviewed Scientific Foundations & 5 Critical Data Sources',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 4 Research Papers */}
          <div className="resq-deck-papers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {RESEARCH_PAPERS.map((paper) => (
              <div
                key={paper.id}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="tactical-badge badge-cyan" style={{ fontSize: 8 }}>{paper.title}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{paper.journal.split('(')[0]}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 4 }}>
                    {paper.paperName}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {paper.keyTakeaway}
                  </div>
                </div>

                <a
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ alignSelf: 'flex-start', marginTop: 6, fontSize: 9, color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                >
                  <span>Open DOI / Article</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>

          {/* 5 Data Sources */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#ffffff', marginBottom: 6, letterSpacing: 0.5 }}>
              DATA SOURCES INGESTED BY RESQ
            </div>

            <div className="resq-deck-ds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, textAlign: 'center' }}>
              {DATA_SOURCES_INFO.map((ds, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--accent-cyan)' }}>{ds.name}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.2 }}>{ds.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(4, 7, 14, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div className="glass-panel resq-deck-modal" style={{
        width: 960,
        maxWidth: '96vw',
        maxHeight: '92vh',
        border: '1px solid var(--border-cyan)',
        padding: 24,
        boxShadow: '0 0 50px rgba(0, 242, 254, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        {/* Top bar */}
        <div className="resq-deck-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="var(--accent-cyan)" />
            <div>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5 }}>
                RESQ HACKATHON SLIDE DECK
              </span>
              <span className="tactical-badge badge-cyan" style={{ marginLeft: 8, fontSize: 10 }}>
                {current.tag} OF 6
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>
              <X size={16} />
              <span>Close Deck</span>
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div style={{ flex: 1, minHeight: 400, marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-cyan)', margin: 0, letterSpacing: 0.5 }}>
              {current.title}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {current.subtitle}
            </div>
          </div>

          {current.content}
        </div>

        {/* Navigation Bar */}
        <div className="resq-deck-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <button
            onClick={() => {
              if (currentSlide > 0) {
                if (soundEnabled) playSound('click');
                setCurrentSlide(s => s - 1);
              }
            }}
            disabled={currentSlide === 0}
            className="btn-ghost"
            style={{ opacity: currentSlide === 0 ? 0.3 : 1, padding: '8px 16px', fontSize: 12 }}
          >
            <ChevronLeft size={16} />
            Previous Slide
          </button>

          {/* Dots & Jump to Slide */}
          <div className="resq-deck-dots" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setCurrentSlide(i);
                }}
                style={{
                  height: 24,
                  padding: i === currentSlide ? '0 10px' : '0 6px',
                  borderRadius: 12,
                  border: 'none',
                  background: i === currentSlide ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                  color: i === currentSlide ? '#04070e' : '#94a3b8',
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                if (soundEnabled) playSound('click');
                setCurrentSlide(s => s + 1);
              }
            }}
            disabled={currentSlide === slides.length - 1}
            className="btn-primary"
            style={{ opacity: currentSlide === slides.length - 1 ? 0.3 : 1, padding: '8px 16px', fontSize: 12 }}
          >
            Next Slide
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
