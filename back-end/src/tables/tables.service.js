const { where } = require("./../db/connection");
const knex = require("./../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
};

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords) => createdRecords[0])
};

function readReservation(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": reservationId })
        .first();
};

function readTable(tableId) {
    return knex("tables")
        .select("*")
        .where({ "table_id": tableId })
        .first();
};

// function seatReservation(table_id, reservation_id) {
//     return knex("tables")
//         .where("table_id", table_id)
//         .update({ reservation_id: reservation_id })
//         .returning("*")
// };

async function seatReservation(table_id, reservation_id) {
    try {
      const trx = await knex.transaction();
  
      return trx("tables")
        .where("table_id", table_id)
        .update({ reservation_id: reservation_id })
        .then(function () {
          return trx("reservations")
            .where("reservation_id", reservation_id)
            .update({ status: "seated" });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    } catch (error) {
      return error;
    };
};

// function clearTable(table_id) {
//     return knex("tables")
//         .where("table_id", table_id)
//         .update({ reservation_id: null })
//         .returning("*")
// };

async function clearTable(table_id, reservation_id) {
    try {
      const trx = await knex.transaction();
  
      return knex("tables")
        .select("*")
        .where({ "table_id": table_id })
        .update({ reservation_id: null })
        .then(function () {
          return trx("reservations")
            .where({ "reservation_id": reservation_id })
            .update({ status: "finished" });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    } catch (error) {
      return error;
    };
};

module.exports = {
    list,
    create,
    readReservation,
    readTable,
    seatReservation,
    clearTable
};