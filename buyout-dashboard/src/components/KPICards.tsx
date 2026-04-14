"use client";

import React from "react";
import { Package } from "@/types";
import { cn } from "@/lib/utils";
import { BIDS_DB, daysFromToday } from "@/data/db";

interface KPICardsProps {
  packages: Package[];
  activeKPI: string | null;
  setActiveKPI: (kpi: string | null) => void;
}

export function KPICards({ packages, activeKPI, setActiveKPI }: KPICardsProps) {
  const all = packages;

  const totalBids = packages.reduce(
    (sum, p) => sum + (BIDS_DB[p.id] || []).length,
    0
  );
  const withVendor = all.filter((p) => p.vendorData && p.vendorData.length > 0).length;
  const missingCov = all.filter((p) => p.coverageCount < 2).length;
  const highRisk = all.filter((p) => p.risk === "High").length;
  const overdue = all.filter((p) => p.overdue || daysFromToday(p.dueDate) < 0).length;
  const thisWeek = all.filter((p) => {
    const d = daysFromToday(p.dueDate);
    return d >= 0 && d <= 7;
  }).length;
  const ready = all.filter((p) => p.status === "Ready to Award").length;
  const awarded = all.filter((p) =>
    ["Awarded", "Contract Out", "Executed"].includes(p.status)
  ).length;

  const kpis = [
    {
      id: "all",
      label: "Total Packages",
      val: all.length,
      sub: "across all projects",
      color: "navy",
      view: "all",
    },
    {
      id: "overdue",
      label: "Overdue",
      val: overdue,
      sub: "require immediate action",
      color: "red",
      view: "overdue",
    },
    {
      id: "this-week",
      label: "Due This Week",
      val: thisWeek,
      sub: "target award dates",
      color: "amber",
      view: "this-week",
    },
    {
      id: "ready-award",
      label: "Ready to Award",
      val: ready,
      sub: "awaiting authorization",
      color: "green",
      view: "ready-award",
    },
    {
      id: "awarded",
      label: "Awarded / Done",
      val: awarded,
      sub: "packages complete",
      color: "green",
      view: "awarded",
    },
    {
      id: "total-bids",
      label: "Total Bids",
      val: totalBids,
      sub: "across all packages",
      color: "blue",
      view: "all",
    },
    {
      id: "with-vendor",
      label: "With Vendor Data",
      val: withVendor,
      sub: "vendor assigned",
      color: "teal",
      view: "all",
    },
    {
      id: "missing-coverage",
      label: "Missing Coverage",
      val: missingCov,
      sub: "< 2 bids received",
      color: "purple",
      view: "missing-coverage",
    },
    {
      id: "high-risk",
      label: "High Risk",
      val: highRisk,
      sub: "need attention",
      color: "red",
      view: "high-risk",
    },
  ];

  return (
    <div className="kpi-row" id="kpiRow">
      {kpis.map((k) => (
        <div
          key={k.id}
          className={cn(
            "kpi-card",
            k.color,
            activeKPI === k.id && "active"
          )}
          onClick={() => setActiveKPI(activeKPI === k.id ? null : k.id)}
        >
          <div className="kpi-label">{k.label}</div>
          <div className="kpi-value">{k.val}</div>
          <div className="kpi-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
