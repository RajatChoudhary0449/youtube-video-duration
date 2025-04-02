import { useState } from 'react';
import ListItem from '../ListItem'
import ModalWindow from './ModalWindow';
import useTableContext from '../../hooks/useTableContext';
export default function TableComponent({ items }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const { column, setColumn, totalColumns, leftColumn, addColumn, setAddColumn } = useTableContext();

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
    const handleDelete = (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item}`)) {
            return;
        }
        setColumn([...column].filter(col => col != item));
    }
    const handleAdd = () => {
        setColumn([...column, addColumn]);
    }
    const handleColumnNameChange = (e, from) => {
        const to=column.indexOf(e.target.value);
        const newColumn=[...column];
        if(to!=-1)
        {
            if(!window.confirm("This field is already existing, Do you want to perform a swap?"))
            {
                return;
            }
            const temp=newColumn[from]
            newColumn[from]=newColumn[to];
            newColumn[to]=temp;
            setColumn(newColumn);
        }
        else
        {
            newColumn[from]=e.target.value;
            setColumn(newColumn)
        }
    }
    return (
        <div className='table-responsive'>
            <ModalWindow modalOpen={modalOpen} closeModal={closeModal} handleOutsideClick={handleOutsideClick} videoId={videoId} />
            <table className='table'>
                <thead>
                    <tr>
                        {column.map((item, index) => <th className={"border"} style={{ backgroundColor: "#f4f4f4" }} key={index}>
                            <div className='d-flex flex-row align-items-center'>
                                <select value={item} className='fw-bold p-2 w-auto' onChange={(e) => handleColumnNameChange(e, index)}>
                                    {totalColumns.map((col, idx) => <option value={col} className='fw-bold' key={idx}><strong>{col}</strong></option>)}
                                </select>
                                <button className='btn btn-danger ms-2 h-25 p-2 d-flex justify-content-end' type="button" onClick={() => handleDelete(item)}><i className='fas fa-trash'></i></button>
                            </div>
                        </th>)}
                        {leftColumn.length > 0 &&
                            <th className={"d-flex p-2 h-100"} key={"Add"}>
                                <select name={"add"} value={addColumn} onChange={(e) => setAddColumn(e.target.value)} className='w-50'>
                                    {leftColumn.map((col, index) => <option value={col} key={index}>{col}</option>)}
                                </select>
                                <button className='btn d-inline bg-success text-white ms-2' type='button' onClick={handleAdd}><i className='fas fa-plus'></i></button>
                            </th>
                        }
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
