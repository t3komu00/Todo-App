
import { insertTask, selectAllTasks } from "../models/Task.js";
import { emptyOrRows } from "../helper/utils.js";

import { deleteTask } from "../models/Task.js";

const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks();
    return res.status(200).json(emptyOrRows(result));
  } catch (error) {
    return next(error);
  }
};

const postTask = async (req, res, next) => {
  try {
    if (!req.body.description || req.body.description.length === 0) {
      const error = new Error("Invalid Description for task");
      error.statusCode = 400;
      return next(error);
    }
    const result = await insertTask(req.body.description);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    return next(error);
  }
};

const taskDelete = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      const error = new Error("Invalid Id");
      return next(error);
    }

    const result = await deleteTask(id);

    return res.status(200).json({ id: id });
  } catch (error) {
    console.log("Error", error);
    return next(error);
  }
};

export { getTasks, postTask, taskDelete };
