import React from "react";
import { useState } from "react";
import { searchForReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";


function Search() {

    const initialFormState = {
        mobile_number: "",
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState(null);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function formatPhoneNumber(number) {

        let setOne = [];
        let setTwo = [];
        let setThree = [];

        for (let i = 0; i < number.length; i++) {

            if (i < 3) {
                setOne.push(number[i]);
            };

            if (i > 2 && i < 6) {
                setTwo.push(number[i]);
            };

            if (i > 5 && i < number.length) {
                setThree.push(number[i]);
            };

        };

        setOne = setOne.join("");
        setTwo = setTwo.join("");
        setThree = setThree.join("");

        return setOne + "-" + setTwo + "-" + setThree;

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let newFormData = {
            mobile_number: formData.mobile_number
        };

        if (formData.mobile_number.length !== 12) {
            newFormData = {
                mobile_number: formatPhoneNumber(formData.mobile_number)
            };
        };

        const abortContoller = new AbortController();
    
        try {    

            const data = await searchForReservation(newFormData.mobile_number, abortContoller.signal);
            setSearchResults(data);

        } catch (error) {
          
          setError(error);
    
        };
    
        return () => {
          abortContoller.abort();
        };
    
    };

    return (
        <>
            <h1>Find reservations</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mobile_number">
                    Search by phone number
                    <input 
                        id="mobile_number"
                        type="text"
                        name="mobile_number"
                        placeholder="Enter a customer's phone number"
                        onChange={handleChange}
                        value={formData.mobile_number}
                    />
                </label>
                <button type="submit">Find</button>
            </form>
            {searchResults !== null && searchResults.length === 0 && <p>No reservations found</p>}
            {searchResults !== null && searchResults.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Reservation Date</th>
                                <th>Reservation Time</th>
                                <th>Name</th>
                                <th>People</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.reservation_date}</td>
                                    <td>{reservation.reservation_time}</td>
                                    <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
                                    <td>{reservation.people}</td>
                                    <td>{reservation.mobile_number}</td>
                                    <td>{reservation.status}</td>
                                    {reservation.status === "booked" ? (
                                        <>
                                            <td><Link to={`/reservations/${reservation.reservation_id}/edit`} role="button">Edit</Link></td>
                                        </>

                                    ): (null)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
            )}
            <ErrorAlert error={error}/>
        </>
    )

}

export default Search;