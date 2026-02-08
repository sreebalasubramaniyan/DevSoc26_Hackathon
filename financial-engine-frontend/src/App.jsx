import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import AudioRecorder from './components/AudioRecorder'; // Import new component
import TranscriptViewer from './components/TranscriptViewer';
import InsightPanel from './components/InsightPanel';
import { MOCK_TRANSCRIPT, MOCK_INSIGHTS } from './data';
import { FileAudio, Mic } from 'lucide-react'; // Import icons

function App() {
  const SAMPLE_AUDIO = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"; 

  // --- STATE ---
  const [mode, setMode] = useState('upload'); // 'upload' or 'record'
  const [transcript, setTranscript] = useState([]);
  const [insights, setInsights] = useState(null);
  
  // Player State
  const [currentTime, setCurrentTime] = useState(0);
  const [waveSurferInstance, setWaveSurferInstance] = useState(null);

  // Load initial data
  useEffect(() => {
    setTranscript(MOCK_TRANSCRIPT);
    setInsights(MOCK_INSIGHTS);
  }, []);

  const handleSeek = (time) => {
    if (waveSurferInstance) {
      waveSurferInstance.setTime(time);
      waveSurferInstance.play();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Mode Switcher */}
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Universal Financial Audio Intelligence
            </h1>
            <p className="text-slate-500 mt-1">
              Call Audit & Compliance Dashboard
            </p>
          </div>

          {/* TOGGLE BUTTONS */}
          <div className="bg-white p-1 rounded-lg border border-slate-200 flex gap-1">
            <button 
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'upload' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              Upload / Play
            </button>
            <button 
              onClick={() => setMode('record')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'record' 
                  ? 'bg-red-50 text-red-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Mic className="w-4 h-4" />
              Live Record
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* CONDITIONAL RENDERING: Player OR Recorder */}
            {mode === 'upload' ? (
              <AudioPlayer 
                audioUrl={SAMPLE_AUDIO} 
                onTimeUpdate={setCurrentTime} 
                setWaveSurferRef={setWaveSurferInstance}
              />
            ) : (
              <AudioRecorder 
                onStop={() => console.log("Recording stopped")} 
              />
            )}
            
            {/* Insights Panel (Always visible) */}
            {insights && <InsightPanel insights={insights} />}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <TranscriptViewer 
              transcript={transcript} 
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;