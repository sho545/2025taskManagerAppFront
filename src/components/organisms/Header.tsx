import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* ロゴやサイトタイトル */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          タスク管理アプリ
        </Typography>

        {/* ナビゲーションリンク */}
        <Box>
          <Button color="inherit" component={Link} to="/">
            タスク一覧
          </Button>
          <Button color="inherit" component={Link} to="/tasks/new">
            新規作成
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};