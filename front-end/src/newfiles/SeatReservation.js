import React from "react";

import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatReservation } from "../utils/api";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";

function SeatReservation({ date }) {

    const initialFormState = {
        table_id: "",
        reservation_id: "",
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    // On Page Reload

    useEffect(loadTables, []);
    useEffect(loadReservations, [date]);
  
    function loadTables() {
      const abortController = new AbortController();
      setError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setError);
      return () => abortController.abort();
    };
  
    function loadReservations() {
      const abortController = new AbortController();
      setError(null);
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setError);
      return () => abortController.abort();
    };

    // Handlers

    const { reservation_id }= useParams();

    const handleChange = ({ target }) => {

        setFormData({
            [target.name]: target.value,
            reservation_id: reservation_id,
          });

    };

    const history = useHistory();
    const abortContoller = new AbortController();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {

            await seatReservation(formData.table_id, formData.reservation_id, abortContoller.signal);
            setFormData({ ...initialFormState });
            history.push(`/dashboard`);

        } catch (error) {

            setError(error);

        };
    
        return () => {
          abortContoller.abort();
        };

    };

    let availableTables ="";
    let options = "";

    if (reservations.length > 1 && tables.length) {

        const openReservation = reservations.find((reservation) => {
            return reservation.reservation_id === Number(reservation_id);
        });

        function isAvailableAndHasCapacity(table) {
            return table.capacity >= openReservation.people && !table.occupied;
        };
        availableTables = tables.filter(isAvailableAndHasCapacity);

    };

    if (availableTables) {
        options = availableTables.map((table) => (
            <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
            </option>
        ));
    };

    return (
        <>  
            <h1>Seat Reservation</h1>
            {options ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="table_id">Select Table</label>
                    <select name="table_id" id="table_id" onChange={handleChange}>
                        <option defaultValue>- Available Options -</option>
                        {options}
                    </select>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => history.goBack()}>
                        Cancel
                    </button>
                </form>
            ) : (
                <p>Loading...</p>
            )}
            <ErrorAlert error={error} />
        </>
    );
};

export default SeatReservation;
