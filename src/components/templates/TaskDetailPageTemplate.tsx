import { Box } from '@mui/material';

import { TaskDetail } from '../organisms/TaskDetail';
import { ConfirmationDialog } from '../organisms/ConfirmationDialog';
import type { UiTask } from '../../types/task';

interface TaskDetailPageTemplateProps {
    task: UiTask | null;
    isLoading: boolean;
    isError: boolean;
    isDialogOpen: boolean;
    onDelete: () => void;
    onCloseDialog: () => void;
    onConfirmDelete: () => void;
}

export const TaskDetailPageTemplate: React.FC<TaskDetailPageTemplateProps> = ({
    task,
    isDialogOpen,
    onDelete,
    onCloseDialog,
    onConfirmDelete,
}) => {

    return (
    <Box>
        <TaskDetail task={task} onDelete={onDelete} />
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