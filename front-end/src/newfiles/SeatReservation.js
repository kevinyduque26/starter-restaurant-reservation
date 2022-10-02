import React from "react";

import { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { seatReservation } from "../utils/api"
import { listTables } from "../utils/api";

import { readReservation } from "../utils/api";


function SeatReservation() {

    const { reservation_id } = useParams();

    const initialFormState = {
        table_id: "",
        reservation_id: "",
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [reservation, setReservation] = useState([]);
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    const history = useHistory();

    useEffect(loadReservationAndTables, [reservation_id]);

    function loadReservationAndTables() {

        const abortController = new AbortController();
        setError(null);
    
        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);
    
        listTables(abortController.signal)
            .then(setTables)
            .catch(setError);
    
        return () => abortController.abort();
  
    };

    const handleChange = ({ target }) => {
        setFormData({
            [target.name]: target.value,
            reservation_id: reservation_id,
          });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const abortController = new AbortController();
    
        try {
            await seatReservation(formData.table_id, formData.reservation_id, abortController.signal);
            setFormData({ ...initialFormState });
            history.push(`/dashboard`);
        } catch (error) {
            setError(error);
        };
    
        return () => {
          abortController.abort();
        };

    };

    const options = tables.map((table) => {
        const disabled = Number(table.capacity) < Number(reservation.people) || table.occupied ? true : false;
        return (
          <option key={table.table_id} value={table.table_id} disabled={disabled}>
            {table.table_name} - {table.capacity}
          </option>
        );
    });

    return (
        <>  
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_id">
                    Select Table
                    <select 
                        name="table_id" 
                        id="table_id" 
                        value={formData.table_id} 
                        onChange={handleChange} 
                        required={true}
                    >
                        <option>Select Table</option>
                        {options}
                    </select>
                </label>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => history.goBack()}>
                    Cancel
                </button>
            </form>
            <ErrorAlert error={error} />
        </>
    );
};

export default SeatReservation;

    // useEffect(() => {
    //     const abort = new AbortController();
    
    //     async function getReservation() {
    //       try {
    //         const response = await readReservation(reservation_id, abort.signal);
    //         setReservation(response);
    //       } catch (error) {
    //         setError(error);
    //       }
    //     }
    
    //     async function getTables() {
    //       try {
    //         const response = await listTables(abort.signal);
    //         setTables(response);
    //       } catch (error) {
    //         setError(error);
    //       }
    //     }
    //     getReservation();
    //     getTables();
    //     return () => abort.abort();
    // }, [reservation_id]);