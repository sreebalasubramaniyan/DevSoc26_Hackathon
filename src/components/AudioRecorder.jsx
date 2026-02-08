import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { Mic, Square, Activity, Radio } from 'lucide-react';

const AudioRecorder = ({ onStop, onAnalysisUpdate }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const recordPluginRef = useRef(null);
  const socketRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (waveSurferRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#ff0000', 
      progressColor: '#b91c1c',
      cursorColor: 'transparent',
      barWidth: 3,
      barGap: 3,
      barRadius: 3,
      height: 120, 
      normalize: true, 
    });

    const record = wavesurfer.registerPlugin(RecordPlugin.create({
      scrollingWaveform: true,
      renderRecordedAudio: false, 
      scrollingWaveformWindow: 5 
    }));

    waveSurferRef.current = wavesurfer;
    recordPluginRef.current = record;

    return () => {
      if (wavesurfer) wavesurfer.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!recordPluginRef.current) return;

      console.log("🚀 STARTING RECORDER...");

      // 1. CONNECT TO BACKEND
      console.log("📞 Dialing WebSocket...");
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/live-analysis');
      
      socket.onopen = () => {
        console.log("✅ WEBSOCKET CONNECTED!");
        socketRef.current = socket;
      };

      socket.onerror = (error) => {
        console.error("❌ WEBSOCKET ERROR - Check Python Terminal!", error);
      };

      socket.onmessage = (event) => {
        // 2. RECEIVE DATA & SEND TO APP
        const data = JSON.parse(event.data);
        console.log("📩 RECEIVED DATA:", data); // You must see this log!
        
        if (onAnalysisUpdate) {
            onAnalysisUpdate(data);
        } else {
            console.warn("⚠️ App.jsx is NOT listening!");
        }
      };

      await recordPluginRef.current.startMic();
      setIsRecording(true);
      
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        // Send Ping
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send("Ping");
        }
      }, 1000); 
      
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (recordPluginRef.current) {
      recordPluginRef.current.stopMic();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (socketRef.current) socketRef.current.close();
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
            {isRecording ? <Activity className="w-5 h-5 text-red-600" /> : <Radio className="w-5 h-5 text-slate-500" />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Live Analysis Session</h3>
            <p className="text-xs text-slate-500">{isRecording ? 'Streaming...' : 'Ready to connect'}</p>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-slate-700">{formatTime(duration)}</div>
      </div>
      <div className="w-full mb-8 border border-slate-100 bg-slate-50 rounded-lg overflow-hidden relative" style={{ height: '120px', display: 'block' }}>
          <div ref={containerRef} className="w-full h-full" />
      </div>
      <div className="flex items-center justify-center">
        {!isRecording ? (
          <button onClick={startRecording} className="group flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all">
            <Mic className="w-5 h-5" /> <span className="font-semibold">Start Live Analysis</span>
          </button>
        ) : (
          <button onClick={stopRecording} className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg transition-all">
            <Square className="w-5 h-5" /> <span className="font-semibold">Stop Session</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;