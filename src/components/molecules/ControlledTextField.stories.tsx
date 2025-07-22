import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Box } from '@mui/material';

import { ControlledTextField } from './ControlledTextField';
import { taskFormSchema, type TaskFormValues } from '../../types/task';

// // --- Storybook用のセットアップ ---

// // テスト用のZodスキーマとTypeScriptの型を定義
// const schema = z.object({
//   title: z.string().min(1, 'この項目は必須です'),
//   description: z.string().optional(),
// });
// type Schema = z.infer<typeof schema>;

// Storybookの基本情報を定義
const meta: Meta<typeof ControlledTextField> = {
  title: 'Molecules/ControlledTextField',
  component: ControlledTextField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ControlledTextField>;

// --- 各ストーリーの定義 ---

export const Default: Story = {
  // 各ストーリーが自身の描画ロジックを持つ
  render: (args) => {
    const { control, handleSubmit } = useForm<TaskFormValues>({
      resolver: zodResolver(taskFormSchema),
      defaultValues: {
        title: '',
        description: '',
        completed: false,
        dueDate: new Date(), // Dateオブジェクトで初期化
      },
    });
    return (
      <Box component="form" onSubmit={handleSubmit(() => {})} sx={{width: 300}}>
        <ControlledTextField {...args} control={control} />
      </Box>
    );
  },
  args: {
    name: 'title',
    label: 'タスク名',
  },
};

export const WithError: Story = {
  render: (args) => {
    const { control, handleSubmit } = useForm<TaskFormValues>({
      resolver: zodResolver(taskFormSchema),
    });
    return (
      <Box component="form" onSubmit={handleSubmit(() => {})} sx={{width: 300}}>
        <ControlledTextField {...args} control={control} />
        <Button type="submit">Submit</Button>
      </Box>
    );
  },
  args: {
    name: 'title',
    label: '必須項目',
    required: true,
  },
};

export const WithInitialValue: Story = {
  render: (args) => {
    const { control } = useForm<TaskFormValues>({
      defaultValues: { title: 'タスク管理アプリ制作' },
    });
    return (
      <Box sx={{width: 300}}>
        <ControlledTextField {...args} control={control} />
      </Box>
    );
  },
  args: {
    name: 'title',
    label: '名',
  },
};

export const Multiline: Story = {
  render: (args) => {
    const { control } = useForm<TaskFormValues>({
      defaultValues: { description: '複数行のテキストエリア' },
    });
    return (
      <Box sx={{width: 300}}>
        <ControlledTextField {...args} control={control} />
      </Box>
    );
  },
  args: {
    name: 'description',
    label: '詳細',
    multiline: true,
    rows: 4,
  },
};