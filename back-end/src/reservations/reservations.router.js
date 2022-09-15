/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

// Added Imports

const methodNotAllowed = require("./../errors/methodNotAllowed")

// Routes

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router;
