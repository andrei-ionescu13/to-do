import { Card, Divider, List, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Task from './Task';

const Tasks = (props) => {
  const {
    error,
    loading,
    onQueryChange,
    onSearch,
    onSortOptionChange,
    onTaskDelete,
    onTaskSelect,
    onTaskUpdate,
    query,
    selectedSort,
    selectedTasks,
    sortOptions,
    tasks
  } = props;

  return (
    <Card>
      <Box sx={{
        p: 1,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 2
      }}
      >
        <Box
          component="form"
          onSubmit={onSearch}
        >
          <TextField
            fullWidth
            onChange={onQueryChange}
            placeholder="Search..."
            size="small"
            value={query}
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            color="textPrimary"
            variant="subtitle1"
          >
            Order By:
          </Typography>
          <Select
            size="small"
            defaultValue={10}
            value={selectedSort.id}
            onChange={onSortOptionChange}
          >
            {sortOptions.map((option) => (
              <MenuItem
                value={option.id}
                key={option.id}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Divider />
      {(loading || error) ? null : (
        <List disablePadding>
          {tasks.map((task) => {
            const isSelected = selectedTasks.includes(task._id);

            return (
              <Task
                isSelected={isSelected}
                onSelect={onTaskSelect}
                onUpdate={onTaskUpdate}
                key={task._id}
                onDelete={onTaskDelete}
                task={task}
              />
            )
          })}
        </List>
      )}
    </Card>
  )
}

export default Tasks
