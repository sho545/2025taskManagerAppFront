//TaskDtoを受け取ってタスクを表示する

import React from "react";
import { Box, Typography, IconButton, Checkbox } from '@mui/material';
//import { SimpleCheckbox } from '../atoms/SimpleCheckbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

import type{ TaskDto } from '../../apis/api' ;
// import { Link } from "react-router-dom";

// このコンポーネントが受け取るProps（プロパティ）の型を定義
interface TaskItemProps extends Omit<TaskDto, 'id'> {
  id: string; // タスクのID
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate : () => void; // ページ遷移のための関数
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  dueDate,
  completed,
  onToggleCompleted,
  onDelete,
  onNavigate
}) => {
  const formattedDueDate = dueDate ? format(new Date(dueDate), 'yyyy年MM月dd日 HH:mm') : '期日なし' ;

 return (
    // ★ 1. 一番外側のBoxからはonClickを削除 ★
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        borderBottom: '1px solid #e0e0e0',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      {/* チェックボックス部分 */}
      <Checkbox
        checked={completed}
        onChange={() => onToggleCompleted(id)}
        //onClick={(e) => e.stopPropagation()}
      />
      
      {/* ★ 2. テキスト部分をBoxで囲み、ここをクリック可能にする ★ */}
      <Box 
        onClick={onNavigate} // クリックでページ遷移するための関数を追加
        sx={{ flexGrow: 1, ml: 2, cursor: 'pointer' }}
      >
        <Typography
          variant="h6"
          // component={Link}
          // to={`/tasks/${id}`}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            ...(completed && { // completedがtrueの場合のスタイル
              textDecoration: 'line-through',
              color: 'text.disabled',
            }),
          }}
        >
          {title}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {formattedDueDate}
        </Typography>
      </Box>

      {/* 削除ボタン部分 */}
      <IconButton onClick={(e) => {
        e.stopPropagation(); // クリックイベントの伝播を止める
        onDelete(id)}}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};