import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

// ジェネリクスを使い、より型安全なPropsを定義
// Tはフォーム全体の型（例: { title: string; description: string; }）
//interfaceは型を定義
//<>の役割はこの型が引数として<>の中身の型を引数として受け取ることを表す
interface ControlledTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'value' | 'onChange'> {
  name: Path<T>; // フォームのキー（'title'など）を型安全に
  control: Control<T>; // useFormから受け取るcontrolオブジェクト
}

//フォームの情報と見た目の設定を受け取ってテキストフォームを返す
//=<T~>はジェネリックコンポーネントの宣言(ジェネリックな型を扱うにはコンポーネント自体にもジェネリック宣言が必要)
//(!!undefined)=(!true)=false
export const ControlledTextField = <T extends FieldValues>({
  name,
  control,
  ...rest // TextFieldが受け取る他のProps (label, multilineなど)
}: ControlledTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      // render propを使って、UIコンポーネントを描画
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...rest} // label="タイトル" など見た目や設定をここに展開
          {...field} // value, onChange, onBlur などReactHookFormが管理するpropを展開
          error={!!error} // エラーがあればTextFieldをエラー状態にする
          helperText={error?.message} // エラーメッセージを表示
        />
      )}
    />
  );
};