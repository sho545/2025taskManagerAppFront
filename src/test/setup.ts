import { vi } from 'vitest';
// APIクライアントのモジュール全体をモック化
vi.mock('../libs/apiClient', () => ({
  tasksApi: {
    tasksIdGet: vi.fn(),
    tasksIdPut: vi.fn(),
    tasksIdDelete: vi.fn(),
    tasksPost: vi.fn(),
    tasksGet: vi.fn(),
    
  },
}));