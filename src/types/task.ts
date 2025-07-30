import { z } from 'zod';

// Zodスキーマを定義
export const taskFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です。').max(20, 'タイトルは20文字以内で入力してください。'),
  description: z.string().max(50, '説明は50文字以内で入力してください。')
    .regex(/^[^\x01-\x7E\xA1-\xDF]*$/, '説明に半角英数字は使用できません。').optional(),
  completed: z.boolean().optional(),
  dueDate: z.date().min(new Date(), '期限は現在以降の日付を指定してください。'),
});

// スキーマからTypeScriptの型を生成
export type TaskFormValues = z.infer<typeof taskFormSchema>;