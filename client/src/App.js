import { Button, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import TaskAdd from './TaskAdd';
import Tasks from './Tasks';

const sortOptions = [
  {
    id: 'newest',
    label: 'Newest to Oldest',
    sort: 'asc',
    sortBy: 'createdAt'
  },
  {
    id: 'oldest',
    label: 'Oldest to Newest',
    sort: 'desc',
    sortBy: 'createdAt'
  }
]

const App = () => {
  const [query, setQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const fetchTasks = async (query, sortBy, sort) => {
    try {
      setLoading(true);
      setError(null);
      setTasks(null);

      const respose = await fetch(`http://localhost:3001/?query=${query}&sortBy=${sortBy}&sort=${sort}`);
      const data = await respose.json();

      if (respose.ok) {
        setTasks(data);
        setLoading(false);
        return;
      }

      setError(data);
    } catch (error) {
      setError(error);
      setTasks(null);
    }
    finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSelectedSortChange = (event) => {
    setSelectedSort(sortOptions.find((option) => option.id === event.target.value))
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchTasks(query, selectedSort.sortBy, selectedSort.sort);
  };

  const handleTaskDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setSelectedTasks((prevTasks) => prevTasks.filter((taskId) => taskId !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskUpdate = async (id, description) => {
    if (description.length < 5) return;

    try {
      const response = await fetch(
        `http://localhost:3001/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify({ description })
        });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setTasks((prevTasks) => prevTasks.map((task) => {
        if (task._id === id)
          return {
            ...task,
            description
          }

        return task;
      }))
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskSelect = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks((prevTasks) => prevTasks.filter((taskId) => taskId !== id));
      return;
    }

    setSelectedTasks((prevTasks) => [...prevTasks, id]);
  };

  const handleTaskMultipleDelete = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          body: JSON.stringify({ ids: selectedTasks })
        });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskAdd = () => {
    fetchTasks(query, selectedSort.sortBy, selectedSort.sort);
  };

  useEffect(() => {
    fetchTasks('', selectedSort.sortBy, selectedSort.sort);
  }, [selectedSort.sort, selectedSort.sortBy]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'grid',
        gap: 5,
      }}
    >
      <TaskAdd onAdd={handleTaskAdd} />
      <Tasks
        error={error}
        loading={loading}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onSortOptionChange={handleSelectedSortChange}
        onTaskDelete={handleTaskDelete}
        onTaskSelect={handleTaskSelect}
        onTaskUpdate={handleTaskUpdate}
        query={query}
        selectedSort={selectedSort}
        selectedTasks={selectedTasks}
        sortOptions={sortOptions}
        tasks={tasks}
      />
      {selectedTasks.length > 0 && (
        <Button
          color="success"
          onClick={handleTaskMultipleDelete}
          variant="outlined"
        >
          Delete checked tasks
        </Button>
      )}
    </Container>
  );
}

export default App;
