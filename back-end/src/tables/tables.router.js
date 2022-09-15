const router = require("express").Router();
const controller = require("./tables.controller");

// Added Imports

const methodNotAllowed = require("./../errors/methodNotAllowed")

// Routes

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
//router.route("/:table_id/seat").put(controller.update).all(methodNotAllowed);

module.exports = router;