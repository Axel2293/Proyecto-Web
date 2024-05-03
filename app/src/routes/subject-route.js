const router = require("express").Router()
const subjectController = require("../controllers/subject-controller")

// Get info of the subjects
router.get('/', subjectController.getSubjects);

// Get info a subject
router.get('/:id', subjectController.getSubject);

// Create a new subject
router.post('/', subjectController.createSubject);

module.exports = router;