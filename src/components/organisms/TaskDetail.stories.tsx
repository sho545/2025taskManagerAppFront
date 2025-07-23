import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


import { TaskDetail } from './TaskDetail';

const meta: Meta<typeof TaskDetail> = {
  title: 'Organisms/TaskDetail',
  component: TaskDetail,
  // Linkコンポーネントを動作させるためにdecoratorを追加
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    onDelete: { action: 'deleted' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- 各ストーリーの定義 ---
const baseTask = {
  id: 1,
  title: 'タスクの詳細画面を作成する',
  description: 'MUIとAtomic Designを使って、詳細表示用のOrganismを実装する。',
  completed: false,
  dueDate: '2025-07-25T12:00:00Z',
};

// 未完了状態のタスク
export const Default: Story = {
  args: {
    task: baseTask
  },
};

// 完了状態のタスク
export const Completed: Story = {
  args: {
    ...Default.args,
    task: {
      ...baseTask,
      completed: true,
    },
  },
};

// 詳細がないタスク
export const WithoutDescription: Story = {
  args: {
    ...Default.args,
    task: {
      ...baseTask,
      description: '',
    },
  },
};


// ロード中の状態
export const Loading: Story = {
  args: {
    task: null,
  },
};