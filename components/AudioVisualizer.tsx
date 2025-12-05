import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!isActive || !stream || !canvasRef.current) return;

    // Setup Audio Context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      if (!canvasCtx) return;
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear with fade effect for trails
      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50;

      canvasCtx.beginPath();
      canvasCtx.strokeStyle = '#dc2626'; // Blood red
      canvasCtx.lineWidth = 2;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize
        const angle = (i / bufferLength) * Math.PI * 2;
        
        // Mirror effect for Rorschach look
        const distortion = v * 50;
        const x = centerX + Math.cos(angle) * (radius + distortion);
        const y = centerY + Math.sin(angle) * (radius + distortion);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      }

      canvasCtx.closePath();
      canvasCtx.stroke();

      // Inner glow
      canvasCtx.shadowBlur = 15;
      canvasCtx.shadowColor = '#ff0000';
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      // Don't close context to allow reuse or let browser handle it
    };
  }, [isActive, stream]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-50">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="animate-pulse"
      />
    </div>
  );
};

export default AudioVisualizer;