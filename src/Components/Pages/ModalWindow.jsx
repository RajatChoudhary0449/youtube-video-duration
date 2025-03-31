import YouTube from "react-youtube"
import './ModalWindow.css'
export default function ModalWindow({ modalOpen, closeModal, videoId, handleOutsideClick }) {
    return (
        <>
            {modalOpen && (
                <div className="modal d-flex h-100" onClick={handleOutsideClick}>
                    <div className="modal-content">
                        <i className="close d-flex justify-content-end text-danger fa-solid fa-circle-xmark" onClick={closeModal}></i>
                        <div className={"video-container"} >
                            <YouTube videoId={videoId} opts={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
