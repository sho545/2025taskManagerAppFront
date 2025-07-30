import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { ControlledTextField } from '../molecules/ControlledTextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { taskFormSchema, type TaskFormValues } from '../../types/task';

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
  submitButtonText = '送信', //親コンポが引数として渡さなかったときのためにdefault値を渡しておく
  isSubmitting = false, 
}) => {
    const isEditMode = !!initialValues;
    const defaultValues: Partial<TaskFormValues> = {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      completed: initialValues?.completed || false,
      dueDate: initialValues?.dueDate || new Date(),
    }
    // 4. useFormフックでフォームの状態とメソッドを取得
    const { control, handleSubmit } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema), //taskFormSchemaをzodResolverでRHFで解釈できるように変換
    defaultValues
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

      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            label="期日"
            value={field.value || null} // valueを接続
            onChange={(newValue) => field.onChange(newValue)} // onChangeを接続
            // エラー表示のための設定
            slotProps={{
              textField: {
                required: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
      
      {isEditMode && (
        <Controller
          name="completed"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value || false} />}
              label="完了にする"
            />
          )}
        />
      )}

      {/* 送信ボタン */}
      
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