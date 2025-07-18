import React from 'react';
import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import type { TaskDto } from '../../apis/api';

// このコンポーネントが受け取るPropsの型を定義
interface TaskDetailProps {
  task: TaskDto | null; // 表示するタスクのデータ、またはロード中の場合はnull
  onDelete: (id: number) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onDelete }) => {
  // データがまだない場合はローディング表示などを行う
  if (!task) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>タスクを読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* ステータスチップ */}
      <Chip
        label={task.completed ? '完了済み' : '未完了'}
        color={task.completed ? 'success' : 'default'}
        sx={{ mb: 2 }}    //margin bottom
      />

      {/* タイトル */}
      <Typography variant="h4" component="h1" gutterBottom> {/*component:html上のタグ,variant:見た目のスタイル,gutterBottom:marginBottom自動設定*/}
        {task.title}
      </Typography>

      {/* 詳細 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          詳細
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}> {/*改行と半角スペースを反映して自動折り返し*/}
          {task.description || '詳細情報はありません。'}
        </Typography>
      </Box>

      {/* 期日 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          期日
        </Typography>
        <Typography variant="body1">
          {task.dueDate}
        </Typography>
      </Box>

      {/* 操作ボタン */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}> {/*中の要素を一定間隔をあけて並べるタグ,spacing:並べる要素間のスペース */}
        <Button
          component={Link}
          to={`/tasks/${task.id}/edit`}
          variant="contained"                            //contained:塗りつぶしスタイル,outlined:輪郭線のみ,text:テキストのみ
        >
          編集
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            if (task.id) {
              onDelete(task.id);
            }
          }}
        >
          削除
        </Button>
      </Stack>
    </Box>
  );
};