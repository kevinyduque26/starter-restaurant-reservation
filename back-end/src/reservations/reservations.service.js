const knex = require("./../db/connection");

function list(date, mobile_number) {
    if (mobile_number) {
        return knex("reservations")
        .whereRaw(
          "translate(mobile_number, '() -', '') like ?",
          `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
    } else {
        return knex("reservations")
        .select("*")
        .where({ "reservation_date": date })
        .whereNot({ "status": "finished" })
        .orderBy("reservation_time");
    };
};

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0])
};

function readReservation(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": reservationId })
        .first();
};

function update(reservation_id, status) {
    return knex("reservations")
        .where("reservation_id", reservation_id)
        .update({ status: status })
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
};


function updateReservation(reservation_id, reservation) {
    return knex("reservations")
        .select("*")
        .where("reservation_id", reservation_id)
        .update(reservation)
        .returning("*")
        .then((updatedRecords) => updatedRecords[0])
};


module.exports = {
    list,
    create,
    readReservation,
    update,
    updateReservation
};