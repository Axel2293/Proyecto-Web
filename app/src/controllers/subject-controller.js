const Subject = require('../models/Subject');

// Create a new subject
async function createSubject(req, res) {
    const data = req.body;
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
    const { name } = req.query;
    if (name) {
        const subjects = await Subject.find({ name: { $regex: name, $options: 'i' } });
        res.send(subjects);
    } else {
        const subjects = await Subject.find();
        res.send(subjects);
    }
}

// Return a subject id that matches with the "name" of the subject and the "name" of the teacher
async function getTeacherSubject(req, res) {
    const { name, teacher } = req.query;
    if (name && teacher) {
        const subject = await Subject.findOne({ name: name, 'teacher.name': teacher }).select('_id');
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
    const { id } = req.params;
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
    const { name } = req.query;
    if (name) {
        const subject = await Subject.findOne({ name: name });
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

module.exports = {
    createSubject,
    getSubjects,
    getTeacherSubject,
    getSubject,
    getSubjectByName,
};