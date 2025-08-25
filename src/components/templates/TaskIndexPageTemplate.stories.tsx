import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TaskIndexPageTemplate } from './TaskIndexPageTemplate';
import type { UiTask } from '../../types/task';

const meta: Meta<typeof TaskIndexPageTemplate> = {
  title: 'Templates/TaskIndexPageTemplate',
  component: TaskIndexPageTemplate,
  // テンプレート内のTaskList/TaskItemが<Link>を持つため、RouterのContextが必要
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  // 各関数の呼び出しをActionsパネルで確認
  argTypes: {
    onToggleCompleted: { action: 'onToggleCompleted' },
    onDelete: { action: 'onDelete' },
    onNavigate: { action: 'onNavigate' },
    onCloseDialog: { action: 'onCloseDialog' },
    onConfirmDelete: { action: 'onConfirmDelete' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- モックデータ ---
const mockTasks: UiTask[] = [
  { id: '1', title: 'Storybookのストーリーを書く', completed: true, dueDate: '2025-08-20T10:00:00Z' },
  { id: '2', title: 'コンポーネントを実装する', completed: false, dueDate: '2025-08-21T11:00:00Z' },
  { id: '3', title: 'テストを書く', completed: false, dueDate: '2025-08-22T12:00:00Z' },
];


// --- 各ストーリーの定義 ---

// 通常表示の状態
export const Default: Story = {
  args: {
    tasks: mockTasks,
    isDialogOpen: false,
  },
};

// タスクが空の状態
export const Empty: Story = {
  args: {
    tasks: [],
    isDialogOpen: false,
  },
};

// 確認ダイアログが開いている状態
export const DialogOpened: Story = {
  args: {
    tasks: mockTasks,
    isDialogOpen: true,
  },
};