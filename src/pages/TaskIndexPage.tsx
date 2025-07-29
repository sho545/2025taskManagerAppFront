import React, { useMemo, useState } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';

// 必要なカスタムフックをインポート
import { useTasks } from '../hooks/useTasks';

import { TaskList } from '../components/organisms/TaskList';
import type { TaskFormValues } from '../types/task';
import { ConfirmationDialog } from '../components/organisms/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

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
            id: String(targetTask.id),
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
    <Box>
      <Typography variant="h4" gutterBottom>
        タスク一覧
      </Typography>
      <TaskList
        tasks={uiTasks}
        onToggleCompleted={handleToggleCompleted}
        onDelete={handleDelete}
        onNavigate={handleNavigate} // ページ遷移のための関数を渡す
      />
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