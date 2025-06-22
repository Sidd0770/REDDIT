import mongoose from 'mongoose';

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
            family:4,
            
        })
        console.log('MongoDB connected');

    }catch(err){
        console.log('INSIDE THE CATCH BLOCK');
        process.exit(1);
    }
}

export default connectDB 