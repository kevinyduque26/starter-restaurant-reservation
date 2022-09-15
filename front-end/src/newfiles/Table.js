import React from "react";

function Table({ tables }) {
    const list = tables.map((table, index) => (
        <tr key={index}>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</td>
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
    )
};

export default Table;