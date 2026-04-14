"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Package, User, ViewType } from "@/types";
import { PACKAGES, SAMPLE_USERS, daysFromToday, BIDS_DB } from "@/data/db";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { KPICards } from "@/components/KPICards";
import { Toolbar } from "@/components/Toolbar";
import { PackageTable } from "@/components/PackageTable";
import { DetailPanel } from "@/components/DetailPanel";
import { NewPackageModal } from "@/components/modals/NewPackageModal";
import { ExportModal } from "@/components/modals/ExportModal";
import { AuthModal } from "@/components/modals/AuthModal";

export default function BuyoutDashboard() {
  // State
  const [packages, setPackages] = useState<Package[]>(PACKAGES);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterPM, setFilterPM] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKPI, setActiveKPI] = useState<string | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [newPackageModalOpen, setNewPackageModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("bc_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setAuthModalOpen(true);
      }
    }
  }, []);

  // Filter packages
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    // Apply view filter
    switch (currentView) {
      case "urgent":
        result = result.filter((p) => p.urgent || p.priority === "Critical");
        break;
      case "overdue":
        result = result.filter((p) => p.overdue || daysFromToday(p.dueDate) < 0);
        break;
      case "this-week":
        result = result.filter((p) => {
          const days = daysFromToday(p.dueDate);
          return days >= 0 && days <= 7;
        });
        break;
      case "upcoming":
        result = result.filter((p) => daysFromToday(p.dueDate) > 7);
        break;
      case "ready-award":
        result = result.filter((p) => p.status === "Ready to Award");
        break;
      case "awarded":
        result = result.filter((p) => p.status === "Awarded");
        break;
      case "executed":
        result = result.filter((p) => p.status === "Executed");
        break;
      case "bidding":
        result = result.filter((p) => p.status === "Bidding");
        break;
      case "on-hold":
        result = result.filter((p) => p.status === "On Hold");
        break;
      case "long-lead":
        result = result.filter((p) => p.longLead);
        break;
      case "missing-coverage":
        result = result.filter((p) => p.coverageCount < 2);
        break;
      case "high-risk":
        result = result.filter((p) => p.risk === "High");
        break;
    }

    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.trade.toLowerCase().includes(query) ||
          p.pm.toLowerCase().includes(query)
      );
    }
    if (filterStatus) result = result.filter((p) => p.status === filterStatus);
    if (filterPriority) result = result.filter((p) => p.priority === filterPriority);
    if (filterPM) result = result.filter((p) => p.pm === filterPM);
    if (filterRisk) result = result.filter((p) => p.risk === filterRisk);

    // Apply KPI filter
    if (activeKPI) {
      switch (activeKPI) {
        case "urgent":
          result = result.filter((p) => p.urgent || p.priority === "Critical");
          break;
        case "overdue":
          result = result.filter((p) => p.overdue);
          break;
        case "ready":
          result = result.filter((p) => p.status === "Ready to Award");
          break;
        case "awarded":
          result = result.filter((p) => p.status === "Awarded");
          break;
        case "bidding":
          result = result.filter((p) => p.status === "Bidding");
          break;
        case "risk":
          result = result.filter((p) => p.risk === "High");
          break;
      }
    }

    return result;
  }, [packages, currentView, searchQuery, filterStatus, filterPriority, filterPM, filterRisk, activeKPI]);

  // Badge counts
  const badgeCounts = useMemo(() => ({
    urgent: packages.filter((p) => p.urgent || p.priority === "Critical").length,
    overdue: packages.filter((p) => p.overdue || daysFromToday(p.dueDate) < 0).length,
    ready: packages.filter((p) => p.status === "Ready to Award").length,
  }), [packages]);

  // Handlers
  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleCloseDetail = () => {
    setSelectedPackage(null);
  };

  const handleStatusChange = (pkgId: number, newStatus: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === pkgId) {
          let contractStatus = p.contractStatus;
          if (newStatus === "Awarded") contractStatus = "Verbal Award";
          if (newStatus === "Contract Out") contractStatus = "Draft";
          if (newStatus === "Executed") contractStatus = "Executed";
          return { ...p, status: newStatus, contractStatus };
        }
        return p;
      })
    );
    if (selectedPackage?.id === pkgId) {
      setSelectedPackage((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              contractStatus:
                newStatus === "Awarded"
                  ? "Verbal Award"
                  : newStatus === "Contract Out"
                  ? "Draft"
                  : newStatus === "Executed"
                  ? "Executed"
                  : prev.contractStatus,
            }
          : null
      );
    }
  };

  const handleCreatePackage = (newPkg: Omit<Package, "id" | "order">) => {
    const id = Math.max(...packages.map((p) => p.id), 0) + 1;
    const pkg: Package = { ...newPkg, id, order: id };
    setPackages((prev) => [...prev, pkg]);
    BIDS_DB[id] = [];
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bc_user", JSON.stringify(user));
    }
    setAuthModalOpen(false);
  };

  const handleSignup = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("bc_user");
    }
    setAuthModalOpen(true);
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterPriority("");
    setFilterPM("");
    setFilterRisk("");
    setSearchQuery("");
    setActiveKPI(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewPackage={() => setNewPackageModalOpen(true)}
        onExport={() => setExportModalOpen(true)}
        onOpenProfile={() => {}}
        onSignOut={handleSignOut}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="app-body">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          packages={packages}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="main-area">
          <KPICards
            packages={packages}
            activeKPI={activeKPI}
            setActiveKPI={setActiveKPI}
          />

          <Toolbar
            currentView={currentView}
            filteredCount={filteredPackages.length}
            totalCount={packages.length}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterPM={filterPM}
            setFilterPM={setFilterPM}
            filterRisk={filterRisk}
            setFilterRisk={setFilterRisk}
            onResetFilters={resetFilters}
          />

          <div className="content-area">
            <PackageTable
              packages={filteredPackages}
              selectedPackage={selectedPackage}
              onSelectPackage={handleSelectPackage}
            />

            {selectedPackage && (
              <DetailPanel
                pkg={selectedPackage}
                onClose={handleCloseDetail}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {}}
        onLogin={handleLogin}
        onSignup={handleSignup}
        existingUsers={users}
      />

      <NewPackageModal
        isOpen={newPackageModalOpen}
        onClose={() => setNewPackageModalOpen(false)}
        onCreate={handleCreatePackage}
        nextId={Math.max(...packages.map((p) => p.id), 0) + 1}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        packages={packages}
        filteredPackages={filteredPackages}
      />
    </div>
  );
}
