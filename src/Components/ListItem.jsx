import React, { useState } from 'react'
import formatDuration from '../utils/formatDuration';
import defaultimage from '../assets/Images/default.jpg'
export default function ListItem({ item }) {
    const offsetlength = 95;
    const { idx, curtime, detail } = item;
    let { url, width, height } = detail.thumbnails.default;
    const [isLoading, setIsLoading] = useState(true);
    const [imageURL, setImageURL] = useState(url);
    const [showFull, setShowFull] = useState(detail.title.length <= offsetlength);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setImageURL(defaultimage);
    }

    const Image = () => (<img src={imageURL} width={width} height={height} alt={`Thumbnail for video titled as: ${detail.title}`} onLoad={handleImageLoad} onError={handleImageError} />);

    const formatDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        return `${day}-${month}-${year}`;
    }
    return (
        <tr>
            <td>{idx}</td>
            <td>{showFull ? (detail.title) : detail.title.slice(0, offsetlength) + "..."}
                <span className={`${showFull ? "d-none" : "d-inline"} text-primary`} onClick={() => setShowFull(true)} style={{ cursor: 'pointer' }}>Show Complete</span>
            </td>
            {/* <td>{detail.channelTitle}</td> */}
            <td>{isLoading && <div>Loading...</div>}<Image></Image></td>
            <td>{formatDuration(curtime)}</td>
            <td>{formatDate(detail.publishedAt.slice(0, 10))}</td>
            <td><button className='btn border' type='button' onClick={()=>window.open(`https://www.youtube.com/watch?v=${detail.id}`, '_blank')}>Watch</button></td>
        </tr>
    )
}
