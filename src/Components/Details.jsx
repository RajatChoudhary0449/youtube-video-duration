import React, { useEffect, useState } from 'react'
import ListItem from './ListItem';
import './Details.css';
import divideTheTime from '../utils/divideTheTime';
import useDataContext from '../hooks/useDataContext';
import formatDuration from '../utils/formatDuration';
import fetchChannelDetail from '../services/fetchChannelDetail';
export default function Details(props) {
    const { items } = props;
    const { offset, setOffset, setCurPage, totalPages } = useDataContext();
    const { time, totalTime } = useDataContext();
    const [speed, setSpeed] = useState(1);
    const [channelDetail, setChannelDetail] = useState({});
    const [firstFetch, setFirstFetch] = useState(false);
    const [showChannelDetail, setShowChannelDetail] = useState(false);
    const handleSelectChange = (e) => {
        setSpeed(Number(e.target.value));
    }
    useEffect(() => {
        const fetchData = async () => {
            const channelId = items[0].detail.channelId;
            const [data, success] = await fetchChannelDetail(channelId);
            setChannelDetail(data);
            setFirstFetch(success);
        }
        if (showChannelDetail && !firstFetch) {
            fetchData();
        }
    }, [showChannelDetail, firstFetch, items])
    if (items.length === 0) return <p>No Items to show</p>;
    return (
        <>
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
                            <h4 className="me-2">Total Pages:</h4>
                            <p className="mb-1">{totalPages}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card p-3 mt-3'>
                <div className='row'>
                    <h4 className='d-flex justify-content-center'>Channel Detail</h4>
                    {showChannelDetail && <>
                        <div className='d-flex justify-content-center'>
                            <img src={channelDetail?.thumbnails?.high?.url} width={500} height={400}></img>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                                <h4 className="me-2">Name:</h4>
                                <p className="mb-1">{channelDetail.title}</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                                <h4 className="me-2">Visit:</h4>
                                <span className='text-primary mb-1' type='button' onClick={() => window.open(`https://www.youtube.com/${channelDetail.customUrl}`, "_blank")}>{channelDetail.customUrl}</span>
                            </div>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                                <h4 className="me-2">Videos:</h4>
                                <p className="mb-1">{channelDetail.videoCount}</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                                <h4 className="me-2">Subscribers:</h4>
                                <p className="mb-1">{channelDetail.subscriberCount}</p>
                            </div>
                        </div>
                    </>

                    }
                    <div className='d-flex justify-content-end'>
                        <button className='btn w-auto fw-bold text-success' type="button" onClick={() => setShowChannelDetail(!showChannelDetail)}>{showChannelDetail ? "Hide " : "Show "} Detail</button>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-end'>
                <h4 className="me-2 mt-3">Entity Per Page:</h4>
                <input className='w-25' value={offset} type='number' min={1} onChange={(e) => {
                    setOffset(Math.max(Number(e.target.value), 1))
                    setCurPage(1);
                }
                }></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className='index-column'>Index</th>
                        <th>Title</th>
                        {/* <th>Channel Name</th> */}
                        <th>Thumbnail</th>
                        <th>Duration</th>
                        <th>Published Date</th>
                        <th>Action</th>
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
