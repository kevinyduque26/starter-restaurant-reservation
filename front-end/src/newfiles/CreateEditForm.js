import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
// import { readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// import { useParams } from "react-router";
import { updateReservation } from "../utils/api";


function CreateEditForm({ type, setDate, reservation }) {

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
 
  const [formData, setFormData] = useState(type === "edit" ? { ...reservation } : { ...initialFormState });
  const [error, setError] = useState(null);


  const handleChange = ({ target }) => {

    setFormData({
      ...formData,
      [target.name]: target.value,
    });

  };

  const history = useHistory();
  const abortContoller = new AbortController();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Define the properties required
    const { reservation_date, reservation_time, people } = formData;

    // Define date objects needed
    const currentDate = new Date();
    const dateConverted = new Date(`${reservation_date} ${reservation_time}`);

    try {

      // Date validation  
      if (dateConverted.getDay() === 2) {
        throw new Error("Tuesday is not a valid selection as the restaurant is closed");
      };
  
      if (dateConverted < currentDate) {
        throw new Error("Reservations cannot be made on past dates");
      };

      // Time validation
      if (reservation_time < "10:30") {
        throw new Error("The reservation time must be after 10:30 AM");
      };
  
      if (reservation_time > "21:30") {
        throw new Error("The reservation time must be before 9:30 PM");
      };

      // Convert people value to number
      const peopleInt = parseInt(people);

      // Create a new formData with changes to people data 
      const newFormData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_number: formData.mobile_number,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        people: peopleInt
      };

      // Create or update the reservation

      if (type === "edit") {
        await updateReservation(formData.reservation_id, newFormData, abortContoller.signal);
      } else {
        await createReservation(newFormData, abortContoller.signal);
      };

      // Change state of "date", reset form, and push user to dashboard
      setDate(reservation_date);
      setFormData({ ...initialFormState });
      history.push(`/dashboard?date=${reservation_date}`);

    } catch (error) {
      
      setError(error);

    };

    return () => {
      abortContoller.abort();
    };

  };



  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">
          First Name
          <input
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
          />
        </label>
        <label htmlFor="last_name">
          Last Name
          <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
          />
        </label>
        <label htmlFor="mobile_number">
          Mobile Number
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </label>
        <label htmlFor="reservation_date">
          Reservation Date
          <input
            id="reservation_date"
            type="date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
          />
        </label>
        <label htmlFor="reservation_time">
          Reservation Time
          <input
            id="reservation_time"
            type="time"
            name="reservation_time"
            pattern="[0-9]{2}:[0-9]{2}"
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </label>
        <label htmlFor="people">
          People
          <input
            id="people"
            type="number"
            name="people"
            min="1"
            onChange={handleChange}
            value={formData.people}
          />
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
      <ErrorAlert error={error} />
    </>
  )
};

export default CreateEditForm;