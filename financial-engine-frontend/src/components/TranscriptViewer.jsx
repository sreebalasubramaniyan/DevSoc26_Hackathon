import React, { useRef, useEffect } from 'react';
import { User, Headphones, MessageSquare } from 'lucide-react';

// FIX 1: Default 'transcript' to empty array [] to prevent crash
const TranscriptViewer = ({ transcript = [], currentTime, onSeek }) => {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  return (
    // FIX 2: Changed h-[500px] to h-125 to fix yellow warning
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-125 flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500"/>
            Live Transcript
        </h3>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-4 flex-1">
        {/* FIX 3: Check length safely */}
        {(!transcript || transcript.length === 0) ? (
            <div className="text-center text-slate-400 mt-10">
                <p>No transcript data available.</p>
            </div>
        ) : (
            transcript.map((segment) => {
            const isActive = currentTime >= segment.startTime && currentTime <= segment.endTime;

            return (
                <div 
                key={segment.id}
                ref={isActive ? activeRef : null}
                onClick={() => onSeek(segment.startTime)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 ${
                    isActive 
                    ? 'bg-blue-50 border-blue-500 shadow-sm' 
                    : 'hover:bg-slate-50 border-transparent'
                }`}
                >
                <div className="flex items-center gap-2 mb-1">
                    {segment.speaker === 'Agent' ? (
                    <Headphones className="w-4 h-4 text-blue-600" />
                    ) : (
                    <User className="w-4 h-4 text-slate-600" />
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                    segment.speaker === 'Agent' ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                    {segment.speaker}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto font-mono">
                    {new Date(segment.startTime * 1000).toISOString().substr(14, 5)}
                    </span>
                </div>
                
                <p className={`text-sm leading-relaxed ${
                    isActive ? 'text-slate-900 font-medium' : 'text-slate-600'
                }`}>
                    {segment.text}
                </p>
                </div>
            );
            })
        )}
      </div>
    </div>
  );
};

export default TranscriptViewer;