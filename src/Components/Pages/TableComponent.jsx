import { useEffect, useState } from "react";
import ListItem from "../ListItem";
import ModalWindow from "./ModalWindow";
import useTableContext from "../../hooks/useTableContext";
import useDataContext from "../../hooks/useDataContext";
import toastNotification from "../../utils/toastNotification";
import { DEFAULTCOLS, DEFAULTOFFSETS, isMobile } from "../../constant/values";
export default function TableComponent() {
    const [modalOpen, setModalOpen] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const {
        column,
        setColumn,
        totalColumns,
        leftColumn,
    } = useTableContext();
    const { filteredData: items, time, setTime, setOffset } = useDataContext();
    const [sortState, setSortState] = useState(
        column.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {})
    );
    const [dragStart, setDragStart] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const openModal = (videoId) => {
        setModalOpen(true);
        setVideoId(videoId);
    };

    useEffect(() => {
        setSortState(column.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {}));
    }, [column.length]);

    const closeModal = () => {
        setModalOpen(false);
        setVideoId(null);
    };

    const handleOutsideClick = (e) => {
        const modalContent = document.querySelector(".modal-content");
        if (e.target === modalContent) {
            return;
        } else closeModal();
    };
    const handleDelete = (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item}`)) {
            return;
        }
        setColumn([...column].filter((col) => col != item));
    };
    const handleAdd = (item) => {
        setColumn([...column, item]);
        setOpenAddModal(false);
    };
    const handleColumnNameChange = (e, from) => {
        const to = column.indexOf(e.target.value);
        const newColumn = [...column];
        if (to != -1) {
            if (
                !window.confirm(
                    "This field is already existing, Do you want to perform a swap?"
                )
            ) {
                return;
            }
            const temp = newColumn[from];
            newColumn[from] = newColumn[to];
            newColumn[to] = temp;
            setColumn(newColumn);
        } else {
            newColumn[from] = e.target.value;
            setColumn(newColumn);
        }
    };

    const customizeDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        return new Date(`${year}/${month}/${day}`);
    };

    const helperSortFunction = (callback) => {
        return [...time].sort(callback);
    };

    const handleSortChange = (item) => {
        if (item === "Thumbnail" || item === "Action") {
            toastNotification(
                `Sorry, Can't implement sorting based upon ${item}`,
                "info"
            );
            return;
        }
        let curSortState = column.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {});
        curSortState[item] = sortState[item];
        if (curSortState[item] === "") curSortState[item] = "asc";
        else if (curSortState[item] === "asc") curSortState[item] = "desc";
        else curSortState[item] = "";
        setSortState(curSortState);
        let newList;
        if (curSortState[item] === "") {
            setTime([...time].sort((a, b) => a.idx - b.idx));
            return;
        }
        const asc = curSortState[item] === "asc";
        switch (item) {
            case "Index":
                newList = asc
                    ? helperSortFunction((a, b) => a.idx - b.idx)
                    : helperSortFunction((b, a) => a.idx - b.idx);
                break;
            case "Title":
                newList = asc
                    ? helperSortFunction((a, b) =>
                        a.detail.title.localeCompare(b.detail.title)
                    )
                    : helperSortFunction((b, a) =>
                        a.detail.title.localeCompare(b.detail.title)
                    );
                break;
            case "Duration":
                newList = asc
                    ? helperSortFunction(
                        (a, b) =>
                            a.curtime[0] - b.curtime[0] ||
                            a.curtime[1] - b.curtime[1] ||
                            a.curtime[2] - b.curtime[2] ||
                            a.curtime[3] - b.curtime[3]
                    )
                    : helperSortFunction(
                        (b, a) =>
                            a.curtime[0] - b.curtime[0] ||
                            a.curtime[1] - b.curtime[1] ||
                            a.curtime[2] - b.curtime[2] ||
                            a.curtime[3] - b.curtime[3]
                    );
                break;
            case "Published Date":
                newList = asc
                    ? helperSortFunction(
                        (a, b) =>
                            customizeDate(a.detail.publishedAt) -
                            customizeDate(b.detail.publishedAt)
                    )
                    : helperSortFunction(
                        (b, a) =>
                            customizeDate(a.detail.publishedAt) -
                            customizeDate(b.detail.publishedAt)
                    );
                break;
            case "Views":
                newList = asc
                    ? helperSortFunction(
                        (a, b) => a.statistics.viewCount - b.statistics.viewCount
                    )
                    : helperSortFunction(
                        (b, a) => a.statistics.viewCount - b.statistics.viewCount
                    );
                break;
            case "Likes":
                newList = asc
                    ? helperSortFunction(
                        (a, b) => a.statistics.likeCount - b.statistics.likeCount
                    )
                    : helperSortFunction(
                        (b, a) => a.statistics.likeCount - b.statistics.likeCount
                    );
                break;
            case "Comment Count":
                newList = asc
                    ? helperSortFunction(
                        (a, b) => a.statistics.commentCount - b.statistics.commentCount
                    )
                    : helperSortFunction(
                        (b, a) => a.statistics.commentCount - b.statistics.commentCount
                    );
                break;
            default:
                newList = asc
                    ? helperSortFunction((a, b) => a.idx - b.idx)
                    : helperSortFunction((b, a) => a.idx - b.idx);
        }
        setTime(newList);
    };

    const handleResetClick = (e) => {
        if (window.confirm("Are you sure you want to reset the columns and the number of entities?")) {
            setColumn(DEFAULTCOLS);
            setOffset(DEFAULTOFFSETS);
        }
    }

    const handleDragStart = (e) => {
        setDragStart(e.target.id);
    };
    const handleDragEnter = (e) => {
        if (e.target.id === dragStart) return;
        const from = column.indexOf(dragStart);
        const to = column.indexOf(e.target.id);
        if (to === -1) {
            return;
        }
        const newCol = [...column];
        const temp = newCol[from];
        newCol[from] = newCol[to];
        newCol[to] = temp;
        setColumn(newCol);
    };

    return (
        <>
            <div className="d-flex justify-content-end align-items-end mt-4">
                <button className="btn btn-secondary" type="button" title="Reset Table" onClick={handleResetClick}><i className="fas fa-arrow-rotate-left"></i></button>
            </div>
            {leftColumn.length > 0 &&
                <div className="d-flex pb-2 flex-column">
                    <div className="d-flex justify-content-end">
                    <button
                        className="btn d-flex justify-content-end btn-success text-white gap-1 ms-2 mt-4" style={{ height: "40px" }}
                        type="button"
                        title="Add Columns"
                        onClick={(e) => {
                            setOpenAddModal(!openAddModal);
                            e.stopPropagation();
                        }}
                    >
                        <i
                            className="fas fa-plus pe-1 py-1"
                            style={{ borderRight: "1px solid black" }}
                        ></i>
                        <i className={`fas p-1 fa-caret-${openAddModal ? "up" : "down"}`}></i>
                    </button>
                    </div>
                    {openAddModal &&
                        <div className="d-flex justify-content-end">
                            <ul className={`list-unstyled ps-2 justify-content-end text-end w-${isMobile?"100":"50"}`}>{leftColumn.map((item, index) => (<li className="p-1 form-control" key={index} style={{ cursor: "pointer" }} onClick={() => {handleAdd(item); toastNotification(`${item} is successfully added`)}}>{item}</li>))}</ul>
                        </div>
                    }
                </div>
            }
                <ModalWindow
                    modalOpen={modalOpen}
                    closeModal={closeModal}
                    handleOutsideClick={handleOutsideClick}
                    videoId={videoId}
                />
                {column.length === 0 && <p>
                    No Columns available to display. Add some to begin

                    </p>}
                <div className="table-wrapper" style={{ position: "relative", maxHeight: "100vh", overflow: "auto" }}>
                    <table className="table" onClick={() => setOpenAddModal(false)}>
                        <thead className="position-sticky top-0">
                            <tr>
                                {column.map((item, index) => (
                                    <th
                                        className={"border"}
                                        id={item}
                                        draggable
                                        onDragStart={handleDragStart}
                                        onDragEnter={handleDragEnter}
                                        style={{ backgroundColor: "#f4f4f4" }}
                                        key={index}
                                    >
                                        <div
                                            className={`d-flex flex-${isMobile ? "column" : "row"
                                                } align-items-center justify-content-center`}
                                        >
                                            <select
                                                value={item}
                                                className={`fw-bold bg-white p-2 w-${isMobile ? "100" : "auto"
                                                    } border-0`}
                                                onChange={(e) => handleColumnNameChange(e, index)}
                                            >
                                                {totalColumns.map((col, idx) => (
                                                    <option value={col} className="fw-bold" key={idx}>
                                                        {col}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="d-flex flex-row">
                                                <button
                                                    className="btn"
                                                    type={"button"}
                                                    onClick={() => handleSortChange(item)}
                                                >
                                                    <i
                                                        className={`fas fa-sort${sortState[item] === "asc"
                                                            ? "-up"
                                                            : sortState[item] === "desc"
                                                                ? "-down"
                                                                : ""
                                                            }`}
                                                    ></i>
                                                </button>
                                                <button
                                                    className="btn btn-danger ms-1 h-25 p-2 d-flex justify-content-end"
                                                    type="button"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                return (
                                    <ListItem key={item["idx"]} openModal={openModal} item={item} />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        </>
    );
}
