const router = require("express").Router()
const SubjectController = require("../controllers/subject-controller")

// Get info of the subjects
router.get('/', SubjectController.getSubjects);

// Get info a subject
router.get('/:id', SubjectController.getSubject);

// Get info of a subject by name
router.get('/name', SubjectController.getSubjectByName);

// Create a new subject
router.post('/', SubjectController.createSubject);

// Update a subject status by ID
router.put('/:id', SubjectController.updateSubject);


module.exports = router;