export default function Pagination({ curpage, setCurPage, totalPages }) {
    const array = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="d-flex justify-content-center align-items-center mx-3">
            <button className="btn w-auto btn-primary me-2" type="button" onClick={(e) => { e.preventDefault(); setCurPage(curpage - 1) }} disabled={curpage === 1 || totalPages === 0}><i className="fas fa-arrow-left"></i>Prev</button>

            <select
                value={curpage}
                onChange={(e) => {
                    setCurPage(Number(e.target.value));
                }}
                className="form-select w-auto mx-3"
            >
                {array.map((val, index) => (
                    <option value={val} key={index}>
                        {val}
                    </option>
                ))}
            </select>

            <button className="btn w-auto btn-primary ms-2" type="button" onClick={() => { setCurPage(curpage + 1) }} disabled={curpage === totalPages || totalPages === 0}>Next<i className="fas fa-arrow-right"></i></button>
        </div>

    );
}