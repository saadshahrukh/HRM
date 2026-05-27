"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  ChevronRight, 
  User, 
  FileText, 
  Building2, 
  Briefcase, 
  Clock, 
  Settings, 
  Check,
  AlertCircle,
  Calendar as CalendarIcon,
  UploadCloud,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Offer Status", icon: CheckCircle2 },
  { id: 2, title: "Profile", icon: User },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Department", icon: Building2 },
  { id: 5, title: "Role", icon: Briefcase },
  { id: 6, title: "Shift", icon: Clock },
  { id: 7, title: "Provisioning", icon: Settings },
];

export default function OnboardingPipeline() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Context passed from the Pipeline
  const candidateName = searchParams.get("candidateName") || "";
  const candidateEmail = searchParams.get("candidateEmail") || "";
  const salary = searchParams.get("salary") || "";
  const jobRole = searchParams.get("jobRole") || "";
  const departmentQuery = searchParams.get("department") || "";

  const isAutomated = !!candidateName;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    offerDate: new Date().toISOString().split("T")[0],
    baseSalary: salary || "",
    offerAccepted: true,

    fullName: candidateName || "",
    email: candidateEmail || "",
    dob: "",
    source: isAutomated ? "METAWAYZ Portal (ATS)" : "Manual Entry",

    docsVerified: isAutomated, // Pre-verified if from ATS

    department: departmentQuery || "",
    manager: "John Doe",

    roleTitle: jobRole || "",
    designation: "",
    accessLevel: "Standard User",

    shift: "Morning (9 AM - 5 PM)",
    workType: "New York (Hybrid)",
    gpsTracking: true,

    provisionLaptop: false,
    provisionEmail: true,
    provisionJira: true,
    provisionSlack: true,
  });

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Employee Onboarding Completed! Profile created.");
    router.push("/employees");
  };

  // -------------------------------------------------------------
  // STEP RENDERERS
  // -------------------------------------------------------------
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Offer Status Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offer Date</label>
                <div className="relative">
                  <Input 
                    type="date"
                    value={formData.offerDate}
                    onChange={(e) => updateForm('offerDate', e.target.value)}
                    className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  />
                  <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agreed Base Salary</label>
                <Input 
                  value={formData.baseSalary}
                  onChange={(e) => updateForm('baseSalary', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  placeholder="e.g. $125k / year"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Offer Acceptance</label>
                <div className="flex items-center gap-3 bg-[#0B111E] border border-slate-800 p-4 rounded-xl">
                  <input 
                    type="checkbox" 
                    checked={formData.offerAccepted}
                    onChange={(e) => updateForm('offerAccepted', e.target.checked)}
                    className="w-5 h-5 accent-cyan-500 rounded bg-[#070A12] border-slate-700"
                  />
                  <span className="text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Validated Offer Accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Profile Creation</h3>
            
            <label className="flex items-center gap-6 cursor-pointer">
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  toast.success('Profile photo uploaded successfully!');
                }
              }} />
              <div className="h-24 w-24 rounded-full bg-[#070A12] border border-slate-800 flex items-center justify-center text-slate-600 relative overflow-hidden group hover:border-cyan-500 transition-colors">
                <User className="h-10 w-10 group-hover:text-cyan-500 transition-colors" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <UploadCloud className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Profile Photo</h4>
                <p className="text-xs text-slate-400 mt-1">Upload a professional headshot. JPG or PNG.</p>
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <Input 
                  value={formData.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Email</label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                <div className="relative">
                  <Input 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateForm('dob', e.target.value)}
                    className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  />
                  <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Source</label>
                <select 
                  value={formData.source}
                  onChange={(e) => updateForm('source', e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 text-white rounded-md px-3 h-12 focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="METAWAYZ Portal (ATS)">METAWAYZ Portal (ATS)</option>
                  <option value="Manual Entry">Manual Entry</option>
                  <option value="Referral">Internal Referral</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Documents Upload & Verification</h3>
            
            <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#070A12] rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group w-full block">
              <input type="file" className="hidden" multiple onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  updateForm('docsVerified', true);
                  toast.success(`${e.target.files.length} document(s) uploaded successfully!`);
                }
              }} />
              <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                <UploadCloud className="h-8 w-8 text-cyan-500" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Drag & Drop Documents Here</h4>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">Upload CV, National ID, and Signed Contract forms. PDF, DOCX up to 10MB.</p>
              
              <div className="mt-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-10 px-4 inline-flex items-center justify-center text-sm font-medium transition-colors cursor-pointer">
                Browse Files
              </div>
            </label>

            {formData.docsVerified && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-400 text-sm">Pre-Verified via ATS</h5>
                    <p className="text-xs text-emerald-500/70">Candidate documents were already uploaded and parsed during the interview phase.</p>
                  </div>
                </div>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent h-8 text-xs">
                  View Files
                </Button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Department Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Department</label>
                <select 
                  value={formData.department}
                  onChange={(e) => updateForm('department', e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 text-white rounded-md px-3 h-12 focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="" disabled>Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                  <option value="Operations & Support">Operations & Support</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Manager</label>
                <Input 
                  value={formData.manager}
                  onChange={(e) => updateForm('manager', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-slate-400 h-12"
                  readOnly
                />
                <p className="text-[10px] text-cyan-500">Automatically resolved based on department hierarchy.</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Role & Designation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Role Title</label>
                <Input 
                  value={formData.roleTitle}
                  onChange={(e) => updateForm('roleTitle', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Functional Designation</label>
                <Input 
                  value={formData.designation}
                  onChange={(e) => updateForm('designation', e.target.value)}
                  className="bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-12"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Access Permissions</label>
                <select 
                  value={formData.accessLevel}
                  onChange={(e) => updateForm('accessLevel', e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 text-white rounded-md px-3 h-12 focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Guest">Guest / Limited</option>
                  <option value="Standard User">Standard User</option>
                  <option value="Manager">Manager</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Shift & Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Scheduling</label>
                <select 
                  value={formData.shift}
                  onChange={(e) => updateForm('shift', e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 text-white rounded-md px-3 h-12 focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="Morning (9 AM - 5 PM)">Morning (9 AM - 5 PM)</option>
                  <option value="Evening (3 PM - 11 PM)">Evening (3 PM - 11 PM)</option>
                  <option value="Night (11 PM - 7 AM)">Night (11 PM - 7 AM)</option>
                  <option value="Flexible">Flexible Hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Type / Location</label>
                <select 
                  value={formData.workType}
                  onChange={(e) => updateForm('workType', e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 text-white rounded-md px-3 h-12 focus:outline-none focus:border-cyan-500 appearance-none"
                >
                  <option value="New York (Hybrid)">New York (Hybrid)</option>
                  <option value="London (On-site)">London (On-site)</option>
                  <option value="Remote (Global)">Remote (Global)</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between bg-[#0B111E] border border-slate-800 p-5 rounded-xl mt-2">
                  <div>
                    <h5 className="font-bold text-white text-sm">GPS Attendance Tracking</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Mandatory for field workers or specific on-site roles.</p>
                  </div>
                  
                  {/* Modern Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.gpsTracking}
                      onChange={(e) => updateForm('gpsTracking', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                  </label>

                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-white">System Setup & Provisioning</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "provisionLaptop", label: "Company Laptop & Hardware", desc: "Trigger IT ticket for dispatch." },
                { key: "provisionEmail", label: "Corporate Email Account", desc: "Create Google Workspace account." },
                { key: "provisionJira", label: "Jira / Confluence Access", desc: "Add to Atlassian directory." },
                { key: "provisionSlack", label: "Slack Workspace Access", desc: "Send Slack invite to personal email." }
              ].map((item) => (
                <div key={item.key} className={`border p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-colors ${formData[item.key] ? 'bg-cyan-950/20 border-cyan-500/50' : 'bg-[#0B111E] border-slate-800 hover:border-slate-700'}`} onClick={() => updateForm(item.key, !formData[item.key])}>
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData[item.key] ? 'bg-cyan-500 border-cyan-500' : 'bg-[#070A12] border-slate-700'}`}>
                    {formData[item.key] && <Check className="h-3.5 w-3.5 text-black font-black" />}
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${formData[item.key] ? 'text-white' : 'text-slate-300'}`}>{item.label}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-cyan-500/20 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Sparkles className="h-24 w-24 text-cyan-400" />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-black text-white">Ready to Onboard {formData.fullName.split(' ')[0] || "Employee"}!</h4>
                <p className="text-sm text-cyan-100/70 mt-1 max-w-md">
                  All systems are checked. Clicking complete will generate the official employee profile and dispatch welcome emails.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#0A0E1A,#05070F)] p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Onboarding Pipeline</h1>
            <p className="text-sm text-[#94A3B8] mt-1">Structure and automate new hire integration.</p>
          </div>

          {isAutomated && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-fade-in">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                Data Extracted via OCR & ATS
              </span>
            </div>
          )}
        </div>

        {/* Stepper tracking bar */}
        <div className="bg-[#0B111E]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative">
          
          <div className="flex items-center justify-between relative z-10 w-full mb-8 px-2 md:px-6">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-20 w-16">
                  <div 
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-20 bg-[#0B111E] ${
                      isCompleted 
                        ? 'border-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.4)]' 
                        : isActive 
                          ? 'border-cyan-400 shadow-[0_0_10px_rgba(0,210,255,0.2)]' 
                          : 'border-slate-800 opacity-60'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 md:h-6 md:w-6 text-white font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                    ) : (
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,210,255,0.6)]' : 'text-slate-500'}`} />
                    )}
                  </div>
                  <div className={`mt-3 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center absolute -bottom-6 w-24 ${
                    isCompleted || isActive ? 'text-white drop-shadow-md' : 'text-[#4B5563]'
                  }`}>
                    {step.title}
                  </div>
                </div>
              );
            })}

            {/* Connecting Lines Container (Absolute positioned behind circles) */}
            <div className="absolute top-5 md:top-6 left-10 right-10 h-0.5 bg-slate-800 -z-10" />
            
            {/* Active connecting line */}
            <div 
              className="absolute top-5 md:top-6 left-10 h-0.5 bg-cyan-500 -z-10 shadow-[0_0_8px_rgba(0,210,255,0.6)] transition-all duration-500"
              style={{ width: `calc(${(currentStep - 1) / (STEPS.length - 1) * 100}% - 40px)` }}
            />
          </div>

          <div className="mt-16 bg-[#070A12] rounded-xl border border-slate-800/80 p-6 md:p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 1 || loading}
              variant="outline"
              className="bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 rounded-xl"
            >
              Previous Step
            </Button>

            {currentStep < 7 ? (
              <Button
                onClick={handleNext}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-cyan-600/20"
              >
                Confirm & Continue <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-cyan-600/20 min-w-[240px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Complete & Create Official Profile
                  </>
                )}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
