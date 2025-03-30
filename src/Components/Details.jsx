import React, { useEffect, useState } from 'react'
import './Details.css';
import fetchChannelDetail from '../services/fetchChannelDetail';
import PlaylistDetailCard from './Pages/PlaylistDetailCard'
import ChannelDetailCard from './Pages/ChannelDetailCard'
import TableDetailCard from './Pages/TableDetailCard'
import TableComponent from './Pages/TableComponent';
export default function Details({items}) {
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
            <PlaylistDetailCard handleSelectChange={handleSelectChange} speed={speed} />
            <ChannelDetailCard showChannelDetail={showChannelDetail} setShowChannelDetail={setShowChannelDetail} channelDetail={channelDetail} />
            <TableDetailCard />
            <TableComponent items={items} />
            <div className="d-flex justify-content-center my-2 d-sm-none d-md-none">
                <span className="fw-bold">Scroll to get more details</span>
            </div>
        </>
    )
}
