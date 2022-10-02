const service = require("./tables.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await service.list();
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

function minimumCharacter() {
    return function (req, res, next) {
        const { data = {} } = req.body;

        const tableName = data.table_name;
    
        if (tableName.length < 2) {
            return next({
                status: 400,
                message: `Value of "table_name" must be atleast two characters long`,
            });
        };
    
        return next();
    };
};

function minimumCapacity() {
    return function (req, res, next) {
        const { data = {} } = req.body;

        const capacity = data.capacity;

        if (typeof capacity !== "number") {
            return next({
                status: 400,
                message: `Value of "capacity" must be a number`,
            });
        };
    
        if (capacity < 1) {
            return next({
                status: 400,
                message: `Table capacity must be 1 or more`,
            });
        };
    
        return next();
    };

};

async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
};

function dataValidation() {
    return function (req, res, next) {
  
        if (req.body.data) {
          return next();
        };

        next({
            status: 400,
            message: `Data is missing`,
        });
    
    };
};

function reservationIdValidation() {
    return function (req, res, next) {
      const { data = {} } = req.body;

      const key = Object.keys(data);

      if (key.length === 0) {
        return next({
            status: 400,
            message: `The key "reservation_id" is missing`,
        });
      };

      return next();
  
    };
  };


function reservationExists() {
    return async function(req, res, next) {
        const { reservation_id } = req.body.data;

        const reservation = await service.readReservation(reservation_id);
        if (reservation) {
            res.locals.reservation = reservation;
            return next();
        };
        next({
            status: 404,
            message: `The reservation_id: ${reservation_id} does not exist`,
        });
    };
};

function capacityAvailableAndUpdate() {
    return async function(req, res, next) {
        const { table_id } = req.params;
        const reservation = res.locals.reservation

        const table = await service.readTable(table_id);

        if (table.reservation_id) {
            return next({
                status: 400,
                message: `This table is occupied`
            });
        };

        if (table.capacity < reservation.people) {
            return next({
                status: 400,
                message: `Table ${table.table_name} does not have enough capacity for this reservation`
            });
        };

        if (reservation.status === "seated") {
            return next({
                status: 400,
                message: `Table ${table.table_name} is already seated`
            });
        };

        //Update 

        const data = await service.seatReservation(table_id, reservation.reservation_id);
        res.status(200).json({ data })

    };
};

async function tableExists(req, res, next) {
    const data = await service.readTable(req.params.table_id);
    if (data) {
        res.locals.table = data;
        return next();
    };
    next({
        status: 404,
        message: `Table ID of ${req.params.table_id} does not exist`
    });
};

async function tableNotOccupied(req, res, next) {
    const table = res.locals.table
    if (table.reservation_id === null) {
        return next({
            status: 400,
            message: `Table is not occupied`
        });
    };
    next();
};

async function clearTable(req, res, next) {
    const table = res.locals.table;
    const data = await service.clearTable(req.params.table_id, table.reservation_id);
    res.status(200).json({ data });
};

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        asyncErrorBoundary(dataValidation()),
        asyncErrorBoundary(bodyHasPropertyAndValue("table_name")),
        asyncErrorBoundary(bodyHasPropertyAndValue("capacity")),
        asyncErrorBoundary(minimumCharacter()),
        asyncErrorBoundary(minimumCapacity()),
        asyncErrorBoundary(create)
    ],
    update: [
        asyncErrorBoundary(dataValidation()),
        asyncErrorBoundary(reservationIdValidation()),
        asyncErrorBoundary(reservationExists()),
        asyncErrorBoundary(capacityAvailableAndUpdate())
    ],
    clearTable: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(tableNotOccupied),
        asyncErrorBoundary(clearTable)
    ]
 }