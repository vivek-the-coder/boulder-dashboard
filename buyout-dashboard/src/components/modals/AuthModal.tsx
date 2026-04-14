"use client";

import React, { useState } from "react";
import { User } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
  existingUsers: User[];
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, existingUsers }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleLogin = () => {
    setError("");
    const user = existingUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
      resetForm();
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleSignup = () => {
    setError("");
    
    if (!name || !email || !role || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@boulderconstruction.com")) {
      setError("Only @boulderconstruction.com email addresses are allowed.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (existingUsers.some((u) => u.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser: User = {
      name,
      email,
      role,
      password,
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    
    onSignup(newUser);
    setSuccess("✓ Account created! You can now sign in.");
    setTimeout(() => {
      setMode("login");
      setSuccess("");
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay open" id="authOverlay">
      <div className="auth-box">
        <div className="auth-brand">
          <div className="auth-logo-mark">BC</div>
          <div className="auth-brand-name">Boulder Construction</div>
          <div className="auth-brand-sub">Buyout Command Center</div>
        </div>

        <div className="auth-body">
          {mode === "login" ? (
            <div id="authLoginPanel">
              <div className="auth-title">Welcome back</div>
              <div className="auth-subtitle">Sign in to your account to continue</div>
              <div className="auth-domain-badge">
                🏢 Access restricted to <strong>@boulderconstruction.com</strong> email addresses only.
              </div>
              
              {error && <div className="auth-error show">{error}</div>}

              <div className="auth-field">
                <label>Email Address</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="you@boulderconstruction.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <button className="auth-btn" onClick={handleLogin}>
                Sign In →
              </button>

              <div className="auth-switch">
                Don't have an account?{" "}
                <a onClick={() => { resetForm(); setMode("signup"); }}>Create one</a>
              </div>
            </div>
          ) : (
            <div id="authSignupPanel">
              <div className="auth-title">Create account</div>
              <div className="auth-subtitle">Join the Boulder Construction team</div>
              <div className="auth-domain-badge">
                🏢 Only <strong>@boulderconstruction.com</strong> email addresses are accepted.
              </div>

              {error && <div className="auth-error show">{error}</div>}
              {success && <div className="auth-success show">{success}</div>}

              <div className="auth-field">
                <label>Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="e.g. Jay Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Email Address</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="you@boulderconstruction.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Role / Title</label>
                <select
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">— Select your role —</option>
                  <option>Project Manager</option>
                  <option>Estimator</option>
                  <option>Operations</option>
                  <option>Procurement</option>
                  <option>Executive</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
              </div>

              <button className="auth-btn" onClick={handleSignup}>
                Create Account →
              </button>

              <div className="auth-switch">
                Already have an account?{" "}
                <a onClick={() => { resetForm(); setMode("login"); }}>Sign in</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
