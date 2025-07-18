import type { Meta, StoryObj } from '@storybook/react';
import { TaskItem } from './TaskItem';

// コンポーネントの基本情報を定義
const meta: Meta<typeof TaskItem> = {
  title: 'Molecules/TaskItem', // Storybook上での表示名
  component: TaskItem,
  argTypes: { // Propsの振る舞いを定義
    onToggleCompleted: { action: 'toggled' },
    onDelete: { action: 'deleted' },
  },
};

export default meta;
type Story = StoryObj<typeof TaskItem>;

// 「未完了」状態のストーリー
export const Default: Story = {
  args: {
    id: 1,
    title: 'Storybookを導入する',
    dueDate: '2025-07-18T10:00:00Z',
    completed: false,
  },
};

// 「完了済み」状態のストーリー
export const Completed: Story = {
  args: {
    ...Default.args, // Defaultの値を引き継ぐ
    completed: true,
  },
};