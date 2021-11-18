import { useState } from 'react';
import { Button, Checkbox, Input, ListItem, Typography } from '@mui/material'

const Task = (props) => {
  const { task, onDelete, onUpdate, onSelect, isSelected } = props;
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleUpdate = () => {
    setUpdateLoading(true);
    onUpdate(task._id, description);
    setEditMode(false);
    setUpdateLoading(false);
  }

  const handleDelete = async () => {
    setDeleteLoading(true);
    await onDelete(task._id);
    setDeleteLoading(false);
  }

  return (
    <ListItem
      divider
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: 'auto 1fr auto auto',
        px: 1
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={() => { onSelect(task._id) }}
      />
      {editMode ? (
        <Input
          autoFocus
          onChange={handleDescriptionChange}
          value={description}
        />
      ) : (
        <Typography
          color="textPrimary"
          variant="body1"
        >
          {task.description}
        </Typography>
      )}
      {editMode ? (
        <>
          <Button
            color="primary"
            disabled={updateLoading}
            onClick={handleUpdate}
            variant="contained"
          >
            Submit
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setEditMode(false);
              setDescription(task.description);
            }}
            variant="text"
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button
            color="primary"
            onClick={() => { setEditMode(true); }}
            variant="contained"
          >
            Edit
          </Button>
          <Button
            color="error"
            disabled={deleteLoading}
            onClick={handleDelete}
            variant="contained"
          >
            Delete
          </Button>
        </>
      )}
    </ListItem>
  )
}

export default Task
