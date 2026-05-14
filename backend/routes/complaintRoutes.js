const express = require('express');
const router = express.Router();

// Add complaint routes here
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const{
    createComplaint,
    getMyComplaints,
    getAssignedComplaints,
    updateComplaintStatus,
    assignComplaint,
    getAllComplaints,
    escalateComplaint,
    getEscalationLogs,
    getAllAgents
}=require('../controllers/complaintController');

// also need logs handler from activityController
const { getComplaintLogs } = require('../controllers/activityController');

router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER"),
    createComplaint
);

// user can fetch their own complaints
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("USER"),
    getMyComplaints
);

router.get(
    "/assigned",
    authMiddleware,
    roleMiddleware("AGENT"),
    getAssignedComplaints
)

router.put(
    '/:id/status',
    authMiddleware,
    roleMiddleware("AGENT"),
    updateComplaintStatus
)
router.put(
    '/:id/assign',
    authMiddleware,
    roleMiddleware("ADMIN"),
    assignComplaint
)

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllComplaints
)
router.put(
    '/:id/escalate',
    authMiddleware,
    roleMiddleware("ADMIN"),
    escalateComplaint
)

// fetch escalation logs for a complaint
router.get(
    '/:id/escalations',
    authMiddleware,
    // controller will enforce access (owner/admin/agent)
    getEscalationLogs
)

// get all agents (for admin to assign complaints)
router.get(
    '/agents',
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllAgents
)

// admin can fetch all complaints via root path
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllComplaints
);
// route to fetch activity logs for a complaint
// must be placed before exporting router and middleware order is important
router.get(
    '/:id/logs',
    authMiddleware,
    roleMiddleware('ADMIN'),
    getComplaintLogs
);

module.exports = router;
