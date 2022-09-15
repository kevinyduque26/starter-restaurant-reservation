// Added Imports

const service = require("./reservations.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.list(req.query.date);
  res.json({ data });
};

function bodyHasPropertyAndValue(property) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    if (data[property]) {
      return next();
    };

    next({
      status: 400,
      message: `Property "${property}" is missing or empty`,
    });

  };
};

function bodyHasReservationTimePropertyAndValue() {
  return function (req, res, next) {
    const { data = {} } = req.body;

    const time = data.reservation_time;

    if (!time) {
      return next({
        status: 400,
        message: `Property "reservation_time" is missing or empty`,
      });
    };

    const dateAndTimeObject = new Date(`2022-01-01T${time}:00`);    

    if (dateAndTimeObject.toString() === "Invalid Date") {
      return next({
        status: 400,
        message: `Property "reservation_time" is invalid`,
      });
    };

    if (time < "10:30") {
      return next({
        status: 400,
        message: `The "reservation_time" must be after 10:30 AM`,
      });
    };

    if (time > "21:30") {
      return next({
        status: 400,
        message: `The "reservation_time" must be before 9:30 PM`,
      });
    };

    return next();

  };

};

function bodyHasReservationDatePropertyAndValue() {
  return function (req, res, next) {
    const { data = {} } = req.body;

    const { data: { reservation_date, reservation_time } = {} } = req.body;

    if (!reservation_date) {
      return next({
        status: 400,
        message: `Property "reservation_date" is missing or empty`,
      });
    };

    const dateAndTimeObject = new Date(`${reservation_date}T${reservation_time}:00`);

    if (dateAndTimeObject.toString() === "Invalid Date") {
      return next({
        status: 400,
        message: `Property "reservation_date" is invalid`,
      });
    };

    if (dateAndTimeObject.getDay() === 2) {
        return next({
          status: 400,
          message: `The restaurant is closed on Tuesday's`,
        });        
    };

    if (dateAndTimeObject < new Date()) {
        return next({
          status: 400,
          message: `The "reservation_date" must be in the future`,
        });  
    };


    return next();

  };

};

function bodyHasPeoplePropertyAndValue() {
  return function (req, res, next) {
    const { data = {} } = req.body;

    const people = data.people;

    if (!people) {
      return next({
        status: 400,
        message: `Property "people" is missing or empty`,
      });
    };

    if (typeof people !== "number"){
      return next({
        status: 400,
        message: `Property "people" is not a number`,
      });
    };

    return next();

  };

};

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(bodyHasPropertyAndValue("first_name")),
    asyncErrorBoundary(bodyHasPropertyAndValue("last_name")),
    asyncErrorBoundary(bodyHasPropertyAndValue("mobile_number")),
    asyncErrorBoundary(bodyHasReservationTimePropertyAndValue()),
    asyncErrorBoundary(bodyHasReservationDatePropertyAndValue()),
    asyncErrorBoundary(bodyHasPeoplePropertyAndValue()),
    asyncErrorBoundary(create)
  ]
};
