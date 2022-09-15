import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

// Added Imports

import { useState } from "react";
import CreateReservation from "../newfiles/CreateReservation";
import CreateTable from "../newfiles/CreateTable"; 
import SeatReservation from "../newfiles/SeatReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {

  const [date, setDate] = useState(today());

  const query = new URLSearchParams(window.location.search);
  const queryDate = query.get("date")

  if (queryDate && queryDate !== date) {
    setDate(queryDate);
  };
 
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation setDate={setDate} />
      </Route>  
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} />
      </Route>
      <Route path={"/reservations/:reservation_id/seat"}>
          <SeatReservation date={date} />
      </Route> 
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

  // useEffect(() => {
  //   async function loadTables() {
  //     const abortController = new AbortController();
  //     setError(null);
  //     await listTables(abortController.signal)
  //       .then(setTables)
  //       .catch(setError);
  //     return () => abortController.abort();
  //   };
  //   loadTables()
  // }, []);

  // useEffect(() => {
  //   async function loadReservations() {
  //     const abortController = new AbortController();
  //     setError(null);
  //     await listReservations({ date }, abortController.signal)
  //       .then(setReservations)
  //       .catch(setError);
  //     return () => abortController.abort();
  //   };
  //   loadReservations();
  // }, [date]);

  // useEffect(() => {
  //   async function loadUsers() {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/users/1"
  //     );
  //     const userFromAPI = await response.json();
  //     setUser(userFromAPI);
  //   }
  //   loadUsers();
  // }, []);
