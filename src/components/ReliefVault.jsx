import React, { useState } from 'react';
import { 
  Vault, 
  Coins, 
  HeartHandshake, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_RELIEF_VAULT } from '../utils/web3Mock';
import { playSound } from '../utils/audioEffects';

export default function ReliefVault({ soundEnabled, walletConnected, onConnectWallet }) {
  const [vault, setVault] = useState(INITIAL_RELIEF_VAULT);
  const [donationAmount, setDonationAmount] = useState('0.5');
  const [donationToken, setDonationToken] = useState('ETH');
  const [isDonating, setIsDonating] = useState(false);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;

    if (!walletConnected) {
      onConnectWallet();
      return;
    }

    setIsDonating(true);
    if (soundEnabled) playSound('click');

    setTimeout(() => {
      setIsDonating(false);
      if (soundEnabled) playSound('success');

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      const num = parseFloat(donationAmount);
      const isEth = donationToken === 'ETH';

      const newTx = {
        txHash: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
        donor: 'Your Wallet (0x71...b48)',
        amount: `${donationAmount} ${donationToken}`,
        time: 'Just now',
        purpose: 'Direct Emergency Evacuation Escrow'
      };

      setVault(prev => ({
        ...prev,
        totalBalanceEth: isEth ? prev.totalBalanceEth + num : prev.totalBalanceEth,
        totalBalanceUsdc: !isEth ? prev.totalBalanceUsdc + num : prev.totalBalanceUsdc + (num * 3100),
        donations: [newTx, ...prev.donations]
      }));

      setDonationAmount('');
    }, 900);
  };

  const handleClaimBounty = (bountyId) => {
    if (soundEnabled) playSound('success');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setVault(prev => ({
      ...prev,
      bounties: prev.bounties.map(b => {
        if (b.id === bountyId) {
          return {
            ...b,
            status: 'CLAIMED_AND_DISBURSED',
            responder: 'Your Responder Unit (0x71...b48)'
          };
        }
        return b;
      })
    }));
  };

  return (
    <div className="resq-vault-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16 }}>
      
      {/* Left Column: Vault Overview & On-Chain Bounties */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Treasury Metrics Card */}
        <div className="glass-panel" style={{ padding: 22, border: '1px solid var(--border-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-cyan)'
              }}>
                <Vault size={20} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                  ON-CHAIN DISASTER RELIEF SMART VAULT
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Contract: <span className="code-pill">{vault.contractAddress}</span> ({vault.chain})
                </div>
              </div>
            </div>

            <span className="tactical-badge badge-emerald">
              QUADRATIC 2.4x ACTIVE
            </span>
          </div>

          <div className="resq-vault-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>TOTAL POOL BALANCE</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
                ${vault.totalBalanceUsdc.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--accent-cyan)', marginTop: 2 }}>
                ~{vault.totalBalanceEth.toFixed(2)} ETH Reserves
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ESCROW DISBURSED</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 4 }}>
                ${vault.disbursedUsdc.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                100% Verifiable on Explorer
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>MATCHING POOL</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#ff4fac', marginTop: 4 }}>
                2.4x Boost
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                Gitcoin / DeSci Partner Match
              </div>
            </div>
          </div>
        </div>

        {/* Responder Bounties Escrow */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Coins size={16} color="var(--accent-amber)" />
                <span>ACTIVE FIRST RESPONDER ESCROW BOUNTIES</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Funds are locked in smart contracts and released automatically upon verified SOS resolution.
              </div>
            </div>
            <span className="code-pill">{vault.bounties.length} BOUNTIES</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vault.bounties.map(b => (
              <div
                key={b.id}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                className="resq-bounty-item"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="code-pill">{b.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{b.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Assigned: <span style={{ color: '#ffffff' }}>{b.responder}</span>
                  </div>
                </div>

                <div className="resq-bounty-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {b.reward}
                    </div>
                    <span className={`tactical-badge ${b.status === 'CLAIMED_AND_DISBURSED' ? 'badge-emerald' : b.status === 'DISPATCHED' ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: 9 }}>
                      {b.status}
                    </span>
                  </div>

                  {b.status === 'OPEN' && (
                    <button
                      onClick={() => handleClaimBounty(b.id)}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Fulfill & Claim
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Transparent Ledger */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={15} color="var(--accent-cyan)" />
            <span>TRANSPARENT RELIEF DISBURSEMENT LEDGER</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {vault.donations.map((tx, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  fontSize: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{tx.purpose}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>From {tx.donor} • {tx.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+{tx.amount}</div>
                  <span className="code-pill">{tx.txHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Interactive Relief Donation Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div className="glass-panel-cyan" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <HeartHandshake size={20} color="var(--accent-cyan)" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>DIRECT DISASTER RELIEF CONTRIBUTION</span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.5 }}>
            Every contribution directly funds boat rescue bounties, drone battery reserves, and emergency rations for flooded citizens. 100% non-custodial and auditable on Arbitrum L2.
          </div>

          <form onSubmit={handleDonate}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Token Asset</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setDonationToken('ETH')}
                  className={`btn-ghost ${donationToken === 'ETH' ? 'active' : ''}`}
                  style={{ justifyContent: 'center' }}
                >
                  Ethereum (ETH)
                </button>
                <button
                  type="button"
                  onClick={() => setDonationToken('USDC')}
                  className={`btn-ghost ${donationToken === 'USDC' ? 'active' : ''}`}
                  style={{ justifyContent: 'center' }}
                >
                  USD Coin (USDC)
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Contribution Amount</label>
              <input
                type="number"
                step="any"
                required
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="e.g. 0.5"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: '#070a12',
                  border: '1px solid var(--border-cyan)',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isDonating}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}
            >
              <Sparkles size={16} />
              {isDonating ? 'Broadcasting to Vault...' : `Deposit ${donationAmount || 0} ${donationToken}`}
            </button>
          </form>

          <div style={{ marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Matching Partner: Gitcoin Disaster Round (2.4x active)
            </div>
          </div>
        </div>

        {/* Decentralized Identity & Credential Vault */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--accent-cyan)' }}>
            DECENTRALIZED RESCUE DID PROTOCOL
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            ResQ utilizes W3C-compliant Decentralized Identifiers (DIDs) to verify civilian triage requests and official first responders (NDRF / SDRF) without reliance on centralized identity servers.
          </div>

          <div style={{ background: '#05070d', padding: 10, borderRadius: 6, border: '1px solid var(--border-subtle)', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-emerald)' }}>
            did:resq:0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7#first-responder-key-1
          </div>
        </div>

      </div>

    </div>
  );
}
