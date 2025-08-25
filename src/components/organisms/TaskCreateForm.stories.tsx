import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { TaskCreateForm } from './TaskCreateForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box } from '@mui/material';

// 1. メタ情報の定義
const meta = {
  title: 'Forms/TaskCreateForm',
  component: TaskCreateForm,
  tags: ['autodocs'],
  // MUI DatePickerが動作するために、DecoratorでProviderを適用
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ maxWidth: 400, m: 2, p: 2, border: '1px dashed grey' }}>
          <Story />
        </Box>
      </LocalizationProvider>
    ),
  ],
  // Propsの型情報をStorybookに教える
  argTypes: {
    isSubmitting: { control: 'boolean' },
  },
} satisfies Meta<typeof TaskCreateForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// 2. 基本的なStory (デフォルト状態)
export const Default: Story = {
  args: {
    // action()は、関数が呼ばれたことをStorybookのUIで確認できるようにするヘルパー
    onSubmit: action('onSubmit'),
    isSubmitting: false,
  },
};

// 3. 送信中のStory
export const Submitting: Story = {
  args: {
    onSubmit: action('onSubmit'),
    isSubmitting: true, // isSubmittingをtrueに設定
  },
};