import { useState } from "react";
import useDataContext from "../../hooks/useDataContext"
import useTableContext from "../../hooks/useTableContext";
import toastNotification from "./../../utils/toastNotification";
export default function TableDetailCard() {
    const { totalPages, offset, setOffset, setCurPage } = useDataContext()
    const isMobile = window.innerWidth <= 768;
    const { column, setColumn,addColumn,setAddColumn,leftColumn } = useTableContext();
    const [from, setFrom] = useState(column[0]);
    const [to, setTo] = useState(column[0]);
    
    const handleSwap = (e) => {
        e.preventDefault();
        if (from === to) {
            toastNotification("From and To are already same", "error");
            return;
        }
        const newColumn = [...column];
        const fromIdx = newColumn.indexOf(from);
        const toIdx = newColumn.indexOf(to);
        let temp = newColumn[fromIdx];
        newColumn[fromIdx] = newColumn[toIdx];
        newColumn[toIdx] = temp;
        setColumn(newColumn);
        toastNotification(`Column ${newColumn[toIdx]} is successfully swapped with ${newColumn[fromIdx]}`)
    }
    const handleAdd = () => {
        if (!addColumn.length) {
            toastNotification("No items left to add...", "info");
            return;
        }
        setColumn([...column, addColumn]);
        setAddColumn(leftColumn?.[0] || "");
    }
    return (
        <div className='card p-3 mt-3'>
            <div className='row '>
                <div className='d-flex justify-content-center my-2'>
                    <h4>Table Detail</h4>
                </div>
                <div className='col-md-6 d-flex justify-content-start align-items-center'>
                    <h4 className="">Total Pages:</h4>
                    <p className='mt-2'>{totalPages}</p>
                </div>
                <div className='col-md-6 d-flex align-items-center'>
                    <h4 className="me-2">Entity Per Page:</h4>
                    <input className='w-25' value={offset} type='number' min={1} onChange={(e) => {
                        setOffset(Math.max(Number(e.target.value), 1))
                        setCurPage(1);
                    }} />
                </div>
                <div className={`col-md-6 d-flex align-items-center flex-${isMobile ? "column" : "row"}`}>
                    <h5 className="card-title">Swap Columns</h5>
                    <div className="form-group mb-3 mx-2">
                        <label htmlFor="from">From:</label>
                        <select
                            id="from"
                            className="form-select"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        >
                            {column.map((col, index) => (
                                <option key={index} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-3 me-2">
                        <label htmlFor="to">To:</label>
                        <select
                            id="to"
                            className="form-select"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        >
                            {column.map((col, index) => (
                                <option key={index} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex justify-content-center ">
                        <button className="btn btn-primary py-2" onClick={handleSwap}>
                            Swap
                        </button>
                    </div>
                </div>
                <div className={`col-md-6 d-flex align-items-center flex-${isMobile ? "column" : "row"}`}>
                    <h5 className="card-title">Add Columns</h5>
                    <div className="form-group mb-3 mx-2">
                        <label htmlFor="from">Column Name:</label>
                        <select
                            id="addcolumn"
                            className="form-select"
                            value={addColumn}
                            onChange={(e) => setAddColumn(e.target.value)}
                        >
                            {leftColumn.map((col, index) => (
                                <option key={index} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex justify-content-center ">
                        <button className="btn btn-primary py-2" type="button" onClick={handleAdd}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}
