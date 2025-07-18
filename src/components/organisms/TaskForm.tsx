import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button } from '@mui/material';
import { ControlledTextField } from '../molecules/ControlledTextField';

// 1. Zodでフォームのバリデーションスキーマを定義
//z.型().制約
const taskFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です。'), //min(1,'1未満の時に表示される文字列')
  description: z.string().optional(),             //.optional()任意入力
  completed: z.boolean().optional(),
  dueDate: z.string().min(1,'期日は必須です')
});

// 2. スキーマからTypeScriptの型を生成
type TaskFormValues = z.infer<typeof taskFormSchema>;

// 3. このコンポーネントが受け取るPropsの型を定義
interface TaskFormProps {
  onSubmit: SubmitHandler<TaskFormValues>; // フォーム送信時の処理
  initialValues?: Partial<TaskFormValues>; // フォームの初期値（編集時に使用）
  submitButtonText?: string; // 送信ボタンのテキスト
  isSubmitting?: boolean; // 送信処理中かどうか
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText = '送信',
  isSubmitting = false,
}) => {
  // 4. useFormフックでフォームの状態とメソッドを取得
  const { control, handleSubmit } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialValues || { title: '', description: '' },
  });

  return (
    // 5. handleSubmitでonSubmitをラップしてフォームに渡す
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}
    >
      <ControlledTextField
        name="title"
        control={control}
        label="タイトル"
        required
      />
      
      <ControlledTextField
        name="description"
        control={control}
        label="詳細"
        multiline
        rows={5}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 2, alignSelf: 'flex-start' }}
      >
        {isSubmitting ? '送信中...' : submitButtonText}
      </Button>
    </Box>
  );
};