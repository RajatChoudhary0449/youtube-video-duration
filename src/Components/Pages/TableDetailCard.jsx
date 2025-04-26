import { useState } from "react";
import useDataContext from "../../hooks/useDataContext"
export default function TableDetailCard() {
    const { totalPages, offset, setOffset, setCurPage } = useDataContext();
    const [showTableDetail, setShowTableDetail] = useState(false);
    return (
        <div className='container mb-2'>
            <div className="d-flex justify-content-between align-items-center p-2 mb-2">
                <h2 className="mb-0">Table Detail</h2>
                <button className='btn btn-secondary' type="button" onClick={() => setShowTableDetail(!showTableDetail)}><i className={`fas fa-caret-${showTableDetail ? "up" : "down"}`}></i> </button>
            </div>
            {showTableDetail &&
                <>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 px-2">
                                <div className="d-flex justify-content-lg-around justify-content-between align-items-center px-2">
                                    <p className="fs-5 fw-bold w-md-25 w-auto text-start">Total Pages:</p>
                                    <p className="w-50 text-md-start text-end">{totalPages}</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 px-2">
                                <div className="d-flex justify-content-lg-around justify-content-between px-2 align-items-center">
                                    <p className="fs-5 fw-bold w-md-25 w-auto text-start mb-0">Entity Per Page:</p>
                                    <input className='w-25' value={offset} type='number' min={1} onChange={(e) => {
                                        setOffset(Math.max(Number(e.target.value), 1))
                                        setCurPage(1);
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </div>
    )
}
