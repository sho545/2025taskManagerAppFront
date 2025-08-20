
import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
//import { useNavigate } from 'react-router-dom';

import { tasksApi } from '../libs/apiClient';
import type { TaskFormValues } from '../types/task';
import type { TaskDto } from '../apis';


type UpdateVariables = { taskId: string; task: TaskFormValues };
// useTasksフックが受け取るオプションの型を定義(pagesから渡されるprops)
interface UseTasksOptions {
  taskId?: string;
  createTaskOptions?: UseMutationOptions<TaskDto, Error, TaskFormValues>;
  updateTaskOptions?: UseMutationOptions<TaskDto, Error, { taskId: string; task: TaskFormValues }>;
}
/**
 * タスク関連のすべてのデータ操作を管理するカスタムフック
 */
export const useTasks = (options: UseTasksOptions = {}) => {
  const { taskId, createTaskOptions, updateTaskOptions } = options;
  const queryClient = useQueryClient();

  // --- クエリ (データ取得) ---

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.tasksGet(),
    select: (response) => response.data,
  });

  const taskQuery = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => {
      const parsedId = parseInt(taskId!, 10);
      return tasksApi.tasksIdGet(parsedId);
    },
    enabled: !!taskId,
    select: (response) => response.data,
  });

  // --- ミューテーション (データ変更) ---
  const { onSuccess: onExternalSuccess, ...restCreateTaskOptions } = createTaskOptions || {};
  const createTaskMutation = useMutation<TaskDto, Error, TaskFormValues>({
    mutationFn: async (newTask: TaskFormValues) => {
      const payload = { ...newTask, dueDate: newTask.dueDate.toISOString() };
      const response = await tasksApi.tasksPost(payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      //navigate('/');
      if (onExternalSuccess) {
        onExternalSuccess(data, variables, context);
      }
    },
    ...restCreateTaskOptions,
  });

  const { onSuccess: onExternalSuccess1, ...restUpdateTaskOptions } = updateTaskOptions || {};
  const updateTaskMutation = useMutation<TaskDto, Error, UpdateVariables>({
    //asyncは非同期処理を表すキーワード(awaitが使えるようになる)
    // {...}...のプロパティを持つojを引数として受け取る
    mutationFn: async ({ taskId, task }) => {
      const payload = { ...task, dueDate: task.dueDate.toISOString() };
      //awitがないとtasksApi~(非同期処理)が終わる前に次の処理が行われる(非同期処理(:Promiseオブジェクトを返す)にはawait)
      const response = await tasksApi.tasksIdPut(parseInt(taskId, 10), payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      const taskId = variables.taskId; ;
      //古いキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      //navigate(`/tasks/${id}`);
      //onSuccess処理を受け取ったらそれを実行
      if (onExternalSuccess1) {
        onExternalSuccess1(data, variables, context);
      }
    },
    //onSuccess以外のpropsもobjとしてupdateTaskMutationに格納しておく
    ...restUpdateTaskOptions,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => {
      const parsedId = parseInt(id, 10);
      return tasksApi.tasksIdDelete(parsedId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      //navigate('/');
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