import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';

import { useTasks } from '../hooks/useTasks';
import { TaskDetailPageTemplate } from '../components/templates/TaskDetailPageTemplate';

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
    <TaskDetailPageTemplate
      task={uiTask}
      isLoading={isLoading}
      isError={isError}
      isDialogOpen={isDialogOpen}
      onDelete={handleDelete}
      onCloseDialog={() => setIsDialogOpen(false)}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};