import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { Play, Pause, Volume2 } from 'lucide-react';

// ADDED PROP: onTimeUpdate
const AudioPlayer = ({ audioUrl, onTimeUpdate, setWaveSurferRef }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (waveSurferRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#94a3b8',      
      progressColor: '#2563eb',  
      cursorColor: '#1e40af',    
      barWidth: 2,
      barGap: 3,
      height: 96,                
      responsive: true,
      plugins: [RegionsPlugin.create()],
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
      setIsReady(true);
      // Pass the ref up to the parent so we can control it from outside
      if (setWaveSurferRef) setWaveSurferRef(wavesurfer);
    });

    // NEW: Broadcast current time every time it changes
    wavesurfer.on('timeupdate', (currentTime) => {
      if (onTimeUpdate) onTimeUpdate(currentTime);
    });

    wavesurfer.on('finish', () => setIsPlaying(false));

    waveSurferRef.current = wavesurfer;

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause();
      setIsPlaying(!waveSurferRef.current.isPlaying());
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
                <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-slate-900">Call Recording #2024-001</h3>
                <p className="text-xs text-slate-500">Agent: Sarah J. | Duration: 05:23</p>
            </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${isReady ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {isReady ? 'Ready' : 'Loading...'}
        </span>
      </div>
      <div ref={containerRef} className="w-full mb-6 border-b border-slate-100 pb-4" />
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={togglePlay}
          disabled={!isReady} 
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all disabled:opacity-50"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;