
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { tasksApi } from '../apis/client';
import type { TaskFormValues } from '../types/task';

/**
 * タスク関連のすべてのデータ操作を管理するカスタムフック
 */
export const useTasks = (id?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- クエリ (データ取得) ---

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.tasksGet(),
    select: (response) => response.data,
  });

  const taskQuery = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => {
      const parsedId = parseInt(id!, 10);
      return tasksApi.tasksIdGet(parsedId);
    },
    enabled: !!id,
    select: (response) => response.data,
  });

  // --- ミューテーション (データ変更) ---

  const createTaskMutation = useMutation({
    mutationFn: (newTask: TaskFormValues) => {
      const payload = { ...newTask, dueDate: newTask.dueDate.toISOString() };
      return tasksApi.tasksPost(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string, task: TaskFormValues }) => {
      const payload = { ...task, dueDate: task.dueDate.toISOString() };
      return tasksApi.tasksIdPut(parseInt(id, 10), payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      navigate(`/tasks/${id}`);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => {
      const parsedId = parseInt(id, 10);
      return tasksApi.tasksIdDelete(parsedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });

  // --- 返り値 ---
  // 必要なものをすべてオブジェクトとして返す
  return {
    tasksQuery,
    taskQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};