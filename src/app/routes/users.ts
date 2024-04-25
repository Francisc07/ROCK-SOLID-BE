import express, { Request, Response } from 'express';
import { client } from './config/config';
import { Users } from '../models/Users';
const dbName = process.env.DB_NAME;
const collectionName = 'users';
export const userRouter = express.Router();

userRouter.get('/getUsers', async (req: Request, res: Response) => {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const usuarios: Users[] = (await collection.find({}).toArray()).map(
      (doc) => ({
        _id: doc._id.toHexString(),
        name: doc.name,
        email: doc.email,
        password: doc.password,
      })
    );

    res.send(usuarios);
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
    res.status(500).json({ message: 'Error al obtener usuarios' });
    client.close();
  } finally {
    if (client) {
      console.error(`Cierra conn`);
      await client.close();
    }
  }
});
