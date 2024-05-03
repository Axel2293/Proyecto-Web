const router = require("express").Router()
const SubjectController = require("../controllers/subject-controller")

// Get info of the subjects
router.get('/', SubjectController.getSubjects);

// Get info a subject
//router.get('/:id', SubjectController.getSubject);

// Create a new subject
router.post('/', SubjectController.createSubject);

module.exports = router;