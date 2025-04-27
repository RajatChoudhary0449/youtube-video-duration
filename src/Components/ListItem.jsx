import React, { useRef, useState } from 'react'
import defaultimage from '../assets/Images/default.jpg'
import toastNotification from '../utils/toastNotification';
import useTableContext from '../hooks/useTableContext';
import {  isMobile } from '../constant/values';
import formatDuration from "../utils/formatDuration";
import { ClipLoader } from "react-spinners";
import "./../Styles/Transitions/ImageOverlay.css"
export default function ListItem({ item, openModal }) {
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
    const getColumn = (item, column) => {
        switch (column) {
          case "Index":
            return (
              <td key={"Index"} className="align-content-center text-center">
                {idx}
              </td>
            );
          case "Title":
            return (
              <td key={"Title"} className="align-content-center text-center">
                <div>
                  {showFull
                    ? detail.title
                    : detail.title.slice(0, offsetlength) + "..."}
                  <span
                    className={`${showFull ? "d-none" : "d-inline"} text-primary`}
                    onClick={() => setShowFull(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Show Complete
                  </span>
                </div>
              </td>
            );
          case "Thumbnail":
            return (
              <td
                key={"Thumbnail"}
                className="align-content-center"
                style={{ cursor: "pointer" }}
                onClick={() => openModal(detail.id)}
              >
                <div className="d-flex justify-content-center">
                  {isLoading && <div>Loading Image...</div>}
                  <ClipLoader loading={isLoading}></ClipLoader>
                  <div className="imageContainer">
                    <img
                      src={imageURL}
                      width={width}
                      height={height}
                      alt={`Thumbnail for video titled as: ${detail.title}`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      ref={imgRef}
                      style={{ display: "none" }}
                      className="rounded-3"
                    />
                    <div
                      className="overlay top-0 rounded-3"
                      style={{ width: width, height: height }}
                    >
                      Tap to Play
                    </div>
                  </div>
                </div>
              </td>
            );
          case "Duration":
            return (
              <td key={"Duration"} className="align-content-center text-center">
                <div>{formatDuration(curtime)}</div>
              </td>
            );
          case "Published Date":
            return (
              <td key={"Published Date"} className="align-content-center text-center">
                {formatDate(detail.publishedAt.slice(0, 10))}
              </td>
            );
          case "Action":
            return (
              <td
                key={"Action"}
                className="align-content-center text-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="d-flex flex-row justify-content-center text-center">
                  <button
                    className="btn border"
                    type="button"
                    title="Preview"
                    onClick={() => openModal(detail.id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn border ms-2"
                    type="button"
                    title="Copy"
                    onClick={handleCopy}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </td>
            );
          case "Views":
            return (
              <td key={"Views"} className="align-content-center text-center">
                <div>{item.statistics.viewCount}</div>
              </td>
            );
          case "Likes":
            return (
              <td key={"Likes"} className="align-content-center text-center">
                <div>{item.statistics.likeCount}</div>
              </td>
            );
          case "Comment Count":
            return (
              <td key={"Comment Count"} className="align-content-center text-center">
                <div>{item.statistics.commentCount}</div>
              </td>
            );
        }
        return <td>Undefined</td>;
      };
    return (
        <>
            <tr>
                {column.map((col) => getColumn(item,col)|| null)}
            </tr>
        </>
    )
}
