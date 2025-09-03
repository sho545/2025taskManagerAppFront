import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  CircularProgress } from '@mui/material';

import { useTasks } from '../hooks/useTasks';
import { type TaskFormValues } from '../types/task';
import { TaskEditPageTemplate } from '../components/templates/TaskEditPageTemplate';

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
        title: existingTask.title || '',
        description: existingTask.description,
        completed: existingTask.completed,
        dueDate: new Date(existingTask.dueDate || new Date()),
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
    <TaskEditPageTemplate
      isEditMode={isEditMode}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
    />
  );
};