import React, { useState } from 'react';
import { 
  Building2, 
  IndianRupee, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Send, 
  CheckCircle2, 
  Clock, 
  Users,
  PackageCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audioEffects';

const INITIAL_TREASURY_STATE = {
  totalBudgetInr: 45000000,
  disbursedInr: 28450000,
  availableInr: 16550000,
  beneficiariesCount: 14280,
  inventoryItems: [
    { name: 'Potable Drinking Water (20L Cans)', total: 25000, dispatched: 18400, unit: 'Units' },
    { name: 'High-Calorie Ready Food Rations', total: 60000, dispatched: 42500, unit: 'Meal Packs' },
    { name: 'Emergency Trauma & Waterborne Med Kits', total: 8500, dispatched: 6100, unit: 'Kits' },
    { name: 'NDRF Inflatable Rescue Motorboats', total: 48, dispatched: 42, unit: 'Boats Active' },
    { name: 'Solar Emergency Battery Packs', total: 5000, dispatched: 3200, unit: 'Units' }
  ],
  recentDisbursements: [
    { id: 'DBT-ASM-9821', recipient: 'Kamrup Metro Flood Ward 4', amount: '₹12,50,000', purpose: 'Community Kitchen & Water Treatment', time: '14 mins ago', status: 'COMPLETED' },
    { id: 'DBT-ASM-9820', recipient: 'Nilachal High Ground Camp', amount: '₹8,00,000', purpose: 'Field Clinic Oxygen & Antiseptic Stocks', time: '42 mins ago', status: 'COMPLETED' },
    { id: 'DBT-BHR-4112', recipient: 'Patna Digha Relief Center', amount: '₹15,00,000', purpose: 'SDRF Inflatable Boat Fuel & Rations', time: '1 hr ago', status: 'COMPLETED' },
    { id: 'DBT-WB-2039', recipient: 'Bally Belur High Shelter', amount: '₹6,40,000', purpose: 'Dry Rations & Baby Nutrition Kits', time: '2 hrs ago', status: 'COMPLETED' }
  ]
};

export default function ReliefFundTreasury({ soundEnabled }) {
  const [treasury, setTreasury] = useState(INITIAL_TREASURY_STATE);
  const [donateAmount, setDonateAmount] = useState('5000');
  const [donorName, setDonorName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDonate = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(donateAmount);
    if (!amountNum || amountNum <= 0) return;

    setIsProcessing(true);
    if (soundEnabled) playSound('click');

    setTimeout(() => {
      setIsProcessing(false);
      if (soundEnabled) playSound('success');

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      const newTx = {
        id: `DON-${Date.now().toString().slice(-4)}`,
        recipient: 'Emergency Evacuation & Citizen Escrow',
        amount: `₹${amountNum.toLocaleString('en-IN')}`,
        purpose: `Direct Citizen Disaster Aid (via ${paymentMethod})`,
        time: 'Just now',
        status: 'COMPLETED'
      };

      setTreasury(prev => ({
        ...prev,
        totalBudgetInr: prev.totalBudgetInr + amountNum,
        availableInr: prev.availableInr + amountNum,
        recentDisbursements: [newTx, ...prev.recentDisbursements]
      }));

      setSuccessMessage(`Thank you! ₹${amountNum.toLocaleString('en-IN')} successfully contributed to the Emergency Relief Escrow.`);
      setDonateAmount('');
      setDonorName('');

      setTimeout(() => setSuccessMessage(''), 6000);
    }, 800);
  };

  const percentDisbursed = Math.round((treasury.disbursedInr / treasury.totalBudgetInr) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Relief Treasury
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          SDRF disaster reserves, Direct Benefit Transfer (DBT) citizen aid & rescue logistics
        </p>
      </div>

      {/* Stat Cards Stack (Reference Mobile Dashboard Standard) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        
        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">TOTAL EMERGENCY ALLOCATION</span>
            <div className="stat-card-value">
              ₹{(treasury.totalBudgetInr / 10000000).toFixed(2)} Cr
            </div>
            <span className="stat-card-subtext">
              Allocated SDRF & Disaster Reserves
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)' }}>
            <Building2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">DISBURSED AID TO CITIZENS</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-emerald)' }}>
              ₹{(treasury.disbursedInr / 10000000).toFixed(2)} Cr
            </div>
            <span className="stat-card-subtext" style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {percentDisbursed}% of total mobilized
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--accent-emerald)' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">IMMEDIATE FIELD ESCROW</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>
              ₹{(treasury.availableInr / 10000000).toFixed(2)} Cr
            </div>
            <span className="stat-card-subtext">
              Ready for immediate field release
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-cyan)' }}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-left">
            <span className="stat-card-title">BENEFICIARY HOUSEHOLDS</span>
            <div className="stat-card-value" style={{ color: 'var(--accent-purple)' }}>
              {treasury.beneficiariesCount.toLocaleString()}
            </div>
            <span className="stat-card-subtext">
              Verified Direct Benefit Transfers
            </span>
          </div>
          <div className="stat-icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-purple)' }}>
            <Users size={24} />
          </div>
        </div>

      </div>

      {/* Contribution Form & Rescue Logistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        
        {/* Contribution Card */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <HeartHandshake size={20} color="var(--accent-red)" />
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
              Contribute to Emergency Relief
            </h2>
          </div>

          {successMessage && (
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--accent-emerald)',
              padding: 10,
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14
            }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>
                DONOR NAME / ENTITY (OPTIONAL)
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Citizen Guild or Anonymous"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>
                AMOUNT IN INR (₹)
              </label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                {['1000', '2500', '5000', '10000'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonateAmount(amt)}
                    className="btn-ghost"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: donateAmount === amt ? 700 : 500,
                      borderColor: donateAmount === amt ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                      background: donateAmount === amt ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-tertiary)'
                    }}
                  >
                    ₹{parseInt(amt).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                placeholder="Enter custom amount in ₹"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 700
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="action-pill-btn action-pill-primary"
              style={{ marginTop: 4 }}
            >
              {isProcessing ? 'Processing Gateway...' : `Disburse ₹${donateAmount ? parseInt(donateAmount || 0).toLocaleString('en-IN') : '0'} to Relief Escrow`}
            </button>
          </form>
        </div>

        {/* Inventory Tracker Card */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Truck size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
              Rescue Inventory Logistics
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {treasury.inventoryItems.map((item, idx) => {
              const pct = Math.round((item.dispatched / item.total) * 100);
              return (
                <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {item.dispatched.toLocaleString()} / {item.total.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? 'var(--accent-red)' : 'var(--accent-cyan)', borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
