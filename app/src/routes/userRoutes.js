const router = require("express").Router()
const userController = require("../controllers/user-controller")

// Get info of the users
router.get('/', userController.getUserInfo);

// Modify user data
router.put('/', userController.updateUser);

router.get('/alerts', userController.getAlerts);

// Endpoint to mark an alert as seen
router.put('/alerts/:id', userController.markAlertAsSeen);



module.exports = router;