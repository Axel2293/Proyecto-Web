const router = require("express").Router()
const SubjectController = require("../controllers/subject-controller")

// Create a new subject
router.post('/', SubjectController.createSubject);

// Get info of the subjects
router.get('/', SubjectController.getSubjects);

// Get info a subject
router.get('/:id', SubjectController.getSubject);

// Get info of a subject by name
router.get('/name', SubjectController.getSubjectByName);

// Get info of a subject by name and teacher_id
router.get('/teacher', SubjectController.getTeacherSubject);

// Update a subject status by ID
router.put('/:id', SubjectController.updateSubject);

// Delete a subject by ID
router.delete('/:id', SubjectController.deleteSubject);


module.exports = router;