import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

import { TaskForm } from '../components/organisms/TaskForm';
import { useTask, useCreateTask, useUpdateTask } from '../hooks/useTasks';
import type { TaskFormValues } from '../types/task';

export const TaskEditPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const isEditMode = !!taskId; // taskIdがあれば編集モード

  // --- データフェッチと更新ロジック ---

  // 編集モードの場合のみ、既存のタスクデータを取得
  const { data: existingTask, isLoading } = useTask(taskId);

  // フォームの初期値を作成 (編集モードの場合のみ)
  const initialValues = isEditMode && existingTask
    ? {
        title: existingTask.title,
        description: existingTask.description,
        completed: existingTask.completed,
        dueDate: new Date(existingTask.dueDate!),
      }
    : undefined;

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  // フォーム送信時の処理
  const handleSubmit = (data: TaskFormValues) => {
    if (isEditMode) {
      updateTaskMutation.mutate({ id: taskId!, task: data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  // --- UIの描画 ---

  // 編集モードでデータロード中の表示
  if (isEditMode && isLoading) {
    return <CircularProgress />;
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'タスクの編集' : 'タスクの新規作成'}
      </Typography>
      
      <TaskForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitButtonText={isEditMode ? '更新する' : '登録する'}
        isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
      />
    </Box>
  );
};