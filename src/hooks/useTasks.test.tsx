import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query';
import { tasksApi } from '../libs/apiClient';
import { useTasks } from './useTasks';
import type { TaskDto } from '../apis';

vi.mock('../libs/apiClient', () => ({
  tasksApi: {
    tasksIdGet: vi.fn(),
    tasksIdPut: vi.fn(),
    tasksIdDelete: vi.fn(),
    tasksPost: vi.fn(),
    tasksGet: vi.fn(),
    
  },
}));

describe('useTasks', () => {
  const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  };
  let queryClient: QueryClient;
  beforeEach(() => {
    // 各テストの前に、すべてのモックをリセット
    vi.clearAllMocks();
    // 各テストの前に新しいインスタンスを生成して独立性を保つ
    queryClient = new QueryClient(queryClientConfig);
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

  // --- クエリのテスト ---
  it('tasksQuery should fetch all tasks', async () => {
    // Given: tasksGetが返すダミーデータを準備
    const mockTasks: TaskDto[] = [{ id: 1, title: 'Test Task', completed: false, dueDate: new Date().toISOString() }];
    const mockResponse = {
      data: mockTasks,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };
    vi.mocked(tasksApi.tasksGet).mockResolvedValue(mockResponse);

    // When: フックをレンダリング
    const { result } = renderHook(() => useTasks(), { wrapper });

    // Then: データが正しく取得されるのを待つ
    await waitFor(() => expect(result.current.tasksQuery.isSuccess).toBe(true));

    expect(tasksApi.tasksGet).toHaveBeenCalledTimes(1);
    expect(result.current.tasksQuery.data).toEqual(mockTasks);
  });

  it('taskQuery should fetch a single task when taskId is provided', async () => {
    // Given
    const mockTask: TaskDto = { id: 1, title: 'Single Task', completed: false, dueDate: new Date().toISOString() };
    const mockResponse = {
      data: mockTask,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any, // configは複雑なのでanyで回避
    };
    vi.mocked(tasksApi.tasksIdGet).mockResolvedValue(mockResponse);

    // When
    const { result } = renderHook(() => useTasks({ taskId: '1' }), { wrapper });

    // Then
    await waitFor(() => expect(result.current.taskQuery.isSuccess).toBe(true));

    expect(tasksApi.tasksIdGet).toHaveBeenCalledWith(1);
    expect(result.current.taskQuery.data).toEqual(mockTask);
  });

  // --- ミューテーションのテスト ---
  it('createTaskMutation should call tasksPost and invalidate queries', async () => {
    // Given
    const newTask = { title: 'New Task', dueDate: new Date() };
    const createdTask: TaskDto = { id: 2, ...newTask, completed: false, dueDate: newTask.dueDate.toISOString() };
    const mockResponse = {
      data: createdTask,
      status: 201, // POST成功時は 201 Created
      statusText: 'Created',
      headers: {},
      config: {} as any, // configは複雑なのでanyで回避
    };
    vi.mocked(tasksApi.tasksPost).mockResolvedValue(mockResponse);

    // When
    const { result } = renderHook(() => useTasks(), { wrapper });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    
    await act(async () => {
      await result.current.createTaskMutation.mutateAsync(newTask);
    });

    // Then
    expect(tasksApi.tasksPost).toHaveBeenCalledWith({
      ...newTask,
      dueDate: newTask.dueDate.toISOString(),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
  });

  it('updateTaskMutation should call tasksIdPut and invalidate queries', async () => {
    // Given
    const taskUpdate = { title: 'Updated Task', dueDate: new Date() };
    const updatedTask: TaskDto = { id: 1, ...taskUpdate, completed: false, dueDate: taskUpdate.dueDate.toISOString() };
    const mockResponse = {
      data: updatedTask,
      status: 200, // PUT成功時は 200 OK
      statusText: 'OK',
      headers: {},
      config: {} as any, // configは複雑なのでanyで回避
    };
    vi.mocked(tasksApi.tasksIdPut).mockResolvedValue(mockResponse);
    
    // When
    const { result } = renderHook(() => useTasks(), { wrapper });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await act(async () => {
      await result.current.updateTaskMutation.mutateAsync({ taskId: '1', task: taskUpdate });
    });

    // Then
    expect(tasksApi.tasksIdPut).toHaveBeenCalledWith(1, {
      ...taskUpdate,
      dueDate: taskUpdate.dueDate.toISOString(),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks', '1'] });
  });

  it('deleteTaskMutation should call tasksIdDelete and invalidate queries', async () => {
    // Given
    vi.mocked(tasksApi.tasksIdDelete).mockResolvedValue({} as any);

    // When
    const { result } = renderHook(() => useTasks(), { wrapper });
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await act(async () => {
      await result.current.deleteTaskMutation.mutateAsync('1');
    });

    // Then
    expect(tasksApi.tasksIdDelete).toHaveBeenCalledWith(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
  });
});

