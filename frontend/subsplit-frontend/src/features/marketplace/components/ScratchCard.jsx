import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { Copy, Check, Sparkles, Ticket } from 'lucide-react';

function ScratchCard({ code, requestId, onScratchComplete, isAlreadyScratched }) {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(isAlreadyScratched);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsScratched(isAlreadyScratched);
  }, [isAlreadyScratched]);

  useEffect(() => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fill background with glossy scratch layer
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#3f3f46');
    gradient.addColorStop(0.5, '#27272a');
    gradient.addColorStop(1, '#18181b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add metallic pattern texture & text
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪙 Scratch here to reveal Activation Code', width / 2, height / 2);

    // Border
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, width, height);
  }, [isScratched]);

  const checkScratchPercentage = (ctx, width, height) => {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const totalPixels = pixels.length / 4;
      const percentage = (transparentPixels / totalPixels) * 100;

      if (percentage > 35) {
        setIsScratched(true);
        if (onScratchComplete) onScratchComplete();
      }
    } catch (e) {
      // In case of canvas read restriction fallback
      setIsScratched(true);
      if (onScratchComplete) onScratchComplete();
    }
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage(ctx, canvas.width, canvas.height);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '110px',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          p: 2,
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15)',
        }}
      >
        {/* Background Revealed Code Content */}
        <Box sx={{ textAlign: 'center', zIndex: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
            <Ticket size={18} color="#c084fc" />
            <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 800, letterSpacing: '0.05em' }}>
              ACTIVATION CODE
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '1.45rem',
              fontWeight: 900,
              color: '#f3f4f6',
              letterSpacing: '0.12em',
              fontFamily: 'monospace',
              my: 1,
            }}
          >
            {code}
          </Typography>

          {isScratched && (
            <Tooltip title={copied ? 'Copied!' : 'Copy Activation Code'}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopy}
                startIcon={copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                sx={{
                  mt: 0.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderColor: copied ? '#22c55e' : 'rgba(168, 85, 247, 0.4)',
                  color: copied ? '#22c55e' : '#c084fc',
                  '&:hover': {
                    borderColor: '#c084fc',
                    background: 'rgba(168, 85, 247, 0.1)',
                  },
                }}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Code'}
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Overlay Canvas Scratch Layer */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            width={340}
            height={110}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: 'crosshair',
              zIndex: 2,
              borderRadius: '16px',
              touchAction: 'none',
            }}
          />
        )}
      </Box>

      {!isScratched && (
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#9ca3af', fontWeight: 600 }}
        >
          ✨ Drag mouse or finger across the silver card above to scratch and reveal code!
        </Typography>
      )}
    </Box>
  );
}

export default ScratchCard;
