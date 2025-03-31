import React, { useRef, useState } from 'react'
import formatDuration from '../utils/formatDuration';
import defaultimage from '../assets/Images/default.jpg'
import toastNotification from '../utils/toastNotification';
export default function ListItem({ item, openModal }) {
    const offsetlength = 95;
    const { idx, curtime, detail } = item;
    let { url, width, height } = detail.thumbnails.default;
    const [isLoading, setIsLoading] = useState(true);
    const [imageURL, setImageURL] = useState(url);
    const [showFull, setShowFull] = useState(detail.title.length <= offsetlength);
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

    const Image = () => (<img src={imageURL} width={width} height={height} alt={`Thumbnail for video titled as: ${detail.title}`} onLoad={handleImageLoad} onError={handleImageError} ref={imgRef} style={{ display: "none" }} />);

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
            toastNotification('Failed to copy the URL',"error");
        });
    }
    
    return (
        <>
            <tr onClick={() => openModal(detail.id)}>
                <td>{idx}</td>
                <td>{showFull ? (detail.title) : detail.title.slice(0, offsetlength) + "..."}
                    <span className={`${showFull ? "d-none" : "d-inline"} text-primary`} onClick={() => setShowFull(true)} style={{ cursor: 'pointer' }}>Show Complete</span>
                </td>
                <td>{isLoading && <div>Loading Image...</div>}
                    <Image></Image>
                </td>
                <td>{formatDuration(curtime)}</td>
                <td>{formatDate(detail.publishedAt.slice(0, 10))}</td>
                <td onClick={(e) => { e.stopPropagation() }}>
                    <div className='d-flex flex-row justify-content-center'>
                        <button className='btn border' type='button' title='Preview' onClick={() => openModal(detail.id)}><i className='fas fa-eye'></i></button>
                        <button className='btn border ms-2' type='button' title='Copy' onClick={handleCopy}><i className='fas fa-copy'></i></button>
                    </div>
                </td>
            </tr>
        </>
    )
}
