import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Shield } from 'lucide-react';

const InsightPanel = ({ insights }) => {
  if (!insights) return null;

  const { riskScore, sentiment, entities } = insights;

  // Color logic based on risk score
  const getRiskColor = (score) => {
    if (score > 80) return 'text-red-600';
    if (score > 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBg = (score) => {
    if (score > 80) return 'bg-red-50 border-red-200';
    if (score > 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Risk Score Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Real-Time Risk Analysis
        </h3>
        
        <div className="flex items-center gap-8">
            {/* The Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle 
                        cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={351} 
                        strokeDashoffset={351 - (351 * riskScore) / 100}
                        className={`transition-all duration-1000 ease-out ${getRiskColor(riskScore)}`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getRiskColor(riskScore)}`}>{riskScore}</span>
                    <span className="text-xs text-slate-400">RISK</span>
                </div>
            </div>

            {/* Context Stats */}
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${getRiskBg(riskScore)}`}>
                    <div className="text-xs text-slate-500 mb-1">Sentiment</div>
                    <div className={`font-semibold ${getRiskColor(riskScore)}`}>
                        {sentiment}
                    </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                    <div className="text-xs text-slate-500 mb-1">Entities Detected</div>
                    <div className="font-semibold text-slate-700">
                        {entities ? entities.length : 0}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Detected Entities List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Detected Financial Entities
        </h3>
        <div className="space-y-3">
            {entities && entities.length > 0 ? (
                entities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                {entity.type}
                            </span>
                            <span className="text-sm font-medium text-slate-700">
                                {entity.value}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400 italic">
                            {entity.context}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-400 italic">Listening for financial keywords...</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;