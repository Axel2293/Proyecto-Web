const Session = require("../models/Session");
const User = require("../models/User");
const { query } = require("express");

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
  const { subject, description, students_limit, start, end, location } = req.body;
  const teacher_id = req.id;

  // Verify if new session overlaps with other session on same date range
  const teacherSessions = await Session.find({ teacher_id , start: { $lt: end }, end: { $gt: start } });
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

async function getSessions(req, res) {
  
  const {q, showcreat, status, page, pagesize, from_date, to_date} = req.query;
  const user_id = req.id;
  let query = {}
  if(status){
    query["status"] = status
  }

  if(showcreat){
    if (req.accountType == "teacher" || req.accountType == "both") {
      query["teacher_id"] = user_id;
    }else{
      res.status(404).send({
        error: "Account type doesnt match operation"
      })
    }
  }
  //Filtrar por materia y desc
  if (q) {
    query["$or"] = [
      { subject: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }
  
  if(from_date){
    query["start"] = {"$gte": from_date}
  }

  if (to_date) {
    query["end"] = {"$lte": to_date}
  }

  try {
    const sessions = await Session.find(
      query
    )
    .skip(((page-1) * pagesize) || 0)
    .limit(pagesize|| 0);
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

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};
