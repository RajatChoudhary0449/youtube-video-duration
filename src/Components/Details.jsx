import React, { useState } from 'react'
import ListItem from './ListItem';
import './Details.css';
import divideTheTime from '../utils/divideTheTime';
import useDataContext from '../hooks/useDataContext';
import formatDuration from '../utils/formatDuration';
export default function Details(props) {
    const { items } = props;
    const { offset, setOffset, setCurPage, totalPages } = useDataContext();
    const { time, totalTime } = useDataContext();
    const [speed, setSpeed] = useState(1);
    const handleSelectChange = (e) => {
        setSpeed(Number(e.target.value));
    }
    if (items.length === 0) return <p>No Items to show</p>;
    return (
        <>
            <div className="card p-3">
                <div className="row">
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
                            <h4 className="me-2">Total Pages:</h4>
                            <p className="mb-1">{totalPages}</p>
                        </div>
                    </div>
                    <div className="col-md-6 mb-2">
                        <div className="d-flex align-items-center">
                            <h4 className="me-2">Entity Per Page:</h4>
                            <input className='w-25' value={offset} type='number' min={1} onChange={(e) => {
                                setOffset(Math.max(Number(e.target.value), 1))
                                setCurPage(1);
                            }
                            }></input>
                        </div>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className='index-column'>Index</th>
                        <th>Title</th>
                        <th>Channel Name</th>
                        <th>Thumbnail</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        return (<ListItem key={item['idx']} item={item} ></ListItem>)
                    })
                    }
                </tbody>
            </table >
        </>
    )
}
