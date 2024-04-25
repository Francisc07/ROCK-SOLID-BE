import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { client } from './config';
import { Users } from './models/Users';

// Set the absolute path to the views directory

const port = 3000;
const app = express();
app.set('view engine', 'pug'); // Specify the default engine (e.g., 'ejs')
app.set('views', path.join(__dirname, './views'));
const whitelist = ['http://localhost:3000', 'http://localhost:3001'];

const dbName = 'sample_mflix';
const collectionName = 'users';

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Create references to the database and collection in order to run
// operations on them.
let database = client.db(dbName);
let collection = database.collection(collectionName);

app.get('/', (req, res) => {
  // Render a Pug view called 'index.pug'
  res.render('index.pug'); // Include the file extension '.pug'
});
app.get('/usuarios', async (req, res) => {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    database = client.db(dbName);
    collection = database.collection(collectionName);
    const usuarios: Users[] = await collection.find({}).toArray();

    res.send(usuarios);
    // add a linebreak
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors(corsOptions));

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: (arg0: any) => void) {
  next(createError(404));
});

// error handler
app.use(function (
  err: { message: any; status: any },
  req: { app: { get: (arg0: string) => string } },
  res: {
    locals: { message: any; error: any };
    status: (arg0: any) => void;
    render: (arg0: string) => void;
  },
  next: any
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
