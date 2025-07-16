import React from "react";
import { Box, Checkbox, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import type{ TaskDto } from '../../apis/api' ;

// このコンポーネントが受け取るProps（プロパティ）の型を定義
interface TaskItemProps extends TaskDto {
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  dueDate,
  completed,
  onToggleCompleted,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',                      //要素を横一列に配置
        alignItems: 'center',                 //縦の高さ
        p: 1.5,                               //コンポーネント内側のpadding
        borderBottom: '1px solid #e0e0e0',  //コンポーネントの下側に#e0e0e0の1px実線
      }}
    >
      {/* Checkbox (completed) */}
      <Checkbox
        checked={completed}
        onChange={() => {if(id){onToggleCompleted(id);}}}
      />
      
      {/* Title and DueDate */}
      <Box sx={{ flexGrow: 1, ml: 2 }}> {/*flexGrow:1 ; flexのboxの中で、余ってるスペースを吸収/ml=margin-left,1=8px*/}
        <Typography
          variant="h6" 
          sx={{
            textDecoration: completed ? 'line-through' : 'none',
            color: completed ? 'text.disabled' : 'text.primary',
          }}
        >
          {title}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {dueDate}
        </Typography>
      </Box>

      {/* IconButton (delete) */}
      <IconButton onClick={() => {if(id){onDelete(id)}}}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};