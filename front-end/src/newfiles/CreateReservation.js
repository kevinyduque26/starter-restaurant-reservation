import React from "react";

// import { useState } from "react";
// import { useHistory } from "react-router-dom";
// import { createReservation } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";
import CreateEditForm from "./CreateEditForm";

function CreateReservation({ setDate }) {
  return (
    <>
      <h1>New Reservation</h1>
      <CreateEditForm type="create" setDate={setDate} />
    </>
  );
};

export default CreateReservation;

