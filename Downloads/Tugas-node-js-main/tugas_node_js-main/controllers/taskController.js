const taskService = require("../services/taskService");
const { AppError } = require("../utils/AppError");

exports.list = (req, res, next) => {
 try {
  const tasks = taskService.list();
  res.json({ data: tasks });
 } catch (err) {
  next(err);
 }
};

exports.detail = (req, res, next) => {
 try {
  const task = taskService.findById(req.params.id);

  if (!task) {
   throw new AppError(404, "Task tidak ditemukan");
  }

  res.json({ data: task });
 } catch (err) {
  next(err);
 }
};

exports.create = (req, res, next) => {
 try {
  const title = String(req.body.title || "").trim();
  const no_hp = String(req.body.no_hp || "").trim();

  if (!title) {
   throw new AppError(400, "title wajib diisi");
  }

  if (title.length > 120) {
   throw new AppError(400, "title maksimal 120 karakter");
  }

  if (!no_hp) {
   throw new AppError(400, "no_hp wajib diisi");
  }

  if (!no_hp.startsWith("08")) {
   throw new AppError(400, "no_hp harus diawali 08");
  }

  if (no_hp.length < 10 || no_hp.length > 13) {
   throw new AppError(400, "no_hp harus 10-13 digit");
  }

  const task = taskService.create({ title, no_hp });

  res.status(201).json({
   message: "Task dibuat",
   data: task,
  });
 } catch (err) {
  next(err);
 }
};

exports.update = (req, res, next) => {
 try {
  const payload = {};

  if (req.body.title !== undefined) {
   const title = String(req.body.title).trim();

   if (!title) {
    throw new AppError(400, "title wajib diisi");
   }

   if (title.length > 120) {
    throw new AppError(400, "title maksimal 120 karakter");
   }

   payload.title = title;
  }

  if (req.body.done !== undefined) {
   if (typeof req.body.done !== "boolean") {
    throw new AppError(400, "done harus boolean");
   }

   payload.done = req.body.done;
  }

  if (req.body.no_hp !== undefined) {
   const no_hp = String(req.body.no_hp).trim();

   if (!no_hp) {
    throw new AppError(400, "no_hp wajib diisi");
   }

   if (!no_hp.startsWith("08")) {
    throw new AppError(400, "no_hp harus diawali 08");
   }

   if (no_hp.length < 10 || no_hp.length > 13) {
    throw new AppError(400, "no_hp harus 10-13 digit");
   }

   payload.no_hp = no_hp;
  }

  if (Object.keys(payload).length === 0) {
   throw new AppError(400, "Tidak ada data yang diupdate");
  }

  const task = taskService.update(req.params.id, payload);

  if (!task) {
   throw new AppError(404, "Task tidak ditemukan");
  }

  res.json({
   message: "Task diupdate",
   data: task,
  });
 } catch (err) {
  next(err);
 }
};

exports.remove = (req, res, next) => {
 try {
  const task = taskService.remove(req.params.id);

  if (!task) {
   throw new AppError(404, "Task tidak ditemukan");
  }

  res.json({
   message: "Task dihapus",
   data: task,
  });
 } catch (err) {
  next(err);
 }
};