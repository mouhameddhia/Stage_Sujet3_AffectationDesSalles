import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed Top Navbar */}
      <Navbar />
      
      {/* Main Content with Top Margin for Navbar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '70px', // Height of navbar
          p: 3,
          background: '#f8f9fa',
          minHeight: 'calc(100vh - 70px)'
        }}
      >
        {/* Page Content */}
        <Box sx={{ 
          background: 'white', 
          borderRadius: 3, 
          p: 3, 
          minHeight: 'calc(100vh - 130px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 