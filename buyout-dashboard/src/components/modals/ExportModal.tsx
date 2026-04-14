"use client";

import React, { useState } from "react";
import { Package } from "@/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  filteredPackages: Package[];
}

const EXP_COLUMNS = [
  { key: "name", label: "Package Name", default: true },
  { key: "csi", label: "CSI Division", default: true },
  { key: "project", label: "Project", default: true },
  { key: "trade", label: "Trade", default: true },
  { key: "pm", label: "PM", default: true },
  { key: "status", label: "Status", default: true },
  { key: "priority", label: "Priority", default: true },
  { key: "dueDate", label: "Target Award Date", default: true },
  { key: "onSiteDate", label: "On Site Date", default: false },
  { key: "budget", label: "Budget ($)", default: true },
  { key: "lowBid", label: "Low Bid ($)", default: true },
  { key: "awardAmount", label: "Award Amount ($)", default: true },
  { key: "selectedVendor", label: "Recommended Vendor", default: true },
  { key: "coverageCount", label: "Bid Coverage", default: true },
  { key: "bidsReceived", label: "Bids Received", default: false },
  { key: "risk", label: "Risk Level", default: true },
  { key: "contractStatus", label: "Contract Status", default: true },
  { key: "longLead", label: "Long Lead", default: false },
  { key: "urgent", label: "Urgent Flag", default: false },
  { key: "notes", label: "Notes", default: false },
];

export function ExportModal({ isOpen, onClose, packages, filteredPackages }: ExportModalProps) {
  const [expFormat, setExpFormat] = useState<"csv" | "json">("csv");
  const [expScope, setExpScope] = useState<"current" | "all">("current");
  const [colChecked, setColChecked] = useState<Record<string, boolean>>(
    EXP_COLUMNS.reduce((acc, c) => ({ ...acc, [c.key]: c.default }), {})
  );

  const toggleCol = (key: string) => {
    setColChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    // In a real app this would trigger the actual file generation/download
    console.log("Exporting...", { expFormat, expScope, colChecked });
    onClose();
  };

  const selectedCount = expScope === "current" ? filteredPackages.length : packages.length;
  const isFiltered = packages.length !== filteredPackages.length;

  if (!isOpen) return null;

  return (
    <div
      className={`exp-overlay ${isOpen ? "open" : ""}`}
      id="expOverlay"
      onClick={(e) => {
        if ((e.target as any).id === "expOverlay") onClose();
      }}
    >
      <div className="exp-box">
        <div className="exp-head">
          <div>
            <div className="exp-head-title">↓ Export Buyout Data</div>
            <div className="exp-head-sub">Choose format and what to include</div>
          </div>
          <button className="exp-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="exp-body">
          {/* Format */}
          <div className="exp-section-title">Export Format</div>
          <div className="exp-format-grid">
            <div
              className={`exp-format-card ${expFormat === "csv" ? "selected" : ""}`}
              onClick={() => setExpFormat("csv")}
            >
              <div className="exp-format-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M8 13h2M8 17h2M14 13h2M14 17h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="exp-format-name">CSV</div>
                <div className="exp-format-desc">Opens in Excel, Sheets, or any spreadsheet app</div>
              </div>
            </div>
            <div
              className={`exp-format-card ${expFormat === "json" ? "selected" : ""}`}
              onClick={() => setExpFormat("json")}
            >
              <div className="exp-format-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M10 9l-3 3 3 3M14 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="exp-format-name">JSON</div>
                <div className="exp-format-desc">Full structured data for integrations or backup</div>
              </div>
            </div>
          </div>

          {/* Columns to include */}
          <div className="exp-section-title">Columns to Include</div>
          <div className="exp-scope-grid" id="expColGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {EXP_COLUMNS.map((c) => (
              <label
                key={c.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={colChecked[c.key]}
                  onChange={() => toggleCol(c.key)}
                  style={{ accentColor: "var(--amber)" }}
                />
                {c.label}
              </label>
            ))}
          </div>

          {/* Scope */}
          <div className="exp-section-title">Packages to Export</div>
          <div className="exp-check-list">
            <div
              className={`exp-check-item ${expScope === "current" ? "checked" : ""}`}
              onClick={() => setExpScope("current")}
            >
              <div className="exp-check-box">✓</div>
              <div className="exp-check-label">Current View</div>
              <div className="exp-check-sub" id="exp-scope-current-sub">
                {filteredPackages.length} packages
              </div>
            </div>
            <div
              className={`exp-check-item ${expScope === "all" ? "checked" : ""}`}
              onClick={() => setExpScope("all")}
            >
              <div className="exp-check-box">✓</div>
              <div className="exp-check-label">All Packages</div>
              <div className="exp-check-sub" id="exp-scope-all-sub">
                {packages.length} packages total
              </div>
            </div>
          </div>

          {/* Active filter note */}
          {expScope === "current" && isFiltered && (
            <div
              className="exp-filter-note"
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "rgba(232, 130, 12, 0.1)",
                border: "1px solid rgba(232, 130, 12, 0.2)",
                borderRadius: "var(--radius)",
                fontSize: "11px",
                color: "#b5600a",
                display: "block",
              }}
            >
              Note: You have active filters. Export will be limited to these {filteredPackages.length} packages.
            </div>
          )}
        </div>

        <div className="exp-footer">
          <span className="exp-count-badge" id="expCountBadge" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {selectedCount} rows
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="exp-btn secondary" onClick={onClose} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font)' }}>
              Cancel
            </button>
            <button className="exp-btn primary" onClick={handleExport} style={{ padding: '8px 14px', border: 'none', borderRadius: 'var(--radius)', background: 'var(--amber)', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
              ↓ Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
