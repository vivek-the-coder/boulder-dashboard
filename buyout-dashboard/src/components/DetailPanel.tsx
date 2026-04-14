"use client";

import React, { useState } from "react";
import { Package } from "@/types";
import { BIDS_DB, CONTRACT_STEP_HINTS } from "@/data/db";

interface DetailPanelProps {
  pkg: Package;
  onClose: () => void;
  onStatusChange: (pkgId: number, newStatus: string) => void;
}

const STATUS_CLASS: Record<string, string> = {
  "Not Started": "s-not-started",
  "Bidding": "s-bidding",
  "Reviewing Bids": "s-reviewing",
  "Scope Leveling": "s-leveling",
  "Negotiating": "s-negotiating",
  "Pending Decision": "s-pending",
  "Ready to Award": "s-ready",
  "Awarded": "s-awarded",
  "Contract Out": "s-contract",
  "Executed": "s-executed",
  "On Hold": "s-hold",
  "Overdue": "s-overdue",
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || amount === 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
};

const formatCurrencyFull = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || amount === 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
};

const daysFromTodayLocal = (dateStr: string) => {
  const TODAY = new Date("2025-04-15");
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / 86400000);
};

export function DetailPanel({ pkg, onClose, onStatusChange }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedBids, setExpandedBids] = useState<Record<string, boolean>>({});

  const bids = BIDS_DB[pkg.id] || [];
  const days = daysFromTodayLocal(pkg.dueDate);
  const overdue = pkg.overdue || days < 0;
  const variance = pkg.lowBid && pkg.budget ? ((pkg.lowBid / pkg.budget - 1) * 100).toFixed(1) : null;
  const varianceValue = variance ? parseFloat(variance) : 0;

  const toggleBid = (bidIdx: number) => {
    const key = `${pkg.id}-${bidIdx}`;
    setExpandedBids((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSetBidStatus = (bidIdx: number, newStatus: string) => {
    // In actual app, update DB. For UI, we would call a prop or update state.
    // For now, logging.
    console.log(`Setting bid ${bidIdx} to ${newStatus}`);
  };

  return (
    <div className="detail-panel" id="detailPanel" style={{ transform: "translateX(0)" }}>
      {/* HEADER SECTION */}
      <div className="detail-header">
        <div className="detail-header-top">
          <div>
            <div className="detail-pkg-name" id="dpName">{pkg.name}</div>
            <div className="detail-pkg-sub" id="dpSub">{pkg.csi} · {pkg.trade} · {pkg.project}</div>
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="detail-status-row" id="dpStatusRow">
          <span className={`dsr-status ${STATUS_CLASS[pkg.status] || "s-not-started"}`}>{pkg.status}</span>
          <span className="dsr-pill muted">{pkg.pm}</span>
          <span className="dsr-pill muted">{pkg.priority} Priority</span>
          {overdue ? (
            <span className="dsr-pill red">⚠ Overdue {Math.abs(days)}d</span>
          ) : days === 0 ? (
            <span className="dsr-pill amber">Due Today</span>
          ) : days <= 5 ? (
            <span className="dsr-pill amber">Due in {days}d</span>
          ) : null}
          {pkg.longLead && <span className="dsr-pill amber">⏳ Long Lead</span>}
          {pkg.risk === 'High' && <span className="dsr-pill red">High Risk</span>}
        </div>
        
        <div className="detail-kpi-strip" id="dpKpiStrip">
          <div className="dkpi">
            <div className="dkpi-val">{pkg.lowBid ? formatCurrency(pkg.lowBid) : "—"}</div>
            <div className="dkpi-label">Low Bid</div>
          </div>
          <div className="dkpi">
            <div className={`dkpi-val ${variance !== null ? (varianceValue < 0 ? 'green' : 'red') : ''}`}>
              {variance !== null ? (varianceValue > 0 ? '+' : '') + variance + '%' : '—'}
            </div>
            <div className="dkpi-label">vs Budget</div>
          </div>
          <div className="dkpi">
            <div className={`dkpi-val ${pkg.coverageCount < 2 ? "amber" : "green"}`}>{pkg.coverageCount}</div>
            <div className="dkpi-label">Bids</div>
          </div>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="detail-tabs">
        <div className={`dtab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </div>
        <div className={`dtab ${activeTab === 'bids' ? 'active' : ''}`} onClick={() => setActiveTab('bids')}>
          Bids{bids.length > 0 && <span className="dtab-count">{bids.length}</span>}
        </div>
        <div className={`dtab ${activeTab === 'contract' ? 'active' : ''}`} onClick={() => setActiveTab('contract')}>
          Contract
        </div>
        <div className={`dtab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          Notes
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="detail-body">
        
        {/* TAB 1: OVERVIEW */}
        <div id="tab-overview" className={`tab-panel ${activeTab === 'overview' ? 'active' : ''}`}>
          
          {/* Award Banner */}
          {pkg.selectedVendor && (pkg.status === 'Awarded' || pkg.status === 'Ready to Award') && (
            <div className="award-bar">
              <div className="award-icon">★</div>
              <div className="award-text">
                <div className="award-vendor">{pkg.selectedVendor}</div>
                <div className="award-amount">{formatCurrencyFull(pkg.awardAmount || pkg.lowBid)}</div>
              </div>
              <div className="award-badge">RECOMMENDED</div>
            </div>
          )}

          {/* Urgent Alerts */}
          {pkg.risks?.map((r, i) => (
            <div key={i} className={`dp-alert ${r.icon === '🔴' ? 'red' : 'amber'}`} style={{ marginBottom: 0 }}>
              <div className="dp-alert-icon">{r.icon}</div>
              <div className="dp-alert-body">
                <div className="dp-alert-title">{r.label}</div>
                <div className="dp-alert-desc">{r.desc}</div>
              </div>
            </div>
          ))}

          {/* Money Card */}
          <div className="dp-card" style={{ marginTop: '12px' }}>
            <div className="dp-stat-row">
              <div className="dp-stat">
                <div className="dp-stat-val">{formatCurrency(pkg.budget)}</div>
                <div className="dp-stat-label">Budget</div>
              </div>
              <div className="dp-stat">
                <div className={`dp-stat-val ${pkg.lowBid ? (pkg.lowBid < pkg.budget ? 'green' : 'red') : ''}`}>
                  {pkg.lowBid ? formatCurrency(pkg.lowBid) : '—'}
                </div>
                <div className="dp-stat-label">Low Bid</div>
              </div>
              <div className="dp-stat">
                <div className={`dp-stat-val ${variance !== null ? (varianceValue < 0 ? 'green' : 'red') : ''}`}>
                  {variance !== null ? (varianceValue > 0 ? '+' : '') + variance + '%' : '—'}
                </div>
                <div className="dp-stat-label">Variance</div>
              </div>
            </div>
            {pkg.awardAmount && (
              <div className="dp-info-row">
                <span className="dp-info-label">Award Amount</span>
                <span className="dp-info-val mono green">{formatCurrencyFull(pkg.awardAmount)}</span>
              </div>
            )}
          </div>

          {/* Schedule & Assignment */}
          <div className="dp-card">
            <div className="dp-card-title">Schedule & Assignment</div>
            <div className="dp-info-row">
              <span className="dp-info-label">Target Award</span>
              <span className={`dp-info-val mono ${overdue ? 'red' : days <= 5 ? 'amber' : ''}`}>
                {formatDate(pkg.dueDate)}
                {overdue ? ` · ${Math.abs(days)}d late` : days === 0 ? ' · Today' : days <= 5 ? ` · ${days}d` : ''}
              </span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">Needed On Site</span>
              <span className={`dp-info-val mono ${pkg.onSiteDate ? '' : 'muted'}`}>
                {formatDate(pkg.onSiteDate)}
              </span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">PM / Estimator</span>
              <span className="dp-info-val">{pkg.pm}</span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">Bid Coverage</span>
              <span className={`dp-info-val ${pkg.coverageCount < 2 ? 'amber' : 'green'}`}>
                {pkg.coverageCount < 2 ? '⚠ ' : '✓ '}{pkg.coverageCount} bid{pkg.coverageCount !== 1 ? 's' : ''} received
              </span>
            </div>
            {pkg.selectedVendor && (
              <div className="dp-info-row">
                <span className="dp-info-label">Rec. Vendor</span>
                <span className="dp-info-val green">{pkg.selectedVendor}</span>
              </div>
            )}
            {pkg.dropboxFolder && (
              <div className="dp-info-row">
                <span className="dp-info-label">Dropbox Folder</span>
                <span className="dp-info-val"><a className="detail-dropbox-link">📁 {pkg.dropboxFolder}</a></span>
              </div>
            )}
            {pkg.warranties && (
              <div className="dp-info-row">
                <span className="dp-info-label">Warranties</span>
                <span className="dp-info-val">{pkg.warranties}</span>
              </div>
            )}
            {pkg.vendorData && (
              <div className="dp-info-row">
                <span className="dp-info-label">Vendor Data</span>
                <span className="dp-info-val" style={{ fontSize: '11px' }}>{pkg.vendorData}</span>
              </div>
            )}
          </div>

          {/* Notes Card */}
          {pkg.notes && (
            <div className="dp-card" style={{ marginBottom: '14px' }}>
              <div className="dp-card-title">Notes</div>
              <div className="dp-notes-text">{pkg.notes}</div>
            </div>
          )}

        </div>

        {/* TAB 2: BIDS */}
        <div id="tab-bids" className={`tab-panel ${activeTab === 'bids' ? 'active' : ''}`}>
          <div className="bid-comparison">
            <div className="bid-summary-bar">
              <div>
                <div className="bid-summary-left">{bids.length} Bid{bids.length !== 1 ? 's' : ''} Received</div>
                <div className="bid-summary-sub">Budget {formatCurrencyFull(pkg.budget)} · Low bid {formatCurrencyFull(pkg.lowBid)}</div>
              </div>
              <span className={`bid-cov-badge ${pkg.coverageCount < 2 ? 'warning' : 'ok'}`}>
                {pkg.coverageCount < 2 ? '⚠ Need More Bids' : '✓ Coverage OK'}
              </span>
            </div>
            
            {!bids.length ? (
              <div className="empty-state" style={{ margin: '12px 14px' }}>
                <div className="icon">📭</div>
                <p>No bids received yet</p>
                <small>Issue RFP to begin bid collection</small>
              </div>
            ) : (
              bids.map((bid, i) => {
                const vsBudget = ((bid.amount / pkg.budget - 1) * 100).toFixed(1);
                const vsBudgetValue = parseFloat(vsBudget);
                const isExpanded = expandedBids[`${pkg.id}-${i}`];
                
                const tagClassMap: Record<string, string> = { recommended: 'recommended', backup: 'backup', excluded: 'excluded', preferred: 'preferred', pending: 'pending' };
                const tagClass = tagClassMap[bid.status] || 'pending';
                const tagLabel = bid.status.charAt(0).toUpperCase() + bid.status.slice(1);
                
                return (
                  <div key={i} className={`bid-card ${bid.status}`} id={`bid-card-${pkg.id}-${i}`}>
                    <div className="bid-card-header" onClick={() => toggleBid(i)}>
                      <div className={`bid-rank rank-${bid.rank === 'EX' ? 'ex' : bid.rank}`}>{bid.rank}</div>
                      <div className="bid-vendor">{bid.vendor}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginLeft: "auto" }}>
                        <div className="bid-amount">{formatCurrencyFull(bid.amount)}</div>
                        <span className={`bid-vs-budget ${vsBudgetValue < 0 ? 'bid-under' : 'bid-over'}`}>
                          {vsBudgetValue > 0 ? '+' : ''}{vsBudget}%
                        </span>
                        <span className={`bid-tag ${tagClass}`}>{tagLabel}</span>
                        <span className={`bid-chevron ${isExpanded ? 'open' : ''}`}>▼</span>
                      </div>
                    </div>
                    
                    <div className={`bid-card-body ${isExpanded ? 'expanded' : ''}`} id={`bid-body-${pkg.id}-${i}`}>
                      <div className="bid-detail-grid">
                        <div className="bid-detail-item">
                          <div className="bid-detail-label">Received</div>
                          <div className="bid-detail-val">{formatDate(bid.received)}</div>
                        </div>
                        <div className="bid-detail-item">
                          <div className="bid-detail-label">Scope</div>
                          <div className={`bid-detail-val ${bid.scopeComplete === 'Complete' ? 'green' : bid.scopeComplete === 'Partial' ? 'amber' : 'red'}`}>
                            {bid.scopeComplete === 'Complete' ? '✓ Complete' : bid.scopeComplete === 'Partial' ? '◑ Partial' : '✗ Incomplete'}
                          </div>
                        </div>
                        <div className="bid-detail-item">
                          <div className="bid-detail-label">Leveled</div>
                          <div className={`bid-detail-val ${bid.leveled ? 'green' : 'amber'}`}>
                            {bid.leveled ? '✓ Yes' : '⏳ In Progress'}
                          </div>
                        </div>
                        <div className="bid-detail-item">
                          <div className="bid-detail-label">Alternates</div>
                          <div className="bid-detail-val">{bid.alternates}</div>
                        </div>
                        <div className="bid-detail-item full">
                          <div className="bid-detail-label">Inclusions</div>
                          <div className="bid-detail-val">{bid.inclusions}</div>
                        </div>
                        <div className="bid-detail-item full">
                          <div className="bid-detail-label">Exclusions</div>
                          <div className={`bid-detail-val ${bid.exclusions !== 'None' && bid.exclusions !== 'None noted' ? 'amber' : ''}`}>{bid.exclusions}</div>
                        </div>
                        <div className="bid-detail-item full">
                          <div className="bid-detail-label">Qualifications</div>
                          <div className="bid-detail-val">{bid.qualifications}</div>
                        </div>
                        <div className="bid-detail-item full">
                          <div className="bid-detail-label">Notes</div>
                          <div className="bid-detail-val">{bid.notes}</div>
                        </div>
                      </div>
                      <div className="bid-detail-actions">
                        {bid.status !== 'recommended' && (
                          <button className="bid-action-btn recommend" onClick={(e) => { e.stopPropagation(); handleSetBidStatus(i, 'recommended'); }}>
                            ✓ Recommend
                          </button>
                        )}
                        {bid.status !== 'excluded' && (
                          <button className="bid-action-btn exclude" onClick={(e) => { e.stopPropagation(); handleSetBidStatus(i, 'excluded'); }}>
                            Exclude
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TAB 3: CONTRACT */}
        <div id="tab-contract" className={`tab-panel ${activeTab === 'contract' ? 'active' : ''}`}>
          <div className="dp-card" style={{ marginTop: '12px' }}>
            <div className="dp-card-title">Contract Progress</div>
            <div className="dp-contract-steps">
              <div className="dp-step-list">
                {pkg.contractSteps.map((s, i) => {
                  const progress = pkg.contractProgress;
                  const cls = i < progress ? 'done' : i === progress ? 'active' : 'future';
                  return (
                    <div key={i} className="dp-step-item">
                      <div className="dp-step-icon-wrap">
                        <div className={`dp-step-icon ${cls}`}>
                          {i < progress ? '✓' : i === progress ? '→' : ''}
                        </div>
                        <div className={`dp-step-line ${i < progress ? 'done' : ''}`}></div>
                      </div>
                      <div className="dp-step-content">
                        <div className={`dp-step-name ${cls}`}>{s}</div>
                        {i === progress && <div className="dp-step-hint">{CONTRACT_STEP_HINTS[i] || ''}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="dp-card" style={{ marginBottom: '14px' }}>
            <div className="dp-card-title">Contract Details</div>
            <div className="dp-info-row">
              <span className="dp-info-label">Status</span>
              <span className="dp-info-val">{pkg.contractStatus}</span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">Vendor</span>
              <span className={`dp-info-val ${pkg.selectedVendor ? '' : 'muted'}`}>{pkg.selectedVendor || 'Not selected'}</span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">Award Amount</span>
              <span className={`dp-info-val mono ${pkg.awardAmount ? '' : 'muted'}`}>{pkg.awardAmount ? formatCurrencyFull(pkg.awardAmount) : '—'}</span>
            </div>
            <div className="dp-info-row">
              <span className="dp-info-label">Budget</span>
              <span className="dp-info-val mono">{formatCurrencyFull(pkg.budget)}</span>
            </div>
          </div>
        </div>

        {/* TAB 4: NOTES */}
        <div id="tab-notes" className={`tab-panel ${activeTab === 'notes' ? 'active' : ''}`}>
          <div className="dp-card" style={{ marginTop: '12px', marginBottom: '14px' }}>
            <div className="dp-card-title">Activity & Notes</div>
            <div className="dp-notes-area">
              {[
                { initials:'JP', author:'Jay Patel', time:'Apr 12, 4:30 PM', text:'Reviewed bids with Rush and Uma. Northstar looks best — scope is cleanest and they have prior experience with Hilton brand. Rush to get final VRF equipment lead confirmation from Summit today.' },
                { initials:'RP', author:'Rush Patel', time:'Apr 11, 9:15 AM', text:'Summit confirmed 14-week lead on VRF equipment. Hilton approval required before they can issue PO. Need to send approval request to brand team asap.' },
                { initials:'UP', author:'Uma Patel', time:'Apr 10, 2:00 PM', text:'Updated scope leveling matrix. ABC Concrete gap on sleeves is $28K — needs resolution before we issue LOI. Confirmed with Jay to proceed.' },
              ].map((n, i) => (
                <div key={i} className="dp-note-item">
                  <div className="dp-note-avatar">{n.initials}</div>
                  <div className="dp-note-body">
                    <div className="dp-note-top">
                      <span className="dp-note-author">{n.author}</span>
                      <span className="dp-note-time">{n.time}</span>
                    </div>
                    <div className="dp-note-text">{n.text}</div>
                  </div>
                </div>
              ))}
              <div className="dp-add-note">
                <textarea className="dp-note-input" placeholder="Add a note or update…" id={`noteInput-${pkg.id}`}></textarea>
                <button className="dp-note-submit" onClick={() => { alert('Note posted. (In production, this would save to the backend.)'); }}>Post Note</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ACTION BAR */}
      <div className="status-action-bar" id="statusActionBar">
        {pkg.status === 'Ready to Award' ? (
          <>
            <button className="status-action-btn green" onClick={() => onStatusChange(pkg.id, 'Awarded')}>★ Authorize Award</button>
            <button className="status-action-btn" onClick={() => onStatusChange(pkg.id, 'Negotiating')}>Negotiate</button>
            <button className="status-action-btn" onClick={() => onStatusChange(pkg.id, 'On Hold')}>Put on Hold</button>
          </>
        ) : ['Reviewing Bids', 'Scope Leveling'].includes(pkg.status) ? (
          <>
            <button className="status-action-btn primary" onClick={() => onStatusChange(pkg.id, 'Ready to Award')}>→ Mark Ready to Award</button>
            <button className="status-action-btn" onClick={() => onStatusChange(pkg.id, 'Negotiating')}>→ Negotiating</button>
          </>
        ) : pkg.status === 'Bidding' ? (
          <button className="status-action-btn primary" onClick={() => onStatusChange(pkg.id, 'Reviewing Bids')}>→ Reviewing Bids</button>
        ) : ['Negotiating', 'Pending Decision'].includes(pkg.status) ? (
          <>
            <button className="status-action-btn primary" onClick={() => onStatusChange(pkg.id, 'Ready to Award')}>→ Ready to Award</button>
            <button className="status-action-btn" onClick={() => onStatusChange(pkg.id, 'On Hold')}>Hold</button>
          </>
        ) : pkg.status === 'Awarded' ? (
          <button className="status-action-btn primary" onClick={() => onStatusChange(pkg.id, 'Contract Out')}>→ Contract Out</button>
        ) : pkg.status === 'Contract Out' ? (
          <button className="status-action-btn green" onClick={() => onStatusChange(pkg.id, 'Executed')}>✓ Mark Executed</button>
        ) : pkg.status === 'Overdue' || overdue ? (
          <>
            <button className="status-action-btn" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>! Mark Urgent</button>
            <button className="status-action-btn primary" onClick={() => onStatusChange(pkg.id, 'Reviewing Bids')}>→ Reviewing Bids</button>
          </>
        ) : (
          <>
            <button className="status-action-btn">↑ Flag Urgent</button>
            <button className="status-action-btn" onClick={() => onStatusChange(pkg.id, 'Bidding')}>→ Bidding</button>
          </>
        )}
      </div>

    </div>
  );
}
