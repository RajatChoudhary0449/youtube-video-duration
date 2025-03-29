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

    return (
        <tr>
            <td>{idx}</td>
            <td>{showFull ? (detail.title) : detail.title.slice(0, offsetlength) + "..."}
                <span className={`${showFull ? "d-none" : "d-inline"} text-primary`} onClick={() => setShowFull(true)} style={{ cursor: 'pointer' }}>Show Complete</span>
            </td>
            <td>{detail.channelTitle}</td>
            <td>{isLoading && <div>Loading...</div>}<Image></Image></td>
            <td>{formatDuration(curtime)}</td>
        </tr>
    )
}
