import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { connect, db } from './utils/db.mjs';

dotenv.config();

const run = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  await connect();

  app.get('/', async (req, res) => {
    const { query = '', sort = 'asc', sortBy = 'createdAt' } = req.query;

    try {
      const tasks = await db.collection('tasks').find({
        description: {
          $regex: query,
          $options: 'i'
        }
      })
        .sort(sortBy ? { [sortBy]: sort === 'asc' ? 1 : -1 } : {})
        .toArray();
      res.send(tasks);
    } catch (error) {
      console.log(error);
    }
  })

  app.post('/', async (req, res) => {
    const { description } = req.body;
    const response = await db.collection('tasks').insertOne({ description, createdAt: Date.now() });
    res.send(response);
  })

  app.put('/:id', async (req, res) => {
    const { description } = req.body;
    const _id = new ObjectId(req.params.id);
    const response = await db.collection('tasks').updateOne({ _id }, { $set: { description } });
    res.send();
  })

  app.delete('/:id', async (req, res) => {
    const _id = new ObjectId(req.params.id);
    const result = await db.collection('tasks').deleteOne({ _id });
    res.send(result);
  })

  app.delete('/', async (req, res) => {
    const { ids } = req.body;
    const result = await db.collection('tasks').deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } });
    res.send(result);
  })

  const port = process.env.PORT || 3001;
  app.listen(port, () => { console.log(`server started on port ${port}`) });
}

run();