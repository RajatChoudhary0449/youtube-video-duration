import useDataContext from "../../hooks/useDataContext"
export default function TableDetailCard() {
    const { totalPages, offset, setOffset, setCurPage } = useDataContext()
    return (
        <div className='card p-3 mt-3'>
            <div className='row '>
                <div className='d-flex justify-content-center my-2'>
                    <h4>Table Detail</h4>
                </div>
                <div className='col-md-6 d-flex justify-content-between align-items-center'>
                    <h4 className="">Total Pages:</h4>
                    <p className='mt-2'>{totalPages}</p>
                </div>
                <div className='col-md-6 d-flex justify-content-between align-items-center'>
                    <h4 className="me-2">Entity Per Page:</h4>
                    <input className='w-25' value={offset} type='number' min={1} onChange={(e) => {
                        setOffset(Math.max(Number(e.target.value), 1))
                        setCurPage(1);
                    }} />
                </div>
            </div>
        </div >
    )
}
