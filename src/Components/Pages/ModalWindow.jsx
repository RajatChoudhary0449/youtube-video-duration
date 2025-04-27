import YouTube from "react-youtube"
import './ModalWindow.css'
export default function ModalWindow({ modalOpen, closeModal, videoId, handleOutsideClick }) {
    return (
        <>
            {modalOpen && (
                <div className="modal d-flex h-100" onClick={handleOutsideClick}>
                    <i className="close position-absolute justify-content-end fa-solid fa-x text-white" onClick={closeModal} ></i>
                    <div className="modal-content">
                        <div className={"video-container"} >
                            <YouTube videoId={videoId} opts={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
