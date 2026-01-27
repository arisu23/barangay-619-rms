
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface LoadingPageProps {
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  useEffect(() => {
    // Simulated initial loading time for branding visibility
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 450, px: 4 }}>
        <img
          src="https://media.discordapp.net/attachments/1438161259462787073/1439120214435561483/att.g_4t85zYhMdID5Q6sk8PT3DHrEtdAnWmgwuz9b1ET8k.jpg?ex=695deaa4&is=695c9924&hm=b446d732ad70181d19028d66a3dd7edc1bfc9bb3cf5b2da530a7cc11f6775a65&=&format=webp&width=519&height=519"
          alt="Barangay Logo"
          style={{ 
            width: 180, 
            height: 180, 
            marginBottom: 24,
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))'
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            lineHeight: 1.4,
            fontSize: '1.2rem',
            letterSpacing: '0.02em',
            animation: 'fadeIn 1s ease-in'
          }}
        >
          Local - Based Resident Record Management System
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            display: 'block',
            color: '#94a3b8',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          Barangay 619 • Zone 62
        </Typography>
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingPage;
