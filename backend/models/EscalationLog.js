const mongoose = require('mongoose');

const EscalationLogSchema = new mongoose.Schema({
    complaintId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Complaint',
        required:true
    },
    escalatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    escalatedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
    },
    remarks:{
        type:String,
        required:true
    }
},
{timestamps:true});

module.exports = mongoose.model('EscalationLog',EscalationLogSchema);