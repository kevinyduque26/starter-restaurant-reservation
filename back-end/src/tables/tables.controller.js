const service = require("./tables.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
};

function minimumCharacter() {
    return function (req, res, next) {
        const { data = {} } = req.body;

        const tableName = data.table_name;
    
        if (tableName.length < 2) {
            return next({
                status: 400,
                message: `Table name must be atleast two characters long`,
            });
        };
    
        return next();
    };
};

function minimumCapacity() {
    return function (req, res, next) {
        const { data = {} } = req.body;

        const capacity = data.capacity;
    
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



module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        asyncErrorBoundary(minimumCharacter()),
        asyncErrorBoundary(minimumCapacity()),
        asyncErrorBoundary(create)
    ],
 };