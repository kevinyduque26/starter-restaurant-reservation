import React from "react";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

// Added imports

import Reservation from "../newfiles/Reservation";
import Table from "../newfiles/Table";
import { today, previous, next } from "./../utils/date-time";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import { useState } from "react";
import { useEffect } from "react";
import ErrorAlert from "../layout/ErrorAlert";


// Function

function Dashboard({ date, setDate }) {

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(loadReservationsAndTables, [date]);

  function loadReservationsAndTables() {

    const abortController = new AbortController();
    setError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();

  };

  const history = useHistory();

  const handlePrevious = ((event) => {
    event.preventDefault();
    setDate(previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  });

  const handleToday = ((event) => {
    event.preventDefault();
    setDate(today());
    history.push(`/dashboard?date=${today()}`);
  });

  const handleNext = ((event) => {
    event.preventDefault();
    setDate(next(date));
    history.push(`/dashboard?date=${next(date)}`);
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        <button type="button" onClick={handlePrevious}>Previous</button>
        <button type="button" onClick={handleToday}>Today</button>
        <button type="button" onClick={handleNext}>Next</button>
      </div>
      <Reservation reservations={reservations} />
      <Table tables={tables} setTables={setTables} setReservations={setReservations} date={date} setError={setError}/>
      <ErrorAlert error={error} />
    </main>
  );
};

export default Dashboard;
