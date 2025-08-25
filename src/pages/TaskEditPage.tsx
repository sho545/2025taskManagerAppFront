import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

import { TaskCreateForm } from '../components/organisms/TaskCreateForm';
import { TaskEditForm } from '../components/organisms/TaskEditForm';
import { useTasks } from '../hooks/useTasks';
import { type TaskFormValues } from '../types/task';

export const TaskEditPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const isEditMode = !!taskId; // taskIdがあれば編集モード
  const navigate = useNavigate();

  // --- データフェッチと更新ロジック ---

  // 編集モードの場合のみ、既存のタスクデータを取得
  const { taskQuery, updateTaskMutation, createTaskMutation } = useTasks({
  taskId,
  // 作成成功時の処理
  createTaskOptions: {
    onSuccess: (createdTask) => {
      // APIが返した新しいタスクのIDを元に詳細ページへ飛ぶ
      navigate(`/tasks/${createdTask.id}`);
    },
  },
  // 更新成功時の処理
  updateTaskOptions: {
    onSuccess: () => {
      navigate(`/tasks/${taskId}`);
    },
  },
});
  const existingTask = taskQuery.data;
  const isLoading = taskQuery.isLoading;

  // フォームの初期値を作成 (編集モードの場合のみ)
  const initialValues = isEditMode && existingTask
    ? {
        title: existingTask.title,
        description: existingTask.description,
        completed: existingTask.completed,
        dueDate: new Date(existingTask.dueDate!),
      }
    : undefined;

  // フォーム送信時の処理
  const handleSubmit = (data: TaskFormValues) => {
    if (isEditMode) {
      updateTaskMutation.mutate({ taskId: taskId!, task: data });      
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
      
       {isEditMode ? (
        // 編集モードの場合
        <TaskEditForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          isSubmitting={updateTaskMutation.isPending}
        />
      ) : (
        // 新規作成モードの場合
        <TaskCreateForm
          onSubmit={handleSubmit}
          isSubmitting={createTaskMutation.isPending}
        />
      )}
    </Box>
  );
};