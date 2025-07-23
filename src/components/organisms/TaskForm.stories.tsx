import type { Meta, StoryObj } from '@storybook/react';
import { TaskForm } from './TaskForm';

// Storybookの基本情報を定義
const meta: Meta<typeof TaskForm> = {
  title: 'Organisms/TaskForm',
  component: TaskForm,
  tags: ['autodocs'],
  // onSubmitが呼ばれた際に、その引数をActionsパネルに出力する
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- 各ストーリーの定義 ---

// 新規登録フォーム用のストーリー
export const CreateForm: Story = {
  args: {
    submitButtonText: '登録する',
    isSubmitting: false,
  },
};

// 編集フォーム用のストーリー
export const EditForm: Story = {
  args: {
    // 編集画面なので、初期値を渡す
    initialValues: {
      title: '既存タスクのタイトル',
      description: 'これが編集前の詳細です。',
      completed: false,
      dueDate: new Date('2025-08-15T14:00:00'),
    },
    submitButtonText: '更新する',
    isSubmitting: false,
  },
};

// 送信中の状態を表現するストーリー
export const Submitting: Story = {
  args: {
    ...EditForm.args, // EditFormの値を引き継ぐ
    isSubmitting: true, // isSubmittingをtrueに
  },
};