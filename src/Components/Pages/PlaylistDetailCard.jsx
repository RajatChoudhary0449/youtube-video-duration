import useDataContext from "../../hooks/useDataContext"
import formatDuration from '../../utils/formatDuration';
import divideTheTime from '../../utils/divideTheTime';
export default function PlaylistDetailCard({ handleSelectChange, speed }) {
    const { category, totalTime, time } = useDataContext();
    return (
        <div className="card p-3">
            <div className="row">
                <div className='d-flex justify-content-center my-2'>
                    <h4>Trimmed Playlist Detail</h4>
                </div>
                <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                        <h4 className="me-2">Speed:</h4>
                        <select name="speed" onChange={handleSelectChange} className="form-select w-auto">
                            <option value={1}>*1</option>
                            <option value={1.25}>*1.25</option>
                            <option value={1.5}>*1.5</option>
                            <option value={1.75}>*1.75</option>
                            <option value={2}>*2</option>
                            <option value={3}>*3</option>
                            <option value={5}>*5</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                        <h4 className="me-2">Result:</h4>
                        <p className="mb-1">{formatDuration(divideTheTime(totalTime, speed))}</p>
                    </div>
                </div>

                <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                        <h4 className="me-2">Total Videos:</h4>
                        <p className="mb-1">{time.length}</p>
                    </div>
                </div>

                <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                        <h4 className="me-2">Category:</h4>
                        <p className="mb-1">{category}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
