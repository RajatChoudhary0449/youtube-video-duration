import React, { useRef, useState } from 'react'
import formatDuration from '../utils/formatDuration';
import defaultimage from '../assets/Images/default.jpg'
import toastNotification from '../utils/toastNotification';
import { ClipLoader } from 'react-spinners';
import useTableContext from '../hooks/useTableContext';
export default function ListItem({ item, openModal }) {
    const isMobile = window.innerWidth <= 768;
    const offsetlength = isMobile ? 30 : 95;
    const { idx, curtime, detail } = item;
    let { url, width, height } = detail.thumbnails.default;
    const [isLoading, setIsLoading] = useState(true);
    const [imageURL, setImageURL] = useState(url);
    const [showFull, setShowFull] = useState(detail.title.length <= offsetlength);
    const { column } = useTableContext();
    const imgRef = useRef();
    const handleImageLoad = () => {
        setIsLoading(false);
        imgRef.current.style.display = "block";
    };
    const handleImageError = () => {
        setIsLoading(false);
        setImageURL(defaultimage);
        imgRef.current.style.display = "block";
    }

    const formatDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        return `${day}-${month}-${year}`;
    }

    const handleCopy = () => {
        const youtubeLink = `https://www.youtube.com/watch?v=${detail.id}`;
        navigator.clipboard.writeText(youtubeLink).then(() => {
            toastNotification('Video URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toastNotification('Failed to copy the URL', "error");
        });
    }
    const ColumnMapping = {
        "Index": <td key={"Index"} className='align-content-center text-center'>{idx}</td>,
        "Title": <td key={"Title"} className='align-content-center text-center'><div>{showFull ? (detail.title) : detail.title.slice(0, offsetlength) + "..."}
            <span className={`${showFull ? "d-none" : "d-inline"} text-primary`} onClick={() => setShowFull(true)} style={{ cursor: 'pointer' }}>Show Complete</span>
        </div>
        </td>,
        "Thumbnail": <td key={"Thumbnail"} className='align-content-center' style={{ cursor: "pointer" }} onClick={() => openModal(detail.id)}><div className='d-flex justify-content-center'>{isLoading && <div>Loading Image...</div>}
            <ClipLoader loading={isLoading}></ClipLoader>
            <img src={imageURL} width={width} height={height} alt={`Thumbnail for video titled as: ${detail.title}`} onLoad={handleImageLoad} onError={handleImageError} ref={imgRef} style={{ display: "none" }} /></div>
        </td>,
        "Duration": <td key={"Duration"} className='align-content-center text-center'><div>{formatDuration(curtime)}</div></td>,
        "Published Date": <td key={"Published Date"} className='align-content-center text-center'>{formatDate(detail.publishedAt.slice(0, 10))}</td>,
        "Action": <td key={"Action"} className='align-content-center text-center' onClick={(e) => { e.stopPropagation() }}>
            <div className='d-flex flex-row justify-content-center text-center'>
                <button className='btn border' type='button' title='Preview' onClick={() => openModal(detail.id)}><i className='fas fa-eye'></i></button>
                <button className='btn border ms-2' type='button' title='Copy' onClick={handleCopy}><i className='fas fa-copy'></i></button>
            </div>
        </td>,
        "Views": <td key={"Views"} className='align-content-center text-center'><div>{item.statistics.viewCount}</div></td>,
        "Likes": <td key={"Likes"} className='align-content-center text-center'><div>{item.statistics.likeCount}</div></td>,
        "Comment Count": <td key={"Comment Count"} className='align-content-center text-center'><div>{item.statistics.commentCount}</div></td>,
    }
    return (
        <>
            <tr>
                {column.map((col) => ColumnMapping[col] || null)}
            </tr>
        </>
    )
}
