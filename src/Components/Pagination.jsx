export default function Pagination({ curpage, setCurPage, totalPages }) {
    const array = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="d-flex justify-content-center align-items-center mx-3 gap-1">
            <button className="btn w-auto btn-primary p-2" type="button" disabled={curpage === 1 || totalPages === 0} onClick={(e)=>{e.preventDefault(); setCurPage(1);}}><i className="fas fa-backward-fast"></i></button>
            <button className="btn w-auto btn-primary p-2" type="button" onClick={(e) => { e.preventDefault(); setCurPage(curpage - 1) }} disabled={curpage === 1 || totalPages === 0}><i className="fas fa-backward-step"></i></button>

            <select
                value={curpage}
                onChange={(e) => {
                    setCurPage(Number(e.target.value));
                }}
                className="form-select w-auto "
            >
                {array.map((val, index) => (
                    <option value={val} key={index}>
                        {val}
                    </option>
                ))}
            </select>

            <button className="btn w-auto btn-primary" type="button" onClick={() => { setCurPage(curpage + 1) }} disabled={curpage === totalPages || totalPages === 0}><i className="fas fa-forward-step"></i></button>
            <button className="btn w-auto btn-primary" type="button" onClick={() => { setCurPage(totalPages) }} disabled={curpage === totalPages || totalPages === 0}><i className="fas fa-forward-fast"></i></button>
        </div>

    );
}