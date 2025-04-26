import React, { useEffect, useState } from 'react'
import './Details.css';
import fetchChannelDetail from '../services/fetchChannelDetail';
import PlaylistDetailCard from './Pages/PlaylistDetailCard'
import ChannelDetailCard from './Pages/ChannelDetailCard'
import TableDetailCard from './Pages/TableDetailCard'
import TableComponent from './Pages/TableComponent';
import useDataContext from '../hooks/useDataContext';
export default function Details() {
    const { filteredData: items, data } = useDataContext();
    const [speed, setSpeed] = useState(1);
    const [channelDetail, setChannelDetail] = useState([]);
    const [showChannelDetail, setShowChannelDetail] = useState(false);
    const [show, setShow] = useState(true);
    const handleSelectChange = (e) => {
        setSpeed(Number(e.target.value));
    }
    useEffect(() => {
        const fetchData = async () => {
            if (!data.length) return;
            const channelId = [...new Set(data.map(entry => entry.snippet.channelId))].slice(0, 2);
            if (channelId.length > 1) {
                setShow(false);
                return;
            }
            const [response] = await fetchChannelDetail(channelId[0]);
            setChannelDetail(response);
        }
        fetchData();
    }, [data])
    if (items.length === 0) return <p>No Items to show</p>;
    return (
        <>
            <PlaylistDetailCard handleSelectChange={handleSelectChange} speed={speed} />
            {show && <ChannelDetailCard showChannelDetail={showChannelDetail} setShowChannelDetail={setShowChannelDetail} channelDetail={channelDetail[0]} />}
            <TableDetailCard />
        </>
    )
}
