import React from 'react';
import { ShieldAlert, CheckCircle, XCircle, DollarSign, Calendar, CreditCard } from 'lucide-react';

const InsightPanel = ({ insights }) => {
  // Helper to choose color based on risk score
  const getRiskColor = (score) => {
    if (score < 30) return "text-green-600 bg-green-50 border-green-200";
    if (score < 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-indigo-600" />
        AI Financial Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Risk Score Gauge */}
        <div className="col-span-1 p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">Risk Score</span>
            <div className={`text-4xl font-black ${getRiskColor(insights.riskScore).split(' ')[0]}`}>
                {insights.riskScore}/100
            </div>
            <span className={`mt-2 px-3 py-1 text-xs font-bold rounded-full border ${getRiskColor(insights.riskScore)}`}>
                High Risk
            </span>
        </div>

        {/* 2. Extracted Entities (Money, Dates) */}
        <div className="col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Extracted Entities</h4>
            
            <div className="grid grid-cols-2 gap-3">
                {insights.entities.map((ent, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                            {ent.type === 'MONEY' && <DollarSign className="w-4 h-4" />}
                            {ent.type === 'DATE' && <Calendar className="w-4 h-4" />}
                            {ent.type === 'PRODUCT' && <CreditCard className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{ent.value}</p>
                            <p className="text-xs text-slate-500">{ent.context}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Compliance Checklist */}
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle className="w-4 h-4" /> Disclaimer Given
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                        <CheckCircle className="w-4 h-4" /> RPC Verified
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default InsightPanel;