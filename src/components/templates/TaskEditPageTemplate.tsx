import React from 'react';
import { Box, Typography } from '@mui/material';
import { TaskCreateForm } from '../organisms/TaskCreateForm';
import { TaskEditForm } from '../organisms/TaskEditForm';
import type { TaskFormValues } from '../../types/task';
import type { SubmitHandler } from 'react-hook-form';

interface TaskSavePageTemplateProps {
  isEditMode: boolean;
  onSubmit: SubmitHandler<TaskFormValues>;
  initialValues?: TaskFormValues;
  isSubmitting: boolean;
}

export const TaskEditPageTemplate: React.FC<TaskSavePageTemplateProps> = ({
  isEditMode,
  onSubmit,
  initialValues,
  isSubmitting,
}) => {

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'タスクの編集' : 'タスクの新規作成'}
      </Typography>
      
      {isEditMode ? (
        <TaskEditForm
          onSubmit={onSubmit}
          initialValues={initialValues!} // 編集モードではinitialValuesが必須
          isSubmitting={isSubmitting}
        />
      ) : (
        <TaskCreateForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </Box>
  );
};