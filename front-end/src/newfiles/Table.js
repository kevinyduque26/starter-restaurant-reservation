import React from "react";

import { getTables } from "../utils/api";
import { clearTable } from "../utils/api";
import { getReservations } from "../utils/api";


function Table({ tables, setTables, setReservations, date, setError }) {

    const abortController = new AbortController();

    const handleFinish = async (event) => {

        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

        if (result) {
            try { 
                await clearTable(event.target.dataset.tableIdFinish, abortController.signal);
                await getTables(abortController.signal)
                    .then((tables) => setTables(tables));
                await getReservations(date, abortController.signal)
                    .then((reservations) => setReservations(reservations))
            } catch (error) {
                setError(error);
            };

            return () => {
                abortController.abort();
            };
        };
    };

    const list = tables.map((table, index) => (
        <tr key={index}>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
            {table.reservation_id ? (
                <td><button 
                        type="button" 
                        data-table-id-finish={table.table_id}
                        onClick={handleFinish}
                    >Finish</button></td>
            ) : (null)}
        </tr>
    ));

    return (
        <table>
            <thead>
                <tr>
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
        </table>
    );

};

export default Table;
