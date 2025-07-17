import React from 'react';
import { Box, Typography } from '@mui/material';

// 以前作成したTaskItemコンポーネントをインポート
import { TaskItem } from '../molecules/TaskItem';

// APIクライアントからTaskの型定義をインポート
import type { TaskDto } from '../../apis/api';

// このコンポーネントが受け取るPropsの型を定義
interface TaskListProps {
  tasks: TaskDto[]; // Taskの配列
  onToggleCompleted: (id: number) => void;
  onDelete: (id: number) => void;
}

//FC=Functional Component
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompleted,
  onDelete,
}) => {
  // 表示するタスクがない場合の表示
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}> //paddingを全方向に8*3px設定
        <Typography color="text.secondary">
          表示するタスクはありません。
        </Typography>
      </Box>
    );
  }

  // タスクがある場合の表示
  return (
    <Box>
      {tasks.map((task) => (
        <TaskItem
          key={task.id} // Reactがリストの各項目を識別するための必須キー
          {...task}     // taskオブジェクトの全プロパティ（id, titleなど）を渡す
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};