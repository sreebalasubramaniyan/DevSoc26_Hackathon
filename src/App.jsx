import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import AudioRecorder from './components/AudioRecorder';
import TranscriptViewer from './components/TranscriptViewer';
import InsightPanel from './components/InsightPanel';
import { FileAudio, Mic, Activity } from 'lucide-react';

function App() {
  const SAMPLE_AUDIO = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"; 

  // 1. FORCE INITIAL STATE
  const [insights, setInsights] = useState({
    riskScore: 0,
    sentiment: "Ready",
    entities: []
  });

  const [transcript, setTranscript] = useState([
    { id: 1, speaker: "System", startTime: 0, endTime: 0, text: "Ready for live analysis..." }
  ]);
  
  const [mode, setMode] = useState('upload'); 
  const [currentTime, setCurrentTime] = useState(0);
  const [waveSurferInstance, setWaveSurferInstance] = useState(null);

  const handleSeek = (time) => {
    if (waveSurferInstance) {
      waveSurferInstance.setTime(time);
      waveSurferInstance.play();
    }
  };

  // 2. THE HANDLER (Must match exactly)
  const handleLiveAnalysis = (data) => {
    console.log("✅ APP RECEIVED DATA:", data); 

    if (data.risk_score !== undefined) {
      setInsights(prev => ({
        ...prev,
        riskScore: data.risk_score,
        sentiment: data.sentiment || "Neutral",
      }));
    }

    if (data.transcript_chunk) {
      setTranscript(prev => [
        ...prev,
        {
          id: Date.now(),
          speaker: "Live",
          startTime: currentTime, 
          endTime: currentTime + 1,
          text: data.transcript_chunk
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="text-blue-600" />
              Universal Financial Audio Intelligence
            </h1>
          </div>
          <div className="bg-white p-1 rounded-lg border border-slate-200 flex gap-1">
            <button onClick={() => setMode('upload')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'upload' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              <FileAudio className="w-4 h-4" /> Upload / Play
            </button>
            <button onClick={() => setMode('record')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'record' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Mic className="w-4 h-4" /> Live Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {mode === 'upload' ? (
              <AudioPlayer audioUrl={SAMPLE_AUDIO} onTimeUpdate={setCurrentTime} setWaveSurferRef={setWaveSurferInstance} />
            ) : (
              // 3. THIS CONNECTS THEM
              <AudioRecorder onStop={() => console.log("Stop")} onAnalysisUpdate={handleLiveAnalysis} />
            )}
            <InsightPanel insights={insights} />
          </div>
          <div className="lg:col-span-1">
            <TranscriptViewer transcript={transcript} currentTime={currentTime} onSeek={handleSeek} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;