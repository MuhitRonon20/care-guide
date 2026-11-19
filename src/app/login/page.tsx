import { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import { Activity, ShieldCheck, Stethoscope, Users, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Doctor Tracker - Care Guide BD",
  description: "Secure administrator sign-in for Care Guide BD Doctor Tracker portal.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Column: Brand & Product Showcase (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[#0A2540] via-[#0F3254] to-[#0284C7] p-12 text-white relative overflow-hidden">
        {/* Subtle decorative ambient circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white shadow-lg">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Doctor Tracker</h1>
            <p className="text-xs text-sky-200">Care Guide BD · Healthcare Administration</p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="space-y-6 max-w-lg relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-sky-200">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Administrative Healthcare Management</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
            Comprehensive Doctor & Patient Coordination Platform
          </h2>

          <p className="text-sm text-sky-100/90 leading-relaxed">
            Streamline healthcare provider oversight, patient allocations, and cross-hospital
            caseload analytics with an enterprise-grade administration architecture.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
              <Stethoscope className="h-5 w-5 text-sky-300 mb-2" />
              <div className="text-lg font-bold">Doctor Roster</div>
              <div className="text-xs text-sky-200">Specialization & Hospital Directory</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur">
              <Users className="h-5 w-5 text-teal-300 mb-2" />
              <div className="text-lg font-bold">Patient Caseload</div>
              <div className="text-xs text-sky-200">Per-Doctor Tracking & Clinical Conditions</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-sky-200/80 flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
          <span>Technical Recruitment Assessment</span>
          <span>Care Guide BD © 2024</span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight">Doctor Tracker</div>
              <div className="text-[11px] text-slate-500">Care Guide BD Portal</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500">
              Enter your authorized clinical administrator credentials to access the portal.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-card">
            <LoginForm />
          </div>

          {/* Security & Architecture Note */}
          <div className="text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Protected by role-based access control. Unauthorized access attempts are logged.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
              <Building2 className="h-3 w-3 text-slate-400" />
              <span>Prepared for standalone Express & MongoDB backend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

