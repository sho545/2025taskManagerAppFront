import React from 'react';
import { Box, Typography } from '@mui/material';

import { TaskItem } from '../molecules/TaskItem';
import type { TaskDto } from '../../apis/api';

type UiTask = Omit<TaskDto, 'id'> & { id: string };
// このコンポーネントが受け取るPropsの型を定義
interface TaskListProps {
  tasks: UiTask[]; // Taskの配列
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void; // ページ遷移のための関数
}

//FC=Functional Component
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompleted,
  onDelete,
  onNavigate
}) => {
  // 表示するタスクがない場合の表示
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}> {/*paddingを全方向に8*3px設定*/}
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
          onNavigate={() => onNavigate(task.id)} // ページ遷移のための関数を渡す
        />
      ))}
    </Box>
  );
};