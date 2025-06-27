import mongoose from 'mongoose';

const InterestSchema = new mongoose.Schema({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }, 
    likes:{ 
        type:Map, 
        of:Number, 
        default:{} 
    },
    frequent: { 
        type:Map, 
        of:Number, 
        default:{} },
    suggestions:{
        type:[String]
    } 
});

const Interest =mongoose.model('Interest',InterestSchema);
export default Interest;
