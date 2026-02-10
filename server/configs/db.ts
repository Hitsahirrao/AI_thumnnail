import mongoose from 'mongoose'
import { connect } from 'node:http2'


const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=>console.log('MongoDB connnected'))
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.error('Error connecting to MongoDB:' , error)
    }
}

export default connectDB;