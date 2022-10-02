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
import Search from "../newfiles/Search";
import EditReservation from "../newfiles/EditReservation";


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
        <SeatReservation />
      </Route> 
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation setDate={setDate} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

