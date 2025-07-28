import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { tasksApi } from '../apis/client'; 
import type { TaskFormValues } from '../types/task';

/**
 * タスク一覧を取得するためのカスタムフック
 */
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'], // このクエリの一意なキー。このキーで取得したデータをキャッシュ。useQuery({queryKey: ['tasks']})で利用
    queryFn: () => tasksApi.tasksGet(), // データをフェッチする関数
    select: (response) => response.data,
  });
};

/**
 * IDを指定して単一のタスクを取得するためのカスタムフック
 * @param id - タスクのID
 */
export const useTask = (id: string | undefined) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => {
      const parsedId = parseInt(id!, 10) ;
      return tasksApi.tasksIdGet(parsedId!) ;
    },
    enabled: !!id, // idが存在する場合のみクエリを実行
    select: (response) => response.data,
  });
};

/**
 * タスクを新規作成するためのカスタムフック
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient(); //キャッシュ管理ツール
  const navigate = useNavigate();       //ページ遷移のためのフック

  return useMutation({
    mutationFn: (formDate: TaskFormValues) => {
      const payload = {
        ...formDate,
        dueDate: formDate.dueDate.toISOString(), // 日付をISO文字列に変換
      }
      return tasksApi.tasksPost(payload);
    },
    onSuccess: () => {
      // キャッシュを無効化し、タスク一覧を再取得させる
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // タスク一覧ページに遷移
      navigate('/');
    },
    onError: (error) => {
      // エラーハンドリング
      console.error('Failed to create task:', error);
    },
  });
};

/**
 * タスクを更新するためのカスタムフック
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, task }: { id: string, task: TaskFormValues }) => {
      const payload = {
        ...task,
        dueDate: task.dueDate.toISOString(), // 日付をISO文字列に変換
        }
      return tasksApi.tasksIdPut(parseInt(id,10), payload);
    },
    onSuccess: (_, { id }) => { //_で関数で使わないことを表す
      // タスク一覧と、更新したタスク詳細の両方のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      // 更新したタスクの詳細ページに遷移
      navigate(`/tasks/${id}`);
    },
  });
};

/**
 * タスクを削除するためのカスタムフック
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => {
      const parsedId = parseInt(id, 10);
      return tasksApi.tasksIdDelete(parsedId) ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
};