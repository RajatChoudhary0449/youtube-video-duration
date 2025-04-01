import { useEffect, useRef, useState } from "react";
import defaultImage from './../../assets/Images/default.jpg'
import { ClipLoader } from "react-spinners";
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
        <div className='card p-3 mt-3'>
            <div className='row'>
                <h4 className='d-flex justify-content-center'>Channel Detail</h4>
                {showChannelDetail && <>
                    <div className='d-flex justify-content-center flex-column'>
                        {loading && <div className="d-flex justify-content-center">Loading Image...</div>}
                        <div className="d-flex justify-content-center mb-2">
                            <ClipLoader loading={loading}></ClipLoader>
                        </div>
                        <div className="d-flex justify-content-center">
                            <img src={imageUrl} ref={imgRef} onLoad={handleOnLoad} onError={handleOnError} style={{ maxWidth: "500px", display: "none" }} width={"80%"} height={"auto"}></img>
                        </div>
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
    )
}
