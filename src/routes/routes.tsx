import { createBrowserRouter } from 'react-router-dom';
import { TaskIndexPage } from '../pages/TaskIndexPage'; 
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { TaskEditPage } from '../pages/TaskEditPage';

// アプリのルーティング情報を定義
export const router = createBrowserRouter([
  {
    // path: '/' はトップページ
    path: '/',
    // element: に表示するコンポーネントを指定
    element: <TaskIndexPage />,
  },
  {
    // path: '/tasks' でも一覧ページを表示
    path: '/tasks',
    element: <TaskIndexPage />,
  },
  {
    // ':taskId' は動的な値（URLパラメータ）を受け取る
    path: '/tasks/:taskId',
    element: <TaskDetailPage />,
  },
  {
    // taskDetailからTaskEditへ
    path: '/tasks/:taskId/edit',
    element: <TaskEditPage />,
  },
  {
    //新規登録用のパス
    path: '/tasks/new', 
    element: <TaskEditPage />, // 表示するコンポーネントは同じ
  },
  {
    // path: '*' は上記いずれにもマッチしない場合のページ（404 Not Found）
    path: '*',
    element: <div><h1>404 - ページが見つかりません</h1></div>,
  },
]);