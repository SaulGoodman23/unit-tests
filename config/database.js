import mongoose from "mongoose";
import {MongoClient} from "mongodb"

const connectionURL="mongodb://127.0.0.1:27017"
const client=new MongoClient(connectionURL)
const databaseName="jobs_db"


const connectDatabase = async () => {
  mongoose.set("strictQuery",true)
  mongoose.connect("mongodb://127.0.0.1:27017/jobs_db").then((con) => {
    console.log(`MongoDB Database connected with host: ${con.connection.host}`);
  });
  // await client.connect();
  // console.log('Connected successfully to Database...');
  // client.db(databaseName)
};

export default connectDatabase;
