import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';

import { TaskDetail } from '../components/organisms/TaskDetail';
import { ConfirmationDialog } from '../components/organisms/ConfirmationDialog';
import { useTasks } from '../hooks/useTasks';

// 親からPropsを受け取る定義を削除し、純粋なページコンポーネントにする
export const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();

  // このページが必要とするロジックをここで呼び出す
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { taskQuery, deleteTaskMutation } = useTasks({taskId});
  const task = taskQuery.data;
  const isLoading = taskQuery.isLoading; 
  const isError = taskQuery.isError;
  

  const uiTask = useMemo(() => {
    if (!task) return null;
    return { ...task, id: String(task.id) };
  }, [task]);

  const handleDelete = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // 削除の際には必ずtaskIdが存在することを確認
    if (taskId) {
      deleteTaskMutation.mutate(taskId!,{onSuccess: () => {navigate('/')}});
    }
    setIsDialogOpen(false);
  };

  if (isLoading) { return <CircularProgress />; }
  if (isError) { return <Alert severity="error">タスクの読み込みに失敗しました。</Alert>; }

  return (
    <Box>
      <TaskDetail task={uiTask} onDelete={handleDelete} />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="削除の確認"
        message="本当にこのタスクを削除しますか？"
      />
    </Box>
  );
};