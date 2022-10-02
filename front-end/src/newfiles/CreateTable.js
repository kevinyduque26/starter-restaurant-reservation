import React from "react";

import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable({ setTables }) {

    const initialFormState = {
        table_name: "",
        capacity: 0,
    };

    const [formData, setFormData] = useState({ ...initialFormState });
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
        const { capacity } = formData;
    
        try {

            // Convert people value to number
            const capacityInt = parseInt(capacity);

            // Create a new formData with changes to people data 
            const newFormData = {
                ...formData,
                capacity: capacityInt
            };

            await createTable(newFormData, abortContoller.signal);
            setFormData({ ...initialFormState });
            history.push(`/dashboard`);

        } catch (error) {

            setError(error);

        };
    
        return () => {
          abortContoller.abort();
        };
    
    };

    return (
        <>
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Table Name
                    <input
                        id="table_name"
                        type="text"
                        name="table_name"
                        minlength="2"
                        onChange={handleChange}
                        value={formData.table_name}
                    />
                </label>
                <label htmlFor="capacity">
                    Capacity
                    <input
                        id="capacity"
                        type="number"
                        name="capacity"
                        min="1"
                        onChange={handleChange}
                        value={formData.capacity}
                    />
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


export default CreateTable;


