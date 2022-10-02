// Added Imports

const service = require("./reservations.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res) {

  const { mobile_number } = req.query;

  if (mobile_number) {
    const data = await service.list(null, mobile_number);
    return res.json({ data });
  };

  const data = await service.list(req.query.date, null);
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

function statusValidation() {
  return function (req, res, next) {
    const { data = {} } = req.body;

    const status = data.status;

    if (status === "seated" || status === "finished") {
      return next({
        status: 400,
        message: `Status of ${status} is not valid upon reservation creation`,
      });
    };

    return next();

  };

};

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
};

async function readReservation(req, res, next) {
  const data = await service.readReservation(req.params.reservation_id);
  if (!data) {
    return next({
      status: 404,
      message: `The ID provided ${req.params.reservation_id} does not exists`,
    });
  };
  res.status(200).json({ data });
};

async function reservationExists(req, res, next) {
  const data = await service.readReservation(req.params.reservation_id);
  if (data) {
      res.locals.reservation = data;
      return next();
  };
  next({
      status: 404,
      message: `Reservation ID of ${req.params.reservation_id} does not exist`
  });
};

function statusUnknownOrFinished(req, res, next) {

  const { status } = req.body.data;

  if (status === "unknown") {
    return next({
      status: 400,
      message: `The reservation status cannot be unknown`,
    });
  };

  const reservation = res.locals.reservation;

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: `This reservation is already finished`,
    });
  }

  next();

};

async function update(req, res) {

  const { reservation_id } = req.params;
  const { data: { status } = {} } = req.body;

  const data = await service.update(reservation_id, status);
  res.status(200).json({ data });

};

async function updateReservation(req, res) {

  const reservation = req.body.data;
  const { reservation_id } = req.params;

  const data = await service.updateReservation(reservation_id, reservation);
  res.status(200).json({ data });

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
    asyncErrorBoundary(statusValidation()),
    asyncErrorBoundary(create)
  ],
  read: asyncErrorBoundary(readReservation),
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(statusUnknownOrFinished),
    asyncErrorBoundary(update)
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(bodyHasPropertyAndValue("first_name")),
    asyncErrorBoundary(bodyHasPropertyAndValue("last_name")),
    asyncErrorBoundary(bodyHasPropertyAndValue("mobile_number")),
    asyncErrorBoundary(bodyHasReservationTimePropertyAndValue()),
    asyncErrorBoundary(bodyHasReservationDatePropertyAndValue()),
    asyncErrorBoundary(bodyHasPeoplePropertyAndValue()),
    asyncErrorBoundary(updateReservation),
  ]
};
