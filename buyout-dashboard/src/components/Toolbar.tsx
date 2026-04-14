"use client";

import React from "react";
import { ViewType } from "@/types";

interface ToolbarProps {
  currentView: ViewType;
  filteredCount: number;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterPriority: string;
  setFilterPriority: (v: string) => void;
  filterPM: string;
  setFilterPM: (v: string) => void;
  filterRisk: string;
  setFilterRisk: (v: string) => void;
  onResetFilters: () => void;
}

const viewTitles: Record<ViewType, string> = {
  all: "All Buyouts",
  urgent: "Urgent / Focus",
  overdue: "Overdue",
  "this-week": "Due This Week",
  upcoming: "Upcoming",
  "ready-award": "Ready to Award",
  awarded: "Awarded",
  executed: "Executed",
  bidding: "Bidding",
  "on-hold": "On Hold",
  "long-lead": "Long Lead",
  "missing-coverage": "Missing Bid Coverage",
  "high-risk": "High Risk",
  "contract-pending": "Contract Pending",
  "by-project": "By Project",
  "by-pm": "By PM",
  "by-trade": "By Trade",
};

export function Toolbar({
  currentView,
  filteredCount,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterPM,
  setFilterPM,
  filterRisk,
  setFilterRisk,
  onResetFilters,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <span className="toolbar-title" id="viewTitle">
        {viewTitles[currentView]}
      </span>
      <span className="toolbar-count" id="rowCount">
        {filteredCount} package{filteredCount !== 1 ? "s" : ""}
      </span>
      <div className="toolbar-spacer" />
      <div className="filter-bar">
        <select
          className="filter-select"
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option>Not Started</option>
          <option>Bidding</option>
          <option>Reviewing Bids</option>
          <option>Scope Leveling</option>
          <option>Negotiating</option>
          <option>Pending Decision</option>
          <option>Ready to Award</option>
          <option>Awarded</option>
          <option>Contract Out</option>
          <option>Executed</option>
          <option>On Hold</option>
          <option>Overdue</option>
        </select>

        <select
          className="filter-select"
          id="filterPriority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          className="filter-select"
          id="filterPM"
          value={filterPM}
          onChange={(e) => setFilterPM(e.target.value)}
        >
          <option value="">All PMs</option>
          <option>Jay Patel</option>
          <option>Rush Patel</option>
          <option>Uma Patel</option>
          <option>Mike Torres</option>
        </select>

        <select
          className="filter-select"
          id="filterRisk"
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
        >
          <option value="">All Risk</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button className="sort-btn">
          Sort ↕ <span id="sortLabel">Due Date</span>
        </button>

        <button className="btn-icon" title="Reset filters" onClick={onResetFilters}>
          ✕
        </button>
      </div>
    </div>
  );
}
