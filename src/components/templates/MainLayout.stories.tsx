import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { Typography } from '@mui/material';

// 1. メタ情報の定義
const meta = {
  title: 'Templates/MainLayout',
  component: MainLayout,
  tags: ['autodocs'],
  parameters: {
    // StorybookのUI上で、全画面表示にした方がレイアウトを確認しやすい
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// 2. Storyの定義
export const Default: Story = {
  // render関数を使って、ルーターのコンテキストを提供
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* ↓ この部分が<Outlet />に表示されるコンテンツ */}
          <Route
            index
            element={
              <>
                <Typography variant="h4" gutterBottom>
                  ページのタイトル
                </Typography>
                <Typography>
                  これは`<Outlet />`に表示されるメインコンテンツです。
                  ここに各ページの具体的な中身が入ります。
                </Typography>
              </>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
};

// 長いコンテンツを持つ別のStory
export const WithLongContent: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <>
                <Typography variant="h4" gutterBottom>
                  長いコンテンツを持つページ
                </Typography>
                {/* 配列から大量の<p>タグを生成して長いコンテンツをシミュレート */}
                {Array.from(new Array(30)).map((_, index) => (
                  <Typography key={index} paragraph>
                    これは段落 {index + 1} です。
                    レイアウトが長いコンテンツをどのように扱うかを確認するためのテキストです。
                    スクロールが正しく機能するかなどをテストできます。
                  </Typography>
                ))}
              </>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
};