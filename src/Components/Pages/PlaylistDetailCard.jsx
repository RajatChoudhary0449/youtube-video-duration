import useDataContext from "../../hooks/useDataContext"
import formatDuration from '../../utils/formatDuration';
import divideTheTime from '../../utils/divideTheTime';
import { useState } from "react";
import "./../../Styles/Transitions/heightTransition.css";
export default function PlaylistDetailCard({ handleSelectChange, speed }) {
    const { category, totalTime, time } = useDataContext();
    const [showPlaylistDetail, setShowPlaylistDetail] = useState(false);
    return (
        <div className='container mb-2'>
            <div className="d-flex justify-content-between align-items-center p-2 mb-2">
                <h2 className="mb-0">Trimmed Playlist Detail</h2>
                <button className='btn btn-secondary' type="button" onClick={() => setShowPlaylistDetail(!showPlaylistDetail)}><i className={`fas fa-caret-${showPlaylistDetail ? "up" : "down"}`}></i> </button>
            </div>
            <div className={`container main-container ${showPlaylistDetail&&"show"}`}>
                <div className="row">
                    <div className="col-lg-6 col-md-6 p-2 py-3">
                        <div className="d-flex justify-content-between align-items-center px-2">
                            <p className="fs-5 fw-bold w-25 text-start mb-0">Speed:</p>
                            <select name="speed" onChange={handleSelectChange} className="form-select w-50 ">
                                <option value={1}>*1</option>
                                <option value={1.25}>*1.25</option>
                                <option value={1.5}>*1.5</option>
                                <option value={1.75}>*1.75</option>
                                <option value={2}>*2</option>
                                <option value={3}>*3</option>
                                <option value={5}>*5</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-between align-items-center px-2 mt-md-5">
                            <p className="fs-5 fw-bold w-25 w-md-auto text-start">Total Videos:</p>
                            <p className="w-50 text-md-start text-end">{time.length}</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 p-2">
                        <div className="d-flex justify-content-between align-items-center px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Result For Speed:</p>
                            <p className="w-50 text-md-start text-end">{formatDuration(divideTheTime(totalTime, speed))}</p>
                        </div>
                        <div className="d-flex justify-content-between px-2 align-items-center overflow-auto">
                            <p className="fs-5 fw-bold w-25 text-start">Category:</p>
                            <p className="w-50 text-md-start text-end">{category}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
