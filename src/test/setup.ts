import { vi } from 'vitest';
// APIクライアントのモジュール全体をモック化
vi.mock('../apis/client', () => ({
  tasksApi: {
    tasksIdGet: vi.fn(),
    tasksIdPut: vi.fn(),
    tasksIdDelete: vi.fn(),
    tasksPost: vi.fn(),
    tasksGet: vi.fn(),
    
  },
}));