import React from "react";

import { Link } from "react-router-dom";
import { updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { formatAsTime } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function Reservation({ reservations }) {

    const [error, setError] = useState(null)

    const history = useHistory();

    const handleCancel = async (event, reservation) => {

        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        const abortController = new AbortController();

        if (result) {
            try { 
                const peopleInt = parseInt(reservation.people);

                const updatedReservation = {
                    first_name: reservation.first_name,
                    last_name: reservation.last_name,
                    mobile_number: reservation.mobile_number,
                    reservation_date: formatAsDate(reservation.reservation_date),
                    reservation_time: formatAsTime(reservation.reservation_time),
                    people: peopleInt,
                    status: "cancelled"
                };

                await updateReservation(reservation.reservation_id, updatedReservation, abortController.signal);
                history.go();

            } catch (error) {
                setError(error);
            };

            return () => {
                abortController.abort();
            };
        };
    };

    const list = reservations.map((reservation) => (
        <tr key={reservation.reservation_id}>
            <th scope="row">{`${reservation.first_name} ${reservation.last_name}`}</th>
            <td>{reservation.reservation_date}</td>
            <td>{formatAsTime(reservation.reservation_time)}</td>
            <td>{reservation.people}</td>
            <td>{reservation.mobile_number}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>

            {reservation.status === "booked" ? (
                <>
                    <td><Link to={`/reservations/${reservation.reservation_id}/seat`} role="button">Seat</Link></td>
                    <td><Link to={`/reservations/${reservation.reservation_id}/edit`} role="button">Edit</Link></td>
                </>

            ): (null)}

            {reservation.status !== "finished" && reservation.status !== "cancelled" ? (
                <td><button 
                    type="button" 
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={(event) => handleCancel(event, reservation)}
                    className="btn btn-danger"
                    >Cancel</button>
                </td>
            ): (null)}

        </tr>
    ));

    return (
        <>
            <table class="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">People</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
            <ErrorAlert error={error} />
        </>
        );
};

export default Reservation;