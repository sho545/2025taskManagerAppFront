import type { Meta, StoryObj } from '@storybook/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TaskEditPageTemplate } from './TaskEditPageTemplate';
import type { TaskFormValues } from '../../types/task';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const meta: Meta<typeof TaskEditPageTemplate> = {
  title: 'Templates/TaskSavePageTemplate',
  component: TaskEditPageTemplate,
  // DateTimePickerを動作させるためにdecoratorを追加
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Story />
      </LocalizationProvider>
    ),
  ],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- モックデータ ---
const mockInitialValues: TaskFormValues = {
  title: '既存タスクのタイトル',
  description: 'これは編集用の初期値です。',
  completed: true,
  dueDate: dayjs().toISOString(),
};

// --- 各ストーリーの定義 ---

// 新規作成モードの表示
export const CreateMode: Story = {
  args: {
    isEditMode: false,
    isSubmitting: false,
  },
};

// 編集モードの表示
export const EditMode: Story = {
  args: {
    isEditMode: true,
    initialValues: mockInitialValues,
    isSubmitting: false,
  },
};

// 送信中の状態
export const Submitting: Story = {
  args: {
    ...EditMode.args,
    isSubmitting: true,
  },
};