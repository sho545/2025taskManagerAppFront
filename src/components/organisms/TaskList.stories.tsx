import type { Meta, StoryObj } from '@storybook/react';
import { TaskList } from './TaskList';
import type { TaskDto } from '../../apis/api';

// Storybookの基本情報を定義
const meta: Meta<typeof TaskList> = {
  title: 'Organisms/TaskList',
  component: TaskList,
  tags: ['autodocs'],
  // イベントハンドラが呼ばれたことをActionsパネルで確認できるように設定
  argTypes: {
    onToggleCompleted: { action: 'toggled' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type UiTask = Omit<TaskDto, 'id'> & { id: string };
// --- モックデータ ---
const baseTasks: UiTask[] = [
  { id: '1', title: 'UIコンポーネントを作成する', completed: true, dueDate: '2025-07-28T10:00:00Z' },
  { id: '2', title: 'Storybookで表示確認', completed: false, dueDate: '2025-07-29T14:30:00Z' },
  { id: '3', title: 'APIと連携する', completed: false, dueDate: '2025-07-30T18:00:00Z' },
];

// --- 各ストーリーの定義 ---

// 複数のタスクが存在する状態のストーリー
export const WithTasks: Story = {
  args: {
    tasks: baseTasks,
  },
};

// タスクが一つもない状態のストーリー
export const Empty: Story = {
  args: {
    tasks: [],
  },
};