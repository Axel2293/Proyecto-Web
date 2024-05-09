const Session = require("../models/Session");
const User = require("../models/User");
const mongoose = require("mongoose");

// IDEA: status completed must be set by the teacher or automatically when just the session date is in the past
// status are available, cancelled, full

async function getSessions(req, res) {
  const {
    q,
    showenrolled,
    showcreat,
    status,
    page,
    pagesize,
    from_date,
    to_date,
  } = req.query;
  const user_id = req.id;
  let query = {};
  if (status) {
    query["status"] = status;
  }

  if (showcreat) {
    if (req.accountType == "teacher" || req.accountType == "both") {
      query["teacher_id"] = user_id;
    } else {
      res.status(404).send({
        error: "Account type doesnt match operation",
      });
    }
  }
  //Filtrar por materia y desc
  if (q) {
    query["$or"] = [
      { subject: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (from_date) {
    query["start"] = { $gte: from_date };
  }

  if (to_date) {
    query["end"] = { $lte: to_date };
  }
  // make a query to get all sessions if student is enrolled in

  if (showenrolled == "1") {
    if (req.accountType == "student" || req.accountType == "both") {
      query["students"] = { $in: [user_id] };
    } else {
      res.status(404).send({
        error: "Account type doesnt match operation",
      });
    }
  } else if (showenrolled == "0") {
    if (req.accountType == "student" || req.accountType == "both") {
      query["students"] = { $nin: [user_id] };
    } else {
      res.status(404).send({
        error: "Account type doesnt match operation",
      });
    }
  }

  try {
    const sessions = await Session.find(query)
      .skip((page - 1) * pagesize || 0)
      .limit(pagesize || 0);
    console.log("Sessions:", sessions);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createSession(req, res) {
  const { subject, description, students_limit, start, end, location } =
    req.body;
  const teacher_id = req.id;

  // Verify if new session overlaps with other session on same date range
  const teacherSessions = await Session.find({
    teacher_id,
    start: { $lt: end },
    end: { $gt: start },
  });
  if (teacherSessions.length > 0) {
    res.status(400).json({ error: "Session overlaps with another session" });
    return;
  }
  try {
    const session = new Session({
      teacher_id,
      subject,
      description,
      students_limit,
      start,
      end,
      location,
      status: "available",
    });

    session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

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
    //Verify if student is already enrolled in another session at the same time
    const studentSessions = await Session.find({
      students: { $in: [student_id] },
      start: { $lt: session.end },
      end: { $gt: session.start },
    });
    if (studentSessions.length > 0) {
      res.status(400).json({
        error:
          "Student is already enrolled in another session at the same time",
      });
      return;
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

async function updateSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const teacher_id = req.id;

    //Cast teacher id in session to string
    let query = {};
    console.log(
      session.teacher_id,
      teacher_id,
      session.teacher_id == teacher_id
    );
    if (session.teacher_id != teacher_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { subject, description, students_limit, start, end, location } =
      req.body;

    if (session.students_limit < session.students.length) {
      return res.status(400).json({
        error: "New session students limit is lower than enrolled students",
      });
    }

    const teacherSessions = await Session.find({
      teacher_id,
      start: { $lt: end },
      end: { $gt: start },
    });
    if (teacherSessions.length > 0) {
      res
        .status(400)
        .json({ error: "New session dates overlap with another session" });
      return;
    }

    if (session.status == "cancelled") {
      return res.status(400).json({ error: "Session is cancelled" });
    }

    if (students_limit < session.students.length) {
      query.status = "full";
    } else {
      query.status = "available";
    }

    query.subject = subject;
    query.description = description;
    query.students_limit = students_limit;
    query.start = start;
    query.end = end;
    query.location = location;

    await Session.findOneAndUpdate({ _id: id }, query);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cancelSession(req, res) {
  try {
    const { id } = req.params;
    console.log("id: ", id);
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    console.log("req.id: ", req.id);
    const teacher_id = req.id;
    console.log("teacher_id: ", teacher_id);

    if (session.teacher_id != teacher_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({ error: "Session is already cancelled" });
    }

    session.status = "cancelled";

    await session.save();
    res.status(200).json({ message: "Session cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function activateSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    console.log("req.id: ", req.id);
    const teacher_id = req.id;
    console.log("teacher_id: ", teacher_id);

    if (session.teacher_id != teacher_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (session.status === "available") {
      return res.status(400).json({ error: "Session is already available" });
    }

    session.status = "available";

    await session.save();
    res.status(200).json({ message: "Session activated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  enrollStudent,
  unenrollStudent,
  cancelSession,
  activateSession,
};
