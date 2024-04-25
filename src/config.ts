const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://Chesko:hRbkav2dZoUF3oRw@cluster0.02zbuxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
