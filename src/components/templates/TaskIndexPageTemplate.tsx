import React from 'react';
import { Box, Typography } from '@mui/material';
import { TaskList } from '../organisms/TaskList';
import { ConfirmationDialog } from '../organisms/ConfirmationDialog';
import type { UiTask } from '../../types/task';

interface TaskIndexPageTemplateProps {
  tasks: UiTask[];
  isDialogOpen: boolean;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (id: string) => void;
  onCloseDialog: () => void;
  onConfirmDelete: () => void;
}

export const TaskIndexPageTemplate: React.FC<TaskIndexPageTemplateProps> = ({
  tasks,
  isDialogOpen,
  onToggleCompleted,
  onDelete,
  onNavigate,
  onCloseDialog,
  onConfirmDelete,
}) => {

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        タスク一覧
      </Typography>
      <TaskList
        tasks={tasks}
        onToggleCompleted={onToggleCompleted}
        onDelete={onDelete}
        onNavigate={onNavigate}
      />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={onCloseDialog}
        onConfirm={onConfirmDelete}
        title="削除の確認"
        message="本当にこのタスクを削除しますか？"
      />
    </Box>
  );
};