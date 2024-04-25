import express from 'express';
import { client } from './config/config';
import { Document, WithId } from 'mongodb';
const dbName = process.env.DB_NAME;
const collectionName = 'users';
export const userRouter = express.Router();

userRouter.get('/getUsers', async (req, res) => {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const usuarios: WithId<Document>[] = await collection.find({}).toArray();

    res.send(usuarios);
    client.close();
    // add a linebreak
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
    res.status(500).json({ message: 'Error al obtener usuarios' });
    client.close();
  }
});
