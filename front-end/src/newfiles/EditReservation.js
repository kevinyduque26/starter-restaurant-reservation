import React from "react";
import CreateEditForm from "./CreateEditForm";
import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate, formatAsTime } from "../utils/date-time";

function EditReservation({ setDate }) {

    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState(null);

    const { reservation_id } = useParams();

    useEffect(() => {

        setError(null)

        const abortController = new AbortController();

        async function getReservationDetails() {
            try {
                const data = await readReservation(reservation_id, abortController.signal);
                setReservation({ 
                    ...data,
                    reservation_date: formatAsDate(data.reservation_date),
                    reservation_time: formatAsTime(data.reservation_time)
                })
            } catch (error) {
                setError(error);
            };
        };

        getReservationDetails();

        return () => abortController.abort();

    }, [reservation_id]);

    return (
        <>
            <h1>Edit Reservation</h1>
            {reservation && <CreateEditForm type="edit" setDate={setDate} reservation={reservation} />}
            <ErrorAlert error={error} />
        </>
    );
};

export default EditReservation;