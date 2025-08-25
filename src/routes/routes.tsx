import { createBrowserRouter } from 'react-router-dom';
import { TaskIndexPage } from '../pages/TaskIndexPage'; 
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { TaskEditPage } from '../pages/TaskEditPage';
import { MainLayout } from '../components/templates/MainLayout';

// アプリのルーティング情報を定義
export const router = createBrowserRouter([
  {
    // 親ルートが共通レイアウトを担当
    element: <MainLayout />,

    children: [
      {
        path: '/',
        element: <TaskIndexPage />,
      },
      {
        path: '/tasks',
        element: <TaskIndexPage />,
      },
      {
        path: '/tasks/:taskId',
        element: <TaskDetailPage />,
      },
      {
        path: '/tasks/:taskId/edit',
        element: <TaskEditPage />,
      },
      {
        path: '/tasks/new',
        element: <TaskEditPage />,
      },
    ],
  },
  {
    // path: '*' は上記いずれにもマッチしない場合のページ（404 Not Found）
    path: '*',
    element: <div><h1>404 - ページが見つかりません</h1></div>,
  },
]);