"use client";

import React, { useEffect, useState } from "react";
import { Clock, Mail, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { auth } from "@/config/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

const WaitingApprovalPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router=useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const userEmail = user?.email;
  const submittedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString()
    : "";

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading user data...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Waiting for Approval
            </h1>
            <p className="text-slate-400 text-lg">
              Your account is pending approval from your organization
              administrator
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Email Verified</h3>
                <p className="text-slate-400 text-sm">{userEmail}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Request Submitted</h3>
                <p className="text-slate-400 text-sm">{submittedDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-600/20 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              What happens next?
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                  1
                </span>
                Your organization administrator will review your request.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                  2
                </span>
                You’ll receive an email once your account is approved.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                  3
                </span>
                After approval, you can access all features and start using the
                platform.
              </li>
            </ul>
          </div>

          <div className="bg-yellow-600/5 border border-yellow-600/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-500 font-medium text-sm mb-1">
                  Approval typically takes 24–48 hours
                </h4>
                <p className="text-slate-400 text-sm">
                  If you don’t receive approval within this timeframe, please
                  contact your organization administrator.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => {signOut(auth); router.replace("/auth")}}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingApprovalPage;
