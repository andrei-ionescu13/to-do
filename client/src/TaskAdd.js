import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'

const TaskAdd = (props) => {
  const { onAdd } = props;
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (description.length < 5) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ description })
      })

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      onAdd();
      setDescription('');
    } catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: '1fr auto',
        p: 1
      }}
      variant="outlined"
    >
      <TextField
        fullWidth
        onChange={handleDescriptionChange}
        placeholder="New Task (min 5 characters)"
        size="small"
        value={description}
      />
      <Button
        color="primary"
        disabled={loading}
        size="small"
        type="submit"
        variant="contained"
      >
        Add
      </Button>
    </Box>
  )
}

export default TaskAdd
