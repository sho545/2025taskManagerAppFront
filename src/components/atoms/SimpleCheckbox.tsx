import React from 'react';

interface SimpleCheckboxProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export const SimpleCheckbox: React.FC<SimpleCheckboxProps> = (props) => {
  return (
    <input
      type="checkbox"
      style={{ marginRight: '8px' }} // MUIのCheckboxと見た目を合わせるための簡単なスタイル
      {...props}
    />
  );
};