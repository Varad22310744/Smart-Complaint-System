const ActivityLog=require("../models/ActivityLog");

exports.getComplaintLogs=async(req,res)=>{
    try{
        const logs=await ActivityLog.find({
            ComplaintId:req.params.id
        }).populate('performedBy','username email').sort({createdAt:-1});
        res.status(200).json(logs);
    }catch(err){
        console.error(err.message);
        res.status(500).json({
            success:false,
            message:"Failed to fetch logs"
        });
    }
}