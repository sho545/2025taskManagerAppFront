import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

// このコンポーネントが受け取るPropsの型を定義
interface ConfirmationDialogProps {
  open: boolean; // ダイアログの開閉状態
  onClose: () => void; // ダイアログを閉じるための関数.親コンポーネントに通知するのが仕事
  onConfirm: () => void; // 「はい」が押されたときの処理
  title: string; // ダイアログのタイトル
  message: string; // 確認メッセージ
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>いいえ</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};