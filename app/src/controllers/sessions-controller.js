const Session = require("../models/Session");
const User = require("../models/User");

// IDEA: status completed must be set by the teacher or automatically when just the session date is in the past
// status are available, cancelled, full

async function enrollStudent(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== "available") {
      return res.status(400).json({ error: "Session is not available" });
    }

    console.log("req.id: ", req.id);
    const student_id = req.id;

    console.log("student_id: ", student_id);

    const student = await User.findById(student_id);
    console.log("student: ", student);

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    if (student.accountType === "teacher") {
      return res.status(400).json({ error: "User is not a student" });
    }

    console.log("session.teacher_id: ", session.teacher_id);

    if (session.teacher_id == student_id) {
      return res
        .status(400)
        .json({ error: "Student can't register to his own session" });
    }

    if (session.students.includes(student_id)) {
      return res.status(400).json({ error: "Student is already registered" });
    }

    // add student to session if isn't full and update status
    if (session.students.length < session.students_limit) {
      session.students.push(student_id);
      if (session.students.length === session.students_limit) {
        session.status = "full";
      }
      await session.save();
      res.status(200).json({ message: "Student enrolled" });
    } else {
      return res.status(400).json({ error: "Session is full" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function unenrollStudent(req, res) {
  try {
    
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status !== "available") {
      return res.status(400).json({ error: "Session is not available" });
    }

    console.log("req.id: ", req.id);
    const student_id = req.id;

    console.log("student_id: ", student_id);

    const student = await User.findById(student_id);
    console.log("student: ", student);

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    if (student.accountType === "teacher") {
      return res.status(400).json({ error: "User is not a student" });
    }

    // remove student from session if student is registered
    if (session.students.includes(student_id)) {
      const index = session.students.indexOf(student_id);
      session.students.splice(index, 1);
      session.status = "available";

      await session.save();
      res.status(200).json({ message: "Student unenrolled" });
    } else {
      return res.status(400).json({ error: "Student is not registered" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cancelSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { teacher_id } = req.id;

    if (session.teacher_id !== teacher_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (session.status !== "cancelled") {
      return res.status(400).json({ error: "Session is already cancelled" });
    }

    session.status = "cancelled";

    await session.save();
    res.status(200).message("Session cancelled");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  enrollStudent,
  unenrollStudent,
  cancelSession,
};
