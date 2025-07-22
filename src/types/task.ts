import { z } from 'zod';

// Zodスキーマを定義
export const taskFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です。'),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.date(),
});

// スキーマからTypeScriptの型を生成
export type TaskFormValues = z.infer<typeof taskFormSchema>;