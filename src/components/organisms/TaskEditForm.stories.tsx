import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { TaskEditForm } from './TaskEditForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from '@mui/material';

const meta = {
  title: 'Forms/TaskEditForm',
  component: TaskEditForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ maxWidth: 400, m: 2, p: 2, border: '1px dashed grey' }}>
          <Story />
        </Box>
      </LocalizationProvider>
    ),
  ],
  argTypes: {
    isSubmitting: { control: 'boolean' },
  },
} satisfies Meta<typeof TaskEditForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// 1. 基本的なStory (初期値あり)
export const Default: Story = {
  args: {
    onSubmit: action('onSubmit'),
    initialValues: {
      title: '既存のタスクタイトル',
      description: 'これは編集画面の初期値です。',
      completed: false,
      dueDate: new Date('2026-01-01T12:00:00'),
    },
    isSubmitting: false,
  },
};

// 2. 更新中のStory
export const Submitting: Story = {
  args: {
    ...Default.args, // Defaultのargsを継承
    isSubmitting: true, // isSubmittingだけtrueに上書き
  },
};

// 3. 初期値なしの場合のStory
export const WithoutInitialValues: Story = {
  args: {
    onSubmit: action('onSubmit'),
    isSubmitting: false,
    // initialValuesを渡さないケース
  },
};