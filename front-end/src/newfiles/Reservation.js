import React from "react";

import { Link } from "react-router-dom";
// import SeatReservation from "./SeatReservation";

function Reservation({ reservations }) {
    const list = reservations.map((reservation, index) => (
        <tr key={index}>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
            <td>{reservation.people}</td>
            <td>{reservation.mobile_number}</td>
            <td><Link to={`/reservations/${reservation.reservation_id}/seat`} role="button">Seat</Link></td>
        </tr>
    ));

    return (
        <table>
            <thead>
                <tr>
                    <th>Reservation Date</th>
                    <th>Reservation Time</th>
                    <th>Name</th>
                    <th>People</th>
                    <th>Phone Number</th>
                    <th>Seat</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
        </table>
    );
};

export default Reservation;