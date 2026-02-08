import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { Mic, Square, Radio } from 'lucide-react';

const AudioRecorder = ({ onStop }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const recordPluginRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // 0. Strict Mode Safety: Prevent double initialization
    if (waveSurferRef.current) return;

    // 1. Initialize WaveSurfer
    // We force a height and background color to ensure visibility
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#ff0000', // Bright red
      progressColor: '#b91c1c',
      cursorColor: 'transparent',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 120, // Force height
      normalize: true, // boost quiet audio
    });

    // 2. Initialize Record Plugin
    const record = wavesurfer.registerPlugin(RecordPlugin.create({
      scrollingWaveform: true, // ENABLE SCROLLING
      renderRecordedAudio: false, 
      scrollingWaveformWindow: 5 // Show last 5 seconds
    }));

    // Save references
    waveSurferRef.current = wavesurfer;
    recordPluginRef.current = record;

    // Debugging: Log when ready
    console.log("AudioRecorder: Initialized");

    record.on('record-start', () => console.log("AudioRecorder: Started recording"));
    record.on('record-end', (blob) => console.log("AudioRecorder: Stopped", blob));

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
        waveSurferRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!recordPluginRef.current) return;

      // GET LIST OF DEVICES (Optional debugging)
      const devices = await RecordPlugin.getAvailableAudioDevices();
      console.log("Available Mics:", devices);

      // START MIC
      await recordPluginRef.current.startMic();
      
      setIsRecording(true);
      
      // Start Timer
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Error accessing microphone. Check console (F12) for details.');
    }
  };

  const stopRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopMic();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (onStop) onStop(); 
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 w-full mb-6">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-slate-100'}`}>
            <Radio className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-slate-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Live Analysis Session</h3>
            <p className="text-xs text-slate-500">
              {isRecording ? 'Listening...' : 'Ready to record'}
            </p>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-slate-700">
          {formatTime(duration)}
        </div>
      </div>

      {/* WAVEFORM CONTAINER - Explicitly styled to prevent collapse */}
      <div 
        className="w-full mb-8 border border-slate-100 bg-slate-50 rounded-lg overflow-hidden relative" 
        style={{ height: '120px', display: 'block' }}
      >
          {/* This ID is just for debugging, the ref handles the connection */}
          <div ref={containerRef} className="w-full h-full" />
      </div>
      
      <div className="flex items-center justify-center">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-red-200 transition-all"
          >
            <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Start Recording</span>
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg transition-all"
          >
            <Square className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Stop Analysis</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;