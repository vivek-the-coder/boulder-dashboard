"use client";

import React, { useState } from "react";
import { Package } from "@/types";

interface NewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (pkg: Omit<Package, "id" | "order">) => void;
  nextId: number;
}

export function NewPackageModal({ isOpen, onClose, onCreate, nextId }: NewPackageModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", csi: "", trade: "", project: "", pm: "",
    priority: "", risk: "Medium", budget: "", dueDate: "",
    onSiteDate: "", status: "Not Started", longLead: false,
    urgent: false, notes: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const resetAndClose = () => {
    setStep(1);
    setFormData({
      name: "", csi: "", trade: "", project: "", pm: "",
      priority: "", risk: "Medium", budget: "", dueDate: "",
      onSiteDate: "", status: "Not Started", longLead: false,
      urgent: false, notes: "",
    });
    setErrors({});
    onClose();
  };

  const handleNext = () => {
    const newErrors: Record<string, boolean> = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = true;
      if (!formData.csi) newErrors.csi = true;
      if (!formData.trade) newErrors.trade = true;
      if (!formData.project) newErrors.project = true;
      if (!formData.pm) newErrors.pm = true;
      if (!formData.priority) newErrors.priority = true;
    } else if (step === 2) {
      if (!formData.budget) newErrors.budget = true;
      if (!formData.dueDate) newErrors.dueDate = true;
      if (!formData.status) newErrors.status = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const handleCreate = () => {
    onCreate({
      name: formData.name,
      csi: formData.csi,
      trade: formData.trade,
      project: formData.project,
      pm: formData.pm,
      priority: formData.priority as any,
      risk: formData.risk as any,
      budget: Number(formData.budget) || 0,
      dueDate: formData.dueDate,
      onSiteDate: formData.onSiteDate || null,
      status: formData.status,
      longLead: formData.longLead,
      urgent: formData.urgent,
      overdue: false,
      notes: formData.notes,
      lowBid: null,
      selectedVendor: null,
      awardAmount: null,
      bidsReceived: 0,
      coverageCount: 0,
      contractStatus: "Not Started",
      dropboxFolder: "",
      warranties: "",
      vendorData: "",
      risks: [],
      contractSteps: ["Verbal Award", "Scope Confirm", "Draft Contract", "Sub Review", "Executed"],
      contractProgress: 0,
    });
    setStep(4); // Success screen
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="newPkgOverlay" onClick={(e) => {
      // simulate outside click
      if ((e.target as any).id === "newPkgOverlay") resetAndClose();
    }}>
      <div className="modal-box" id="newPkgBox">

        {step !== 4 && (
          <div className="modal-head">
            <div>
              <div className="modal-head-title">New Buyout Package</div>
              <div className="modal-head-sub">Add a new trade package to the buyout log</div>
            </div>
            <button className="modal-close-btn" onClick={resetAndClose}>✕</button>
          </div>
        )}

        {step !== 4 && (
          <div className="modal-step-bar" id="npStepBar">
            <div className={`modal-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`} id="np-step-ind-1">
              <div className="modal-step-num">{step > 1 ? '✓' : '1'}</div> Package Info
            </div>
            <div className="modal-step-connector"></div>
            <div className={`modal-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`} id="np-step-ind-2">
              <div className="modal-step-num">{step > 2 ? '✓' : '2'}</div> Schedule & Budget
            </div>
            <div className="modal-step-connector"></div>
            <div className={`modal-step ${step === 3 ? 'active' : ''}`} id="np-step-ind-3">
              <div className="modal-step-num">3</div> Review & Create
            </div>
          </div>
        )}

        <div className="modal-body" id="npModalBody">

          {/* STEP 1 */}
          <div className={`modal-step-panel ${step === 1 ? 'active' : ''}`} id="np-panel-1">
            <div className="modal-section-title">Package Identity</div>
            <div className="modal-form-grid">
              <div className={`modal-field ${errors.name ? 'has-error' : ''}`} id="npf-name" style={{ gridColumn: '1/-1' }}>
                <label>Package Name <span className="req">*</span></label>
                <input className={`modal-input ${errors.name ? 'error' : ''}`} id="np-name" type="text" placeholder="e.g. Mechanical / HVAC" autoComplete="off" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <div className="modal-error-msg">Package name is required.</div>
              </div>
              <div className={`modal-field ${errors.csi ? 'has-error' : ''}`} id="npf-csi">
                <label>CSI Division <span className="req">*</span></label>
                <input className={`modal-input ${errors.csi ? 'error' : ''}`} id="np-csi" type="text" placeholder="e.g. 23 00 00" value={formData.csi} onChange={(e) => setFormData({...formData, csi: e.target.value})} />
                <div className="modal-error-msg">CSI division is required.</div>
              </div>
              <div className={`modal-field ${errors.trade ? 'has-error' : ''}`} id="npf-trade">
                <label>Trade <span className="req">*</span></label>
                <select className={`modal-select ${errors.trade ? 'error' : ''}`} id="np-trade" value={formData.trade} onChange={(e) => setFormData({...formData, trade: e.target.value})}>
                  <option value="">— Select trade —</option>
                  <option>Concrete</option>
                  <option>Mechanical</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Glazing</option>
                  <option>Roofing</option>
                  <option>Drywall</option>
                  <option>Paint</option>
                  <option>Flooring</option>
                  <option>Millwork</option>
                  <option>Elevators</option>
                  <option>Fire Protection</option>
                  <option>Fire Alarm</option>
                  <option>Technology</option>
                  <option>Steel</option>
                  <option>Other</option>
                </select>
                <div className="modal-error-msg">Please select a trade.</div>
              </div>
            </div>

            <div className="modal-section-title">Assignment</div>
            <div className="modal-form-grid">
              <div className={`modal-field ${errors.project ? 'has-error' : ''}`} id="npf-project">
                <label>Project <span className="req">*</span></label>
                <select className={`modal-select ${errors.project ? 'error' : ''}`} id="np-project" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}>
                  <option value="">— Select project —</option>
                  <option>Kimpton Plano</option>
                  <option>Guestroom Tower</option>
                  <option>Podium Lobby</option>
                </select>
                <div className="modal-error-msg">Please select a project.</div>
              </div>
              <div className={`modal-field ${errors.pm ? 'has-error' : ''}`} id="npf-pm">
                <label>PM / Estimator <span className="req">*</span></label>
                <select className={`modal-select ${errors.pm ? 'error' : ''}`} id="np-pm" value={formData.pm} onChange={(e) => setFormData({...formData, pm: e.target.value})}>
                  <option value="">— Select PM —</option>
                  <option>Jay Patel</option>
                  <option>Rush Patel</option>
                  <option>Uma Patel</option>
                  <option>Mike Torres</option>
                </select>
                <div className="modal-error-msg">Please assign a PM.</div>
              </div>
              <div className={`modal-field ${errors.priority ? 'has-error' : ''}`} id="npf-priority">
                <label>Priority <span className="req">*</span></label>
                <select className={`modal-select ${errors.priority ? 'error' : ''}`} id="np-priority" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="">— Select priority —</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <div className="modal-error-msg">Please set a priority.</div>
              </div>
              <div className="modal-field">
                <label>Risk Level</label>
                <select className="modal-select" id="np-risk" value={formData.risk} onChange={(e) => setFormData({...formData, risk: e.target.value})}>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="modal-section-title">Flags</div>
            <div className="modal-form-grid">
              <div className="modal-field">
                <label>Long Lead Item</label>
                <div className="modal-toggle-wrap">
                  <button className={`modal-toggle ${formData.longLead ? 'on' : ''}`} id="np-longlead-toggle" onClick={() => setFormData({...formData, longLead: !formData.longLead})}></button>
                  <span className="modal-toggle-label" id="np-longlead-label">{formData.longLead ? 'Yes' : 'No'}</span>
                </div>
                <div className="modal-hint">Flag if material/equipment lead time is critical.</div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className={`modal-step-panel ${step === 2 ? 'active' : ''}`} id="np-panel-2">
            <div className="modal-section-title">Budget</div>
            <div className="modal-form-grid">
              <div className={`modal-field ${errors.budget ? 'has-error' : ''}`} id="npf-budget">
                <label>Target Budget <span className="req">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--text-muted)' }}>$</span>
                  <input className={`modal-input ${errors.budget ? 'error' : ''}`} id="np-budget" type="number" placeholder="e.g. 150000" style={{ paddingLeft: '22px' }} value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
                </div>
                <div className="modal-error-msg">Budget is required.</div>
              </div>
            </div>

            <div className="modal-section-title">Schedule</div>
            <div className="modal-form-grid">
              <div className={`modal-field ${errors.dueDate ? 'has-error' : ''}`} id="npf-duedate">
                <label>Target Award Date <span className="req">*</span></label>
                <input className={`modal-input ${errors.dueDate ? 'error' : ''}`} id="np-duedate" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
                <div className="modal-error-msg">Target date is required.</div>
              </div>
              <div className="modal-field">
                <label>Needed On Site Date</label>
                <input className="modal-input" id="np-onsite" type="date" value={formData.onSiteDate} onChange={(e) => setFormData({...formData, onSiteDate: e.target.value})} />
              </div>
            </div>

            <div className="modal-section-title">Current Status</div>
            <div className="modal-form-grid full">
              <div className={`modal-field ${errors.status ? 'has-error' : ''}`} id="npf-status">
                <label>Initial Status <span className="req">*</span></label>
                <select className={`modal-select ${errors.status ? 'error' : ''}`} id="np-status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option>Not Started</option>
                  <option>Bidding</option>
                  <option>Reviewing Bids</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Internal Notes</label>
                <textarea className="modal-textarea" id="np-notes" placeholder="Any initial notes or requirements here..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className={`modal-step-panel ${step === 3 ? 'active' : ''}`} id="np-panel-3">
            <div className="modal-section-title">Confirm Package Details</div>
            <div className="modal-summary-grid">
              <div className="modal-summary-item">
                <div className="modal-summary-label">Name</div>
                <div className="modal-summary-value" id="nps-name">{formData.name}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Trade</div>
                <div className="modal-summary-value" id="nps-trade">{formData.trade} ({formData.csi})</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Project</div>
                <div className="modal-summary-value" id="nps-project">{formData.project}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Assignment</div>
                <div className="modal-summary-value" id="nps-pm">{formData.pm}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Budget</div>
                <div className="modal-summary-value mono" id="nps-budget">${Number(formData.budget).toLocaleString()}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Target Award</div>
                <div className="modal-summary-value mono" id="nps-due">{formData.dueDate}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Status</div>
                <div className="modal-summary-value" id="nps-status">{formData.status}</div>
              </div>
              <div className="modal-summary-item">
                <div className="modal-summary-label">Flags</div>
                <div className="modal-summary-value" id="nps-flags" style={{ color: formData.longLead ? 'var(--amber)' : 'var(--text-primary)' }}>
                  {formData.priority} Priority
                  {formData.longLead ? ' · Long Lead' : ''}
                </div>
              </div>
            </div>
            <div className="modal-field" style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Please review the details above. Check our standard operating procedures if the package is a Critical priority or Long Lead item. The package will be initialized with a baseline schedule and no received bids.
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className={`modal-step-panel ${step === 4 ? 'active' : ''}`} id="np-panel-4">
            <div className="modal-success-screen">
              <div className="modal-success-icon">✓</div>
              <div className="modal-success-title">Package Created</div>
              <div className="modal-success-pkg-name" id="nps-created-name">{formData.name}</div>
              <div className="modal-success-sub">This buyout package has been added to the master log. You can now issue an RFP and begin collecting bids from vendors.</div>
              <button className="modal-btn success" style={{ marginTop: '10px' }} onClick={resetAndClose}>Close Modal</button>
            </div>
          </div>
          
        </div>

        {step !== 4 && (
          <div className="modal-footer" id="npFooter">
            <div className="modal-footer-left">
              <button className="modal-btn ghost" onClick={resetAndClose}>Cancel</button>
            </div>
            <div className="modal-footer-right">
              {step > 1 && <button className="modal-btn secondary" id="npBtnPrev" onClick={() => setStep(step - 1)}>Back</button>}
              {step < 3 ? (
                <button className="modal-btn primary" id="npBtnNext" onClick={handleNext}>Next Step →</button>
              ) : (
                <button className="modal-btn success" id="npBtnCreate" onClick={handleCreate}>Create Package</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
