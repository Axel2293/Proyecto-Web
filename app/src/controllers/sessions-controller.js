const Session = require("../models/Session");
const User = require("../models/User");
const Subject = require("../models/Subject");

//const filterSessionsByDate = async (startDate, endDate) => {
//  const dateStart = new Date(startDate);
//  dateStart.setHours(0, 0, 0, 0);
//  const dateEnd = new Date(endDate);
//  dateEnd.setHours(23, 59, 59, 999);
//
//  const sessions = await Session.find({
//    start: { $gte: dateStart, $lte: dateEnd },
//  }).exec();
//
//  return sessions;
//};
//
//const filterSessionsByTime = (sessions, startTime, endTime) => {
//  const targetStartTime =
//    parseInt(startTime.split(":")[0]) + parseInt(startTime.split(":")[1]) / 60;
//  const targetEndTime =
//    parseInt(endTime.split(":")[0]) + parseInt(endTime.split(":")[1]) / 60;
//
//  return sessions.filter((session) => {
//    const sessionStartTime =
//      session.start.getHours() + session.start.getMinutes() / 60;
//    const sessionEndTime =
//      session.end.getHours() + session.end.getMinutes() / 60;
//
//    return (
//      sessionStartTime >= targetStartTime && sessionEndTime <= targetEndTime
//    );
//  });
//};

async function createSession(req, res) {
  try {
    console.log(req.body);
    const { student_uuid, teacher_uuid, subject_uuid, start, end } = req.body;

    const session = {
      student_uuid,
      teacher_uuid,
      subject_uuid,
      start,
      end,
      status: "pending",
      created_at: new Date(),
    };

    console.log("Session:", session);

    //IDEA: Must check that student and teacher does not have a session at the same time
    //IDEA: Must check that student and teacher are not the same person

    const student = await User.findById(student_uuid);
    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    const teacher = await User.findById(teacher_uuid);
    if (!teacher) {
      return res.status(400).json({ error: "Teacher not found" });
    }

    const subject = await Subject.findById(subject_uuid);
    if (!subject) {
      return res.status(400).json({ error: "Subject not found" });
    }

    const newSession = new Session(session);
    console.log("New session:", newSession);
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSessions(req, res) {
  try {
    const sessions = await Session.find();
    console.log("Sessions:", sessions);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSession(req, res) {
  try {
    const { uuid } = req.params;
    const session = await Session.findOne({ _id: uuid });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//async function filterSessions(req, res) {
//  // filter by query params every parameter is optional
//  // if no query params are passed, return all sessions
//
//  const { teacher_uuid, subject_uuid, start, end, status } = req.query;
//  const query = {};
//
//  if (teacher_uuid) query.teacher_uuid = teacher_uuid;
//  if (subject_uuid) query.subject_uuid = subject_uuid;
//  if (start) query.start = start;
//  if (end) query.end = end;
//  if (status) query.status = status;
//
//  if (start && end) {
//    query.start = { $gte: new Date(start), $lte: new Date(end) };
//  }
//
//  const sessions = await Session.find(query);
//
//  if (!sessions) {
//    return res.status(404).json({ error: "No sessions found" });
//  }
//
//  res.status(200).json(sessions);
//}
//async function filterSessions(req, res) {
//  // filter by query params every parameter is optional
//  // if no query params are passed, return all sessions
//
//  const { teacher_uuid, subject_uuid, start, end, status } = req.query;
//  const query = {};
//
//  if (teacher_uuid) query.teacher_uuid = teacher_uuid;
//  if (subject_uuid) query.subject_uuid = subject_uuid;
//  if (start) query.start = start;
//  if (end) query.end = end;
//  if (status) query.status = status;
//
//  if (start && end) {
//    query.start = { $gte: new Date(start), $lte: new Date(end) };
//  }
//
//  const sessions = await Session.find(query);
//
//  if (!sessions) {
//    return res.status(404).json({ error: "No sessions found" });
//  }
//
//  res.status(200).json(sessions);
//}

async function updateSession(req, res) {
async function updateSession(req, res) {
  try {
    const { uuid } = req.params;
    const session = await Session.findOne({ _id: uuid });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { status } = req.body;
    session.status = status;

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}

async function deleteSession(req, res) {
async function deleteSession(req, res) {
  try {
    const { uuid } = req.query;
    const session = await Session.findOne({ _id: uuid });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await session.remove();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
}

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
};
