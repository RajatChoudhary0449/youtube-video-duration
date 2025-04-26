import { useEffect, useRef, useState } from "react";
import defaultImage from './../../assets/Images/default.jpg'
import { ClipLoader } from "react-spinners";
import './../../App.css'
import './../../Styles/Transitions/heightTransition.css'

export default function ChannelDetailCard({ showChannelDetail, setShowChannelDetail, channelDetail }) {
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(channelDetail?.thumbnails?.medium?.url)
    useEffect(() => {
        setImageUrl(channelDetail?.thumbnails?.high?.url);
    }, [channelDetail])
    const imgRef = useRef();
    const handleOnLoad = () => {
        setLoading(false);
        imgRef.current.style.display = "block";
    }
    const handleOnError = () => {
        setLoading(false);
        setImageUrl(defaultImage);
        imgRef.current.style.display = "block"
    }
    return (
        <div className='container mb-2'>
            <div className="d-flex justify-content-between align-items-center p-2 mb-2">
                <h2 className="mb-0">Channel Detail</h2>
                <button className='btn btn-secondary' type="button" onClick={() => setShowChannelDetail(!showChannelDetail)}><i className={`fas fa-caret-${showChannelDetail ? "up" : "down"}`}></i> </button>
            </div>
            <div className={`container main-container ${showChannelDetail && "show"}`}>
                <div className="row">
                    <div className="col-lg-6 col-md-6 p-2">
                        <div className='d-flex justify-content-center flex-column'>
                            {loading && <div className="d-flex justify-content-center">Loading Image...</div>}
                            <div className="d-flex justify-content-center mb-2">
                                <ClipLoader loading={loading}></ClipLoader>
                            </div>
                            <div className="d-flex justify-content-center">
                                <img src={imageUrl} ref={imgRef} onLoad={handleOnLoad} onError={handleOnError} style={{ maxWidth: "25rem", display: "none" }} width={"80%"} height={"auto"}></img>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 px-2 mt-3 mt-md-0 p-md-2 py-md-3">
                        <div className="d-flex justify-content-lg-around justify-content-between px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Name:</p>
                            <p className="w-50 text-md-start text-end">{channelDetail?.title}</p>
                        </div>
                        <div className="d-flex justify-content-lg-around justify-content-between px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Visit:</p>
                            <span className='text-primary w-50 text-md-start text-end' type='button' onClick={() => window.open(`https://www.youtube.com/${channelDetail?.customUrl}`, "_blank")}>{channelDetail?.customUrl}</span>
                        </div>
                        <div className="d-flex justify-content-lg-around justify-content-between px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Video:</p>
                            <p className="w-50 text-md-start text-end">{channelDetail?.videoCount}</p>
                        </div>
                        <div className="d-flex justify-content-lg-around justify-content-between px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Subscriber:</p>
                            <p className="w-50 text-md-start text-end">{channelDetail?.subscriberCount}</p>
                        </div>
                        <div className="d-flex justify-content-lg-around justify-content-between px-2">
                            <p className="fs-5 fw-bold w-25 text-start">Viewers:</p>
                            <p className="w-50 text-md-start text-end">{channelDetail?.viewCount}</p>
                        </div>
                        <div className="d-flex justify-content-lg-around justify-content-between px-2 align-items-center">
                            <p className="fs-5 fw-bold w-25 text-start">Keywords:</p>
                            <p className="w-50 text-md-start text-end">{channelDetail?.channel?.keywords?.length>30?channelDetail?.channel?.keywords?.slice(0,30)+"...":channelDetail?.channel?.keywords}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
