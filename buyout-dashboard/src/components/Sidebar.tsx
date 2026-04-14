"use client";

import React from "react";
import { Package } from "@/types";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  packages: Package[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ currentView, setCurrentView, packages, isOpen, setIsOpen }: SidebarProps) {
  // Compute badges dynamically where needed
  const urgentCount = packages.filter((p) => p.urgent || p.priority === "Critical").length;
  const overdueCount = packages.filter((p) => p.overdue || new Date(p.dueDate) < new Date()).length;
  const readyAwardCount = packages.filter((p) => p.status === "Ready to Award").length;

  const NavItem = ({ id, label, iconSvg, badge, badgeAmber }: { id: string; label: string; iconSvg: React.ReactNode; badge?: number; badgeAmber?: boolean }) => {
    return (
      <div 
        className={`nav-item ${currentView === id ? "active" : ""}`}
        onClick={() => setCurrentView(id)}
      >
        <span className="nav-icon">{iconSvg}</span> {label}
        {badge ? (
          <span className={`nav-badge ${badgeAmber ? "amber" : ""}`}>{badge}</span>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <div className="nav-section">
          <div className="nav-section-label">Dashboard</div>
          <NavItem 
            id="all" 
            label="All Buyouts" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/><rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/><rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/><rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/></svg>} 
          />
          <NavItem 
            id="urgent" 
            label="Urgent / Focus" 
            badge={urgentCount}
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 12H1L7 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 5.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="currentColor"/></svg>} 
          />
          <NavItem 
            id="overdue" 
            label="Overdue" 
            badge={overdueCount}
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4V7.5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="this-week" 
            label="Due This Week" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 6H12.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 1V3.5M9.5 1V3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="upcoming" 
            label="Upcoming" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L7 2L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M4 9H10" stroke="currentColor" strokeWidth="1.4"/></svg>} 
          />
        </div>
        
        <div className="nav-divider"></div>
        <div className="nav-section">
          <div className="nav-section-label">By Status</div>
          <NavItem 
            id="ready-award" 
            label="Ready to Award"
            badge={readyAwardCount}
            badgeAmber={true}
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>} 
          />
          <NavItem 
            id="awarded" 
            label="Awarded" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>} 
          />
          <NavItem 
            id="executed" 
            label="Executed" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2H9L11 4V12H3V2Z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 2V4H11" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7H9M5 9H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="bidding" 
            label="Bidding" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5 7L7 9L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4H11V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="on-hold" 
            label="On Hold" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3.5" y="2" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.7"/><rect x="8" y="2" width="2.5" height="10" rx="1" fill="currentColor" opacity="0.7"/></svg>} 
          />
        </div>

        <div className="nav-divider"></div>
        <div className="nav-section">
          <div className="nav-section-label">Analysis</div>
          <NavItem 
            id="long-lead" 
            label="Long Lead" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 3V7L9.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="missing-coverage" 
            label="Missing Coverage" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 12H1L7 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 5.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="currentColor"/></svg>} 
          />
          <NavItem 
            id="high-risk" 
            label="High Risk" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2C7 2 3 5 3 8.5C3 10.4 4.8 12 7 12C9.2 12 11 10.4 11 8.5C11 5 7 2 7 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>} 
          />
          <NavItem 
            id="contract-pending" 
            label="Contract Pending" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2H9L11 4V12H3V2Z" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7H9M5 9H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9 2V4H11" stroke="currentColor" strokeWidth="1.4"/></svg>} 
          />
        </div>

        <div className="nav-divider"></div>
        <div className="nav-section">
          <div className="nav-section-label">Group By</div>
          <NavItem 
            id="by-project" 
            label="By Project" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="7" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="5.5" y="4" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="1" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>} 
          />
          <NavItem 
            id="by-pm" 
            label="By PM" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 12C2 9.8 4.2 8 7 8C9.8 8 12 9.8 12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>} 
          />
          <NavItem 
            id="by-trade" 
            label="By Trade" 
            iconSvg={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 1.5V4M7 10V12.5M1.5 7H4M10 7H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} 
          />
        </div>
      </div>
      <div 
        className={`sidebar-overlay ${!isOpen ? "hidden" : ""}`} 
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
}
