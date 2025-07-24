import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '../organisms/Header';

export const MainLayout: React.FC = () => {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        {/* ↓ここに各ページコンポーネントが描画される */}
        <Outlet />
      </Box>
    </Box>
  );
};