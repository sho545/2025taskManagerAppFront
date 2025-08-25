import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  // Storybook上で<Link>を動作させるためのデコレーター
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// HeaderコンポーネントはPropsを受け取らないため、argsは不要
export const Default: Story = {};