const mongoose=require("mongoose");
const Complaint = require("./Complaint");

const activityLogSchema=new mongoose.Schema({
    ComplaintId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Complaint',
        required:true
    },
    actionType:{
        type:String,
        required:true,
        enum:['ASSIGNED','STATUS_CHANGED','ESCALATED','REOPENED']
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    previousValue:String,
    newValue:String,
    remarks:String,

},{timestamps:true});

module.exports=mongoose.model('ActivityLog',activityLogSchema);