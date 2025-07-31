import { z } from 'zod';

// Zodスキーマを定義
export const baseSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です。').max(20, 'タイトルは20文字以内で入力してください。'),
  description: z.string().max(50, '説明は50文字以内で入力してください。')
    .regex(/^[^\x01-\x7E\xA1-\xDF]*$/, '説明に半角英数字は使用できません。').optional(),
  completed: z.boolean().optional(),
});

//2. 新規登録用のスキーマを作成
export const createTaskSchema = baseSchema.extend({
  // 新規登録時のみ、未来の日付を要求
  dueDate: z.date()
    .min(new Date(), '期限は現在以降の日付を指定してください。'),
});

// 編集用のスキーマを生成する関数に変更
export const createUpdateTaskSchema = (originalDueDate: Date) => {
  return baseSchema.extend({
    // 期限は元の期日以降である必要がある
    dueDate: z.date()
      .min(originalDueDate, '元の期日より前の日時は設定できません。'),
  });
};

// スキーマからTypeScriptの型を生成
export type TaskFormValues = z.infer<typeof createTaskSchema>;