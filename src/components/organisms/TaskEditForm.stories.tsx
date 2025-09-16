import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { TaskEditForm } from './TaskEditForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import type { TaskFormValues } from '../../types/task';
import { expect, fn, userEvent, within, screen } from '@storybook/test';

const meta = {
  title: 'Forms/TaskEditForm',
  component: TaskEditForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ maxWidth: 400, m: 2, p: 2, border: '1px dashed grey' }}>
          <Story />
        </Box>
      </LocalizationProvider>
    ),
  ],
  argTypes: {
    isSubmitting: { control: 'boolean' },
    initialValues: { control: 'object' },
  },
} satisfies Meta<typeof TaskEditForm>;


export default meta;

type Story = StoryObj<typeof meta>;

// 編集フォームの初期値を定義
const defaultInitialValues: TaskFormValues = {
  title: '既存のタスク',
  description: 'これは編集画面の初期値です。',
  completed: false,
  dueDate: dayjs().add(1, 'day').toISOString(), // 未来の日付
};

// 1. 基本的なStory (初期値あり)
export const Default: Story = {
  args: {
    onSubmit: action('onSubmit'),
    initialValues: defaultInitialValues,
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

//タイトルが空
export const TitleIsEmptyError: Story = {
  args: {
    // 1. タイトルが空の初期値を渡す
    initialValues: {
      ...defaultInitialValues,
      title: '', 
    },
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 2. 送信ボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: /更新する/i }));

    // 3. 検証
    // エラーメッセージが表示されることを確認
    await expect(await canvas.findByText('タイトルは必須です。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//タイトルが20文字超え
export const TitleLengthIsOver20Error: Story = {
  args: {
    // 1. タイトルが空の初期値を渡す
    initialValues: {
      ...defaultInitialValues,
      title: '123456789012345678901', 
    },
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 2. 送信ボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: /更新する/i }));

    // 3. 検証
    // エラーメッセージが表示されることを確認
    await expect(await canvas.findByText('タイトルは20文字以内で入力してください。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//詳細に半角文字が入ってるとき
export const DescriptionContainsHalfWidthError: Story = {
  args: {
    // 1. タイトルが空の初期値を渡す
    initialValues: {
      ...defaultInitialValues,
      description: 'a', 
    },
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 2. 送信ボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: /更新する/i }));

    // 3. 検証
    // エラーメッセージが表示されることを確認
    await expect(await canvas.findByText('説明に半角英数字は使用できません。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//詳細が50文字超えのとき
export const DescriptionLengthIsOver50Error: Story = {
  args: {
    // 1. タイトルが空の初期値を渡す
    initialValues: {
      ...defaultInitialValues,
      description: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやいゆえよらりるれろわいうえおあ', 
    },
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 2. 送信ボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: /更新する/i }));

    // 3. 検証
    // エラーメッセージが表示されることを確認
    await expect(await canvas.findByText('説明は50文字以内で入力してください。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//期日がデフォルト以前のとき
export const DueDateInPastError: Story = {
  args: {
    onSubmit: fn(),
    initialValues: defaultInitialValues,
    isSubmitting: false,
  },
  play: async ({ args }) => {

    const today = dayjs();
    
    // カレンダーを開く
    await userEvent.click(screen.getByLabelText(/Choose date/i));

    // ★★★ 月が違う場合のみ「前月へ」をクリック ★★★
    if (!today.isSame(today, 'month')) {
      await userEvent.click(screen.getByLabelText('Previous month'));
    }
    
    // 年・日を選択
    await userEvent.click(await screen.findByRole('gridcell', { name: today.format('D') }));

    // ★★★ 時刻を選択 ★★★
    await userEvent.click(await screen.findByRole('option', { name: new RegExp(`^${today.format('h')} hours$`) }));
    await userEvent.click(await screen.findByRole('option', { name: '0 minutes'}));
    await userEvent.click(screen.getByRole('option', { name: today.format('A') }));
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));

    // --- 2. 送信する ---
    await userEvent.click(screen.getByRole('button', { name: /更新する/i }));

    // --- 3. 検証する ---
    // エラーメッセージが表示されることを確認
    await expect(await screen.findByText('元の期日より前の日時は設定できません。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//有効な入力のテスト
export const SuccessfulSubmit: Story = {
  args: {
    onSubmit: fn(),
    initialValues: defaultInitialValues,
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // --- 1. フォームに有効なデータを入力 ---
    const title = '正常なタスク';
    const description = 'これは有効な説明です。';

    const titleInput = canvas.getByLabelText(/タイトル/i);
    // ★★★ 先にクリアする ★★★
    await user.clear(titleInput);
    await user.type(titleInput, title);
    
    const descriptionInput = canvas.getByLabelText(/詳細/i);
    // ★★★ 先にクリアする ★★★
    await user.clear(descriptionInput);
    await user.type(descriptionInput, description);

    // --- 3. 送信する ---
    await user.click(canvas.getByRole('button', { name: /更新する/i }));

    // --- 4. 検証する ---
    // onSubmitが1回呼ばれたことを確認
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);

    // onSubmitが正しいデータで呼ばれたことを確認
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ // オブジェクトの一部を検証
        title: title,
        description: description,
      }),
      expect.anything() // 第2引数（イベントオブジェクト）は問わない
    );
  },
};

