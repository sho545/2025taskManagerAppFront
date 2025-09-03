import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TaskDetailPageTemplate } from './TaskDetailPageTemplate';
import type { UiTask } from '../../types/task';

const meta: Meta<typeof TaskDetailPageTemplate> = {
  title: 'Templates/TaskDetailPageTemplate',
  component: TaskDetailPageTemplate,
  // テンプレート内のTaskDetailが<Link>を持つため、RouterのContextが必要
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/tasks/1']}>
        <Routes>
          <Route path="/tasks/:taskId" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  // 各関数の呼び出しをActionsパネルで確認
  argTypes: {
    onDelete: { action: 'onDelete triggered' },
    onCloseDialog: { action: 'onCloseDialog triggered' },
    onConfirmDelete: { action: 'onConfirmDelete triggered' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- モックデータ ---
const mockTask: UiTask = {
  id: '1',
  title: 'テンプレートのストーリーを作成',
  description: 'これはUI表示用のテンプレートコンポーネントです。',
  completed: false,
  dueDate: '2025-08-15T10:00:00Z',
};


// --- 各ストーリーの定義 ---

// 通常表示の状態
export const Default: Story = {
  args: {
    task: mockTask,
    isDialogOpen: false,
  },
};

// 確認ダイアログが開いている状態
export const DialogOpened: Story = {
  args: {
    task: mockTask,
    isDialogOpen: true,
  },
};