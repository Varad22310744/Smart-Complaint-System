const mongoose= require('mongoose');
const ComplaintSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['OPEN','IN_PROGRESS','RESOLVED'],
        default:'OPEN'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    priority:{
        type:String,
        enum:['LOW','MEDIUM','HIGH'],
        default:'LOW',
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    remarks:{
        type:String,
        default:''
    }

},{timestamps:true});

module.exports = mongoose.model('Complaint',ComplaintSchema);