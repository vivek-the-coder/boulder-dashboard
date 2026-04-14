"use client";

import React from "react";
import { Package } from "@/types";
import { cn } from "@/lib/utils";
import { BIDS_DB } from "@/data/db";

interface PackageTableProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  onDropboxClick?: (pkg: Package) => void;
}

const STATUS_CLASS: Record<string, string> = {
  "Not Started": "s-not-started",
  Bidding: "s-bidding",
  "Reviewing Bids": "s-reviewing",
  "Scope Leveling": "s-leveling",
  Negotiating: "s-negotiating",
  "Pending Decision": "s-pending",
  "Ready to Award": "s-ready",
  Awarded: "s-awarded",
  "Contract Out": "s-contract",
  Executed: "s-executed",
  "On Hold": "s-hold",
  Overdue: "s-overdue",
};

const TODAY = new Date("2025-04-15");
function daysFromTodayLocal(dateStr: string) {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / 86400000);
}

function fmtDate(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear().toString().slice(2)}`;
}

export function PackageTable({
  packages,
  selectedPackage,
  onSelectPackage,
  onDropboxClick,
}: PackageTableProps) {
  if (packages.length === 0) {
    return (
      <div className="buyout-list-wrap">
        <div className="buyout-table-container">
          <div id="emptyState" className="empty-state">
            <div className="icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="7" y="6" width="22" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M13 6V8C13 9.1 13.9 10 15 10H21C22.1 10 23 9.1 23 8V6" stroke="currentColor" strokeWidth="2" />
                <path d="M12 18H24M12 23H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p>No packages match the current filters</p>
            <small>Try adjusting your filters or view</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buyout-list-wrap">
      <div className="buyout-table-container">
        <table id="buyoutTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Trade</th>
          <th>Bids</th>
          <th>Buyout Status</th>
          <th>Dropbox Folder</th>
          <th>Warranties</th>
          <th>Vendor Data</th>
        </tr>
      </thead>
      <tbody id="buyoutTbody">
        {packages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          const days = daysFromTodayLocal(pkg.dueDate);
          const isOverdue = pkg.overdue || days < 0;
          const bids = BIDS_DB[pkg.id] || [];

          return (
            <tr
              key={pkg.id}
              data-id={pkg.id}
              className={cn(
                isSelected && "selected",
                isOverdue && "overdue-row"
              )}
              onClick={() => onSelectPackage(pkg)}
            >
              {/* # */}
              <td>
                <span className="order-num">{pkg.order}</span>
              </td>

              {/* Name */}
              <td>
                <div className="pkg-name">
                  {pkg.longLead && <span className="pkg-longalert">LL</span>}
                  <span>{pkg.name}</span>
                </div>
                <div className="pkg-csi">
                  {pkg.csi} · {pkg.pm}
                </div>
              </td>

              {/* Trade */}
              <td>
                <span className="trade-pill">{pkg.trade}</span>
              </td>

              {/* Bids */}
              <td>
                {bids.length > 0 ? (
                  <div className="bids-cell">
                    <span className="bids-count">{bids.length}</span>
                    <div className="bid-pills">
                      {bids.map((b, i) => (
                        <span key={i} className={`bid-vendor-pill ${b.status}`}>
                          {b.vendor}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="no-bids-tag">No bids</span>
                )}
              </td>

              {/* Buyout Status */}
              <td>
                <span
                  className={`status-badge ${STATUS_CLASS[pkg.status] || "s-not-started"}`}
                >
                  {pkg.status}
                </span>
              </td>

              {/* Dropbox Folder */}
              <td>
                {pkg.dropboxFolder ? (
                  <a
                    className="dropbox-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDropboxClick?.(pkg);
                    }}
                    title={pkg.dropboxFolder}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 2L6 4.5L9 2L12 4L9 6L12 8L9 10L6 7.5L3 10L0 8L3 6L0 4L3 2Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="truncate" style={{ maxWidth: 90 }}>
                      {pkg.dropboxFolder}
                    </span>
                  </a>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>—</span>
                )}
              </td>

              {/* Warranties */}
              <td>
                {pkg.warranties ? (
                  <span className="warranty-tag">{pkg.warranties}</span>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>—</span>
                )}
              </td>

              {/* Vendor Data */}
              <td>
                {pkg.vendorData ? (
                  <span
                    className="vendor-data-cell truncate"
                    title={pkg.vendorData}
                  >
                    {pkg.vendorData}
                  </span>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
      </div>
    </div>
  );
}
