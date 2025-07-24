import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { ConfirmationDialog } from './ConfirmationDialog';

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Organisms/ConfirmationDialog',
  component: ConfirmationDialog,
  tags: ['autodocs'],
  argTypes: {
    // openはストーリー内部のstateで管理するため、UIコントロールを無効化
    open: { control: { disable: true } },
    onClose: { action: 'closed' },
    onConfirm: { action: 'confirmed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- ストーリーの定義 ---

export const Default: Story = {
  // render関数を使って、ダイアログの開閉ロジックをストーリー内に実装
  render: (args) => {
    const [open, setOpen] = useState(false); //openという名前の状態を作って初期値falseこの操作にはsetOpenを使用

    const handleConfirm = () => {
      // StorybookのActionsパネルにログを出力
      args.onConfirm();
      setOpen(false);
    };

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          ダイアログを開く
        </Button>
        <ConfirmationDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      </>
    );
  },
  args: {
    title: '削除の確認',
    message: '本当にこの項目を削除しますか？この操作は取り消せません。',
  },
};