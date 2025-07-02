import mongoose from "mongoose"
import { db_Name } from "../../constant.js"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/${db_Name}`)
        console.log(`Connection to Mongo DB is successful : ${conn.connection.host}`)
    } catch (error) {
        console.log("Mongo Db connection error!!!", error);
    }
}

export default connectDB