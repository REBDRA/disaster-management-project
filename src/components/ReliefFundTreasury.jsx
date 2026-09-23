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
  Sparkles,
  Users,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audioEffects';

const INITIAL_TREASURY_STATE = {
  totalBudgetInr: 45000000, // ₹4.5 Crore
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
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Building2 size={20} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              National & State Emergency Relief Treasury
            </h1>
            <span className="tactical-badge badge-emerald">
              DIRECT BENEFIT ESCROW
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Transparent real-time mobilization of state disaster relief funds (SDRF), emergency donor contributions, and frontline rescue supplies.
          </p>
        </div>

        <div className="code-pill" style={{ color: 'var(--accent-emerald)', fontSize: 12 }}>
          <ShieldCheck size={14} /> CAG & SDRF AUDIT VERIFIED
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        
        <div className="glass-panel" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TOTAL EMERGENCY POOL
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 6 }}>
            ₹{(treasury.totalBudgetInr / 10000000).toFixed(2)} Cr
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Allocated SDRF & Disaster Reserves
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            DISBURSED TO CITIZENS & CAMPS
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)', marginTop: 6 }}>
            ₹{(treasury.disbursedInr / 10000000).toFixed(2)} Cr
          </div>
          <span style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 600 }}>
            {percentDisbursed}% of total mobilized
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            IMMEDIATE AVAILABLE ESCROW
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 6 }}>
            ₹{(treasury.availableInr / 10000000).toFixed(2)} Cr
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Instant release ready for field triage
          </span>
        </div>

        <div className="glass-panel" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            CITIZENS AIDED DIRECTLY
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 6 }}>
            {treasury.beneficiariesCount.toLocaleString()}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Verified DBT Beneficiary Households
          </span>
        </div>

      </div>

      {/* Two Column Grid: Emergency Contribution Gateway + Logistics Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        
        {/* Instant Relief Contribution Form */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <HeartHandshake size={20} color="var(--accent-red)" />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Contribute to Emergency Relief Escrow
            </h2>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
            100% of funds are directly disbursed to verified high-ground relief camps and field boat fuel units.
          </p>

          {successMessage && (
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--accent-emerald)',
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16
            }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleDonate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                DONOR NAME / ORGANIZATION (OPTIONAL)
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Guwahati Citizen Guild or Anonymous"
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                CONTRIBUTION AMOUNT (INR ₹)
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {['1000', '2500', '5000', '10000'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonateAmount(amt)}
                    className="btn-ghost"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      fontSize: 12,
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
                  borderRadius: 8,
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                PAYMENT GATEWAY METHOD
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'UPI', label: 'UPI / QR Code', icon: <QrCode size={14} /> },
                  { id: 'CARD', label: 'Debit / Credit Card', icon: <CreditCard size={14} /> },
                  { id: 'NETBANKING', label: 'Direct NetBanking', icon: <Building2 size={14} /> }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: paymentMethod === method.id ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      background: paymentMethod === method.id ? 'rgba(2, 132, 199, 0.1)' : 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px 18px',
                fontSize: 14,
                marginTop: 6
              }}
            >
              {isProcessing ? 'Processing Secure Gateway...' : `Disburse ₹${donateAmount ? parseInt(donateAmount || 0).toLocaleString('en-IN') : '0'} to Relief Escrow`}
            </button>
          </form>
        </div>

        {/* Frontline Rescue Logistics & Inventory */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Truck size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Frontline Rescue Inventory & Resource Tracker
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {treasury.inventoryItems.map((item, idx) => {
              const pct = Math.round((item.dispatched / item.total) * 100);
              return (
                <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {item.dispatched.toLocaleString()} / {item.total.toLocaleString()} {item.unit}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: 6, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct > 80 ? 'var(--accent-red)' : 'var(--accent-cyan)',
                      borderRadius: 4
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>{pct}% Deployed to Field Units</span>
                    <span>{(item.total - item.dispatched).toLocaleString()} in Reserve</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Direct Benefit Transfer (DBT) Disbursement Audit Log */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <PackageCheck size={20} color="var(--accent-emerald)" />
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
              Live Emergency Disbursement & Grant Ledger
            </h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Direct transfers to district emergency officers, rescue boat units, and field medical centers.
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Transfer ID</th>
                <th style={{ padding: '10px 14px' }}>Recipient Entity</th>
                <th style={{ padding: '10px 14px' }}>Disbursed Amount</th>
                <th style={{ padding: '10px 14px' }}>Purpose / Allocation</th>
                <th style={{ padding: '10px 14px' }}>Time</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {treasury.recentDisbursements.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)' }}>
                    {tx.id}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    {tx.recipient}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {tx.amount}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {tx.purpose}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: 11 }}>
                    {tx.time}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="tactical-badge badge-emerald">
                      <CheckCircle2 size={12} /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
