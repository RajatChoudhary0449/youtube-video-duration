import { useEffect, useState } from 'react';
import ListItem from '../ListItem'
import ModalWindow from './ModalWindow';
import useTableContext from '../../hooks/useTableContext';
import useDataContext from '../../hooks/useDataContext';
import toastNotification from '../../utils/toastNotification';
export default function TableComponent() {
    const [modalOpen, setModalOpen] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [videoId, setVideoId] = useState(null);
    const { column, setColumn, totalColumns, leftColumn, addColumn, setAddColumn } = useTableContext();
    const { filteredData: items, time, setTime } = useDataContext();
    const [sortState, setSortState] = useState(Array.from({ length: column.length }, () => ""));
    // const [multipleSort, setMultipleSort] = useState(false);
    const openModal = (videoId) => {
        setModalOpen(true);
        setVideoId(videoId);
    };

    useEffect(() => {
        setSortState(prev => {
            if (prev.length > column.length) return prev.slice(0, column.length);
            else {
                const len = prev.length;
                prev.length = column.length;
                prev.fill("", len, column.length);
                return prev;
            }
        })
    }, [column.length]);

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
        const to = column.indexOf(e.target.value);
        const newColumn = [...column];
        if (to != -1) {
            if (!window.confirm("This field is already existing, Do you want to perform a swap?")) {
                return;
            }
            const temp = newColumn[from]
            newColumn[from] = newColumn[to];
            newColumn[to] = temp;
            setColumn(newColumn);
        }
        else {
            newColumn[from] = e.target.value;
            setColumn(newColumn)
        }
    }

    const customizeDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        return new Date(`${year}/${month}/${day}`);
    }

    const helperSortFunction = (callback) => {
        return [...time].sort(callback);
    }

    const handleSortChange = (index) => {
        if (column[index] === "Thumbnail" || column[index] === "Action") {
            toastNotification(`Sorry, Can't implement sorting based upon ${column[index]}`, "info");
            return;
        }
        let curSortState = [...sortState].map((item, idx) => idx === index ? item : "");
        if (curSortState[index] === "") curSortState[index] = "asc";
        else if (curSortState[index] === "asc") curSortState[index] = "desc";
        else curSortState[index] = "";
        setSortState(curSortState);
        let newList;
        if (curSortState[index] === "") {
            setTime([...time].sort((a, b) => a.idx - b.idx));
            return;
        }
        const asc = curSortState[index] === "asc";
        switch (column[index]) {
            case 'Index': newList = (asc ? helperSortFunction((a, b) => a.idx - b.idx) : helperSortFunction((b, a) => a.idx - b.idx)); break;
            case 'Title': newList = (asc ? helperSortFunction((a, b) => a.detail.title.localeCompare(b.detail.title)) : helperSortFunction((b, a) => a.detail.title.localeCompare(b.detail.title))); break;
            case 'Duration': newList = (asc ? helperSortFunction((a, b) => a.curtime[0] - b.curtime[0] || a.curtime[1] - b.curtime[1] || a.curtime[2] - b.curtime[2] || a.curtime[3] - b.curtime[3]) : helperSortFunction((b, a) => a.curtime[0] - b.curtime[0] || a.curtime[1] - b.curtime[1] || a.curtime[2] - b.curtime[2] || a.curtime[3] - b.curtime[3])); break;
            case 'Published Date': newList = (asc ? helperSortFunction((a, b) => customizeDate(a.detail.publishedAt) - customizeDate(b.detail.publishedAt)) : helperSortFunction((b, a) => customizeDate(a.detail.publishedAt) - customizeDate(b.detail.publishedAt))); break;
            case 'Views': newList = (asc ? helperSortFunction((a, b) => a.statistics.viewCount - b.statistics.viewCount) : helperSortFunction((b, a) => a.statistics.viewCount - b.statistics.viewCount)); break;
            case 'Likes': newList = (asc ? helperSortFunction((a, b) => a.statistics.likeCount - b.statistics.likeCount) : helperSortFunction((b, a) => a.statistics.likeCount - b.statistics.likeCount)); break;
            case 'Comment Count': newList = (asc ? helperSortFunction((a, b) => a.statistics.commentCount - b.statistics.commentCount) : helperSortFunction((b, a) => a.statistics.commentCount - b.statistics.commentCount)); break;
            default: newList = (asc ? helperSortFunction((a, b) => a.idx - b.idx) : helperSortFunction((b, a) => a.idx - b.idx));
        }
        setTime(newList);
    }
    return (
        <div className='table-responsive'>
            <ModalWindow modalOpen={modalOpen} closeModal={closeModal} handleOutsideClick={handleOutsideClick} videoId={videoId} />
            {/* <input type='checkbox' className='mx-2 mt-2 p-2 form-check-input' value={multipleSort} onChange={() => setMultipleSort(!multipleSort)} /><span className='mt-2'>Implement multiple sort</span> */}
            <table className='table'>
                <thead>
                    <tr>
                        {column.map((item, index) => <th className={"border"} style={{ backgroundColor: "#f4f4f4" }} key={index}>
                            <div className={`d-flex flex-${isMobile ? "column" : "row"} align-items-center`}>
                                <select value={item} className={`fw-bold p-2 w-${isMobile ? "100" : "auto"} border-0`} onChange={(e) => handleColumnNameChange(e, index)}>
                                    {totalColumns.map((col, idx) => <option value={col} className='fw-bold' key={idx}>{col}</option>)}
                                </select>
                                <div className='d-flex flex-row'>
                                    <button className='btn' type={"button"} onClick={() => handleSortChange(index)}><i className={`fas fa-sort${sortState[index] === "asc" ? ("-up") : (sortState[index] === "desc" ? "-down" : "")}`}></i></button>
                                    <button className='btn btn-danger ms-1 h-25 p-2 d-flex justify-content-end' type="button" onClick={() => handleDelete(item)}><i className='fas fa-trash'></i></button>
                                </div>
                            </div>
                        </th>)}
                        {leftColumn.length > 0 &&
                            <th className={"d-flex p-2 h-100"} key={"Add"}>
                                <select name={"add"} value={addColumn} onChange={(e) => setAddColumn(e.target.value)} className='w-auto '>
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
