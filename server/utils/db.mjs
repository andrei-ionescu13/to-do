import mongodb from 'mongodb';

export let mongoClient;
export let db;

export const connect = async () => {
  try {
    mongoClient = await mongodb.MongoClient.connect(process.env.MONGO_URI);
    db = mongoClient.db('to-do');
  } catch (error) {
    console.log(error)
  }
};

