"use client";

import React, { useState } from "react";
import { User } from "@/types";

interface HeaderProps {
  currentUser: User | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNewPackage: () => void;
  onExport: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

export function Header({
  currentUser,
  searchQuery,
  setSearchQuery,
  onNewPackage,
  onExport,
  onOpenProfile,
  onSignOut,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="header-logo">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="logo-mark">BC</div>
        <div>
          <div className="logo-text">Boulder Construction</div>
          <div className="logo-sub">Buyout Command Center</div>
        </div>
      </div>

      <div className="header-center">
        <div className="project-select-wrap">
          <select className="project-select" defaultValue="all">
            <option value="all">All Projects</option>
            <option value="Kimpton Plano">Kimpton Plano — 160-Key Hotel</option>
            <option value="Guestroom Tower">Guestroom Tower</option>
            <option value="Podium Lobby">Podium / Lobby / BOH</option>
          </select>
        </div>
        <div className="header-search">
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <path d="M9.5 9.5L12.5 12.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search packages, vendors, trades…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={onNewPackage}>
          + New Package
        </button>
        <button className="header-btn primary" onClick={onExport}>
          ↓ Export
        </button>

        <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
          {currentUser ? getInitials(currentUser.name) : "??"}
        </div>

        <div
          className={`avatar-menu ${!menuOpen ? "hidden" : ""}`}
          id="avatarMenu"
          onClick={(e) => e.stopPropagation()}
        >
          {currentUser ? (
            <>
              <div className="avatar-menu-header">
                <div className="avatar-menu-avatar">
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <div className="avatar-menu-name">
                    {currentUser.name}
                  </div>
                  <div className="avatar-menu-role">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="avatar-menu-divider"></div>
              <div
                className="avatar-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenProfile();
                }}
              >
                👤 My Profile
              </div>
              <div className="avatar-menu-item">🔒 Change Password</div>
              <div className="avatar-menu-divider"></div>
              <div
                className="avatar-menu-item signout"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut();
                }}
              >
                ↩ Sign Out
              </div>
            </>
          ) : (
            <div
              className="avatar-menu-item"
              onClick={() => {
                setMenuOpen(false);
                onSignOut(); // actually this opens the login modal in page.tsx
              }}
            >
              Sign In
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
