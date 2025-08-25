import React, { useMemo, useState } from 'react';
import { CircularProgress, Alert } from '@mui/material';

// 必要なカスタムフックをインポート
import { useTasks } from '../hooks/useTasks';

import type { TaskFormValues } from '../types/task';
import { useNavigate } from 'react-router-dom';
import { TaskIndexPageTemplate } from '../components/templates/TaskIndexPageTemplate';

export const TaskIndexPage: React.FC = () => {
  // --- データフェッチと更新ロジック ---
  const { tasksQuery, updateTaskMutation, deleteTaskMutation } = useTasks();
  const tasksDto = tasksQuery.data;
  const isLoading = tasksQuery.isLoading;
  const isError = tasksQuery.isError;

  // APIデータ(TaskDto)をUI用の型(UiTask)に変換
  const uiTasks = useMemo(() => {
    if (!tasksDto) return [];
    return tasksDto.map(task => ({
      ...task,
      id: String(task.id), // idをnumberからstringに変換
    }));
  }, [tasksDto]);

  // TaskItemのチェックボックスが変更されたときの処理
  const handleToggleCompleted = (id: string) => {
    const targetTask = tasksDto?.find(task => String(task.id) === id);
    if (targetTask) {
        // dueDateを文字列からDateオブジェクトに変換
        const taskAsFormValues: TaskFormValues = {
        title: targetTask.title || '',
        description: targetTask.description,
        completed: targetTask.completed,
        dueDate: new Date(targetTask.dueDate!),
        };
        updateTaskMutation.mutate({
            taskId: String(targetTask.id),
            task: { ...taskAsFormValues, completed: !targetTask.completed },
        });
    }
  };

 // 1. ダイアログの開閉と、削除対象IDを管理するStateを追加
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  // 2. handleDeleteは、ダイアログを開くだけの役割に変更
  const handleDelete = (id: string) => {
    setTargetId(id);
    setIsDialogOpen(true);
  };

  // 3. 確認ダイアログで「はい」が押されたときに実行する関数を新設
  const handleConfirmDelete = () => {
    if (targetId) {
      deleteTaskMutation.mutate(targetId);
    }
    setIsDialogOpen(false);
  };

  const navigate = useNavigate();
  // 4. TaskItemに渡すためのページ遷移関数
  const handleNavigate = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  // --- UIの描画 ---
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">タスク一覧の読み込みに失敗しました。</Alert>;
  }

  return (
    <TaskIndexPageTemplate
      tasks={uiTasks}
      isDialogOpen={isDialogOpen}
      onToggleCompleted={handleToggleCompleted}
      onDelete={handleDelete}
      onNavigate={handleNavigate}
      onCloseDialog={() => setIsDialogOpen(false)}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};