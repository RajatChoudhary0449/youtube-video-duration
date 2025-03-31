import { useState } from 'react';
import ListItem from '../ListItem'
import ModalWindow from './ModalWindow';
export default function TableComponent({ items }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const openModal = (videoId) => {
        setModalOpen(true);
        setVideoId(videoId);
    };

    const closeModal = () => {
        setModalOpen(false);
        setVideoId(null);
    };
    const handleOutsideClick = (e) => {
        const modalContent = document.querySelector('.modal-content');
        if (e.target === modalContent) {
            return;
        }
        else closeModal();
    }
    return (
        <div className='table-responsive'>
            <ModalWindow modalOpen={modalOpen} closeModal={closeModal} handleOutsideClick={handleOutsideClick} videoId={videoId} />
            <table className=''>
                <thead>
                    <tr>
                        <th className='index-column'>Index</th>
                        <th>Title</th>
                        <th>Thumbnail</th>
                        <th>Duration</th>
                        <th>Published Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        return (<ListItem key={item['idx']} openModal={openModal} item={item} />)
                    })
                    }
                </tbody>
            </table >
        </div>
    )
}
