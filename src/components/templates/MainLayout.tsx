import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { Header } from '../organisms/Header';

export const MainLayout: React.FC = () => {
  return (
    <Box>
      <Header />
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};