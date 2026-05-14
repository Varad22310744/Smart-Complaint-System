const Complaint = require("../models/Complaint");
const mongoose = require("mongoose");
const User = require("../models/User");
const EscalationLog=require("../models/EscalationLog");
const ActivityLog=require("../models/ActivityLog");
//create complaint
exports.createComplaint=async(req,res)=>{
    try{
        const {title,description,priority}=req.body;
        if(!title || !description || !priority){
            return res.status(400).json({message:"All fields required"});
        }
        const newComplaint=await Complaint.create({
            title,
            description,
            priority,
            createdBy:req.user.id
        });
        res.status(201).json(newComplaint);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

//get my complaints
exports.getMyComplaints=async(req,res)=>{
    try{
        const complaints=await Complaint.find({
            createdBy:req.user.id
        }).populate('createdBy','username email');
        res.json(complaints);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

//get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
    try {
        // make sure assignedTo is populated so frontend can show username
        const complaints = await Complaint.find()
            .populate('createdBy','username email')
            .populate('assignedTo','username email');
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAssignedComplaints = async (req, res) => {
    try{
        const complaints=await Complaint.find({
            assignedTo:req.user.id
        })
        const priorityOrder={"HIGH":3,"MEDIUM":2,"LOW":1}; 
        complaints.sort((a,b)=>{
            return priorityOrder[b.priority]-priorityOrder[a.priority];
        });
        res.json(complaints);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.updateComplaintStatus = async (req, res) => {
    try{
        const {status}=req.body;
        const complaint=await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }
        if(complaint.assignedTo.toString()!==req.user.id){
            return res.status(403).json({message:"Not authorized"});
        }
        if(status==="RESOLVED"){
            const highPending=await Complaint.findOne({
                assignedTo:req.user.id,
                priority:"HIGH",
                status:{$ne:"RESOLVED"},
                _id:{$ne:complaint._id}
            })
            if(highPending && complaint.priority!=="HIGH"){
                // if a high priority ticket is still open, disallow resolving a lower priority one
                return res.status(400).json({
                    message:
                        "Please resolve all HIGH priority complaints before updating lower priority ones. " +
                        "High priority items must be addressed first.",
                });
            }
        }
        complaint.status=status;
        await complaint.save();
        await ActivityLog.create({
            ComplaintId:complaint._id,
            actionType:"OPEN"?"REOPENED":"STATUS_CHANGED",
            performedBy:req.user.id,
            previousValue:complaint.status,
            newValue:status,
            remarks:"Status changed to "+status
        });
        res.json(complaint);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.assignComplaint=async(req,res)=>{
    try{
        const {agentId}=req.body;
        const complaint=await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }
        if(!mongoose.Types.ObjectId.isValid(agentId)){
            return res.status(400).json({message:"Invalid agentId"});
        }
        const agent=await User.findById(agentId);
        if(!agent || agent.role!=="AGENT"){
            return res.status(400).json({message:"Invalid agent"});
        }
        if(complaint.assignedTo){
            return res.status(400).json({
                message:"Complaint already assigned to an agent. Please escalate instead of re-assigning."
            })
        }
        const previousValue=complaint.assignedTo;
        complaint.assignedTo=agentId;
        complaint.status="OPEN";
        await complaint.save();
        // refetch and populate the full object with agent details
        const updatedComplaint = await Complaint.findById(req.params.id)
            .populate('assignedTo','username email');
        await ActivityLog.create({
            ComplaintId:complaint._id,
            actionType:"ASSIGNED",
            performedBy:req.user.id,
            previousValue:previousValue,
            newValue:agentId,
            remarks:"Assigned to agent "+agent.username
        });
        res.json(updatedComplaint);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.getFilteredComplaints = async (req, res) => {
    try{
        const {status,priority,assiged}=req.query;
        let filter={};
        if(status)  filter.status=status.toUpperCase();
        if(priority) filter.priority=priority.toUpperCase();
        if(assiged!==undefined){
        if(assiged==="true"){
            filter.assignedTo={$ne:null};
        }
        else if(assiged==="false"){
            filter.assignedTo=null;
        }
        }
        const complaints=await Complaint.find(filter)
        .populate('createdBy','username email')
        .populate('assignedTo','username email');
        res.json(complaints);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.escalateComplaint=async(req,res)=>{
    try{
        const {newAgentId,remarks}=req.body;
        const complaint=await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }
        if(complaint.status==="RESOLVED"){
            return res.status(400).json({message:"Cannot escalate a resolved complaint"});
        }
        if(!mongoose.Types.ObjectId.isValid(newAgentId)){
            return res.status(400).json({message:"Invalid agentId"});
        }
        const agent=await User.findById(newAgentId);
        if(!agent || agent.role!=="AGENT"){
            return res.status(400).json({message:"Invalid agent"});
        }
        await EscalationLog.create({
            complaintId:complaint._id,
            escalatedBy:req.user.id,
            escalatedTo:newAgentId,
            remarks
        });
        complaint.assignedTo=newAgentId;
        await complaint.save();
        // refetch and populate the full object with agent details
        const updatedComplaint = await Complaint.findById(req.params.id)
            .populate('assignedTo','username email');
        await ActivityLog.create({
            ComplaintId:complaint._id,
            actionType:"ESCALATED",
            performedBy:req.user.id,
            previousValue:complaint.assignedTo.toString(),
            newValue:newAgentId,
            remarks:"Escalated to agent "+agent.username
        });
        res.json({message:"Complaint escalated successfully", complaint:updatedComplaint});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// get escalation logs for a complaint
exports.getEscalationLogs = async (req, res) => {
    try{
        const complaint = await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({message:"Complaint not found"});
        }

        // allow admin, agents, or the complaint owner
        if(req.user.role !== 'ADMIN' && req.user.role !== 'AGENT' && complaint.createdBy.toString() !== req.user.id){
            return res.status(403).json({message: 'Access denied'});
        }

        const logs = await EscalationLog.find({ complaintId: req.params.id })
            .populate('escalatedBy','username email')
            .populate('escalatedTo','username email');

        res.json(logs);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// get all agents (for admin dashboard)
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: 'AGENT' }).select('_id username email');
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

