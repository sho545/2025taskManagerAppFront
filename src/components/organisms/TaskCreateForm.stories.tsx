import type { Meta, StoryObj } from '@storybook/react';
import { TaskCreateForm } from './TaskCreateForm';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { userEvent, within, expect, fn, screen } from '@storybook/test';
import dayjs from 'dayjs';

// 1. メタ情報の定義
const meta = {
  title: 'Forms/TaskCreateForm',
  component: TaskCreateForm,
  tags: ['autodocs'],
  // MUI DatePickerが動作するために、DecoratorでProviderを適用
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    //onSubmit: action('onSubmit'),
    onSubmit: () => {},
    isSubmitting: false,
  },
};

// 3. 送信中のStory
export const Submitting: Story = {
  args: {
    //onSubmit: action('onSubmit'),
    onSubmit: () => {},
    isSubmitting: true, // isSubmittingをtrueに設定
  },
};

// 3. バリデーションをテストするストーリーを定義
// タイトルが空の状態で送信してエラーメッセージを表示
export const EmptyTitleError: Story = {
  // Defaultストーリーを元にする
  ...Default,
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  // play関数でテストを記述
  play: async ({ canvasElement }) => {
    // 4. Arrange (準備): 操作対象の要素を取得
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /登録する/i });
    
    // 5. Act (実行): 送信ボタンをクリック
    await userEvent.click(submitButton);

    // 6. Assert (検証): エラーメッセージが表示されたことを確認
    const errorMessage = await canvas.findByText('タイトルは必須です。');
    await expect(errorMessage).toBeInTheDocument();
  },
};

//タイトルが20文字超えでエラー
export const TitleTooLongError: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByLabelText(/タイトル/i);
    await userEvent.type(titleInput, 'a'.repeat(21));
    const submitButton = canvas.getByRole('button', { name: /登録する/i });
    await userEvent.click(submitButton);
    const errorMessage = await canvas.findByText('タイトルは20文字以内で入力してください。');
    await expect(errorMessage).toBeInTheDocument();
  },
};

//説明に半角文字が入っている場合のエラー
export const DescriptionHalfWidthError: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const descriptionInput = canvas.getByLabelText(/詳細/i);
    await userEvent.type(descriptionInput, 'half-width text');
    const submitButton = canvas.getByRole('button', { name: /登録する/i });
    await userEvent.click(submitButton);
    const errorMessage = await canvas.findByText('説明に半角英数字は使用できません。');
    await expect(errorMessage).toBeInTheDocument();
  },
};

//説明が50文字超えでエラー
export const DescriptionTooLongError: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const descriptionInput = canvas.getByLabelText(/詳細/i);
    await userEvent.type(descriptionInput, 'あ'.repeat(51));
    const submitButton = canvas.getByRole('button', { name: /登録する/i });
    await userEvent.click(submitButton);
    const errorMessage = await canvas.findByText('説明は50文字以内で入力してください。');
    await expect(errorMessage).toBeInTheDocument();
  }
};

//期日に過去日時を指定してエラー
export const DueDateInPastError: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ args }) => {

    // --- 1. フォームを埋める ---
    await userEvent.type(screen.getByLabelText(/タイトル/i), '有効なタイトル');

    const yesterday = dayjs().subtract(1, 'day');
    //const yesterday = dayjs('2025-09-01T13:30:00');
    const today = dayjs();
    
    // カレンダーを開く
    await userEvent.click(screen.getByLabelText(/Choose date/i));

    // ★★★ 月が違う場合のみ「前月へ」をクリック ★★★
    if (!today.isSame(yesterday, 'month')) {
      await userEvent.click(screen.getByLabelText('Previous month'));
    }
    
    // 年・日を選択
    await userEvent.click(await screen.findByRole('gridcell', { name: yesterday.format('D') }));

    // ★★★ 時刻を選択 ★★★
    await userEvent.click(await screen.findByRole('option', { name: new RegExp(`^${yesterday.format('h')} hours$`) }));
    await userEvent.click(await screen.findByRole('option', { name: '0 minutes'}));
    await userEvent.click(screen.getByRole('option', { name: yesterday.format('A') }));
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));

    // --- 2. 送信する ---
    await userEvent.click(screen.getByRole('button', { name: /登録する/i }));

    // --- 3. 検証する ---
    // エラーメッセージが表示されることを確認
    await expect(await screen.findByText('期限は現在以降の日付を指定してください。')).toBeInTheDocument();
    // onSubmitが呼ばれていないことを確認
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

//有効な入力のテスト
export const SuccessfulSubmit: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // --- 1. フォームに有効なデータを入力 ---
    const title = '正常なタスク';
    const description = 'これは有効な説明です。';
    
    await user.type(canvas.getByLabelText(/タイトル/i), title);
    await user.type(canvas.getByLabelText(/詳細/i), description);

    // --- 3. 送信する ---
    await user.click(canvas.getByRole('button', { name: /登録する/i }));

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



