const Subject = require('../models/Subject');

// Create a new subject
async function createSubject(req, res) {
    const data = req.body;

    // Check if the subject already exists
    const existingSubject = data.teacher_id ? await Subject.findOne({
        name: data.name,
        teacher_id: data.teacher_id
    }) : null;
    if (existingSubject) {
        return res.status(400).send({
            error: 'Teacher already has this subject',
        });
    }

    const subject = new Subject(data);
    try {
        await subject.save();
        res.send(subject);
    } catch (error) {
        res.status(400).send({
            error: 'Could not create subject ' + error,
        });
    }
}

// Get subjects and filter by name
async function getSubjects(req, res) {
    const {
        name
    } = req.query;
    try {
        let subjects;
        if (name) {
            // Search and exclude 'teacher_id' from the results when filtering by name
            // Also, only include subjects with 'status' of true
            subjects = await Subject.find({
                name: {
                    $regex: name,
                    $options: 'i'
                },
                status: true
            }).select('-teacher_id');
        } else {
            // Search all and exclude 'teacher_id' from the results
            // Also, only include subjects with 'status' of true
            subjects = await Subject.find({
                status: true
            }).select('-teacher_id');
        }
        res.send(subjects);
    } catch (error) {
        res.status(500).send({
            error: 'Server error: ' + error.message,
        });
    }
}

// Return a subject id that matches with the "name" of the subject and the "name" of the teacher
async function getTeacherSubject(req, res) {
    const { teacher_id } = req.query;
    if (teacher_id) {
        const subject = await Subject.findOne({
            teacher_id: teacher_id
        }).select('_id');
        if (subject) {
            res.send(subject);
        } else {
            res.status(404).send({
                error: 'Subject not found',
            });
        }
    }
}

// Get subjects by ID
async function getSubject(req, res) {
    const {
        id
    } = req.params;
    const subject = await Subject.findById(id);
    if (subject) {
        res.send(subject);
    } else {
        res.status(404).send({
            error: 'Subject not found',
        });
    }
}

// Get subjets by name
async function getSubjectByName(req, res) {
    const {
        name
    } = req.query;
    if (name) {
        const subject = await Subject.findOne({
            name: name
        });
        if (subject) {
            res.send(subject);
        } else {
            res.status(404).send({
                error: 'Subject not found',
            });
        }
    } else {
        res.status(404).send({
            error: 'Subject not found',
        });
    }
}

// Update a subject status by ID
async function updateSubject(req, res) {
    const {
        id
    } = req.params;
    try {
        const subject = await Subject.findById(id);
        if (subject) {
            // Toggle the status
            subject.status = !subject.status;
            await subject.save();
            res.send(subject);
        } else {
            res.status(404).send({
                error: 'Subject not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            error: 'Server error',
        });
    }
}

async function deleteSubject(req, res) {
    const {
        id
    } = req.params;
    try {
        const subject = await Subject.findByIdAndDelete(id);
        if (subject) {
            res.send({
                message: 'Subject deleted successfully'
            });
        } else {
            res.status(404).send({
                error: 'Subject not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            error: 'Server error',
        });
    }
}

module.exports = {
    createSubject,
    getSubjects,
    getTeacherSubject,
    getSubject,
    getSubjectByName,
    updateSubject,
    deleteSubject,
};