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

    const list = tables.map((table) => (
        <div className="col">
            <div key={table.table_id} className="card">
                <div className="card-header">
                    {table.table_name}
                    {table.reservation_id ? (
                    <button 
                            type="button" 
                            data-table-id-finish={table.table_id}
                            onClick={handleFinish}
                            className="btn text-primary float-right"
                        >Finish</button>
                ) : (null)}
                </div>
                <div className="card-body">
                    <div>
                        <td>{`Capacity: ${table.capacity}`}</td>
                    </div>
                    <div>
                        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
                    </div>
                </div>           
            </div>            
        </div>

    ));

    return (
        <>
            <div className="mb-3">
                <h3>Tables</h3>
            </div>
            <div className="row">
                {list}
            </div>           
        </>

    );

};

export default Table;
