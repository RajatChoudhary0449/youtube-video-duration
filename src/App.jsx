import './App.css';
import React, { useEffect, useRef, useState } from 'react'
import divideTheTime from './utils/divideTheTime';
import formatDuration from './utils/formatDuration';
import useDataContext from './hooks/useDataContext';
import validation from './validation/validation';
import getTimeAndDetailsFromData from './services/getTimeAndDetailsFromData';
import fetchIDs from './services/fetchIDs';
import fetchDetailsFromIds from './services/fetchDetailsFromIds';
import fetchCategoryDetailFromVideoDetail from './services/fetchCategoryDetailFromVideoDetail';
import Details from './Components/Details';
import Pagination from './Components/Pagination';
import { DEFAULTSTART, DEFAULTEND } from './constant/values';
function App() {
  const { setData, time, setTime, curpage, setCurPage, totalPages, setTotalPage, settotalTime, offset, setCategory } = useDataContext();
  const [link, setLink] = useState("")
  const [start, setStart] = useState(DEFAULTSTART)
  const [end, setEnd] = useState(DEFAULTEND)
  const [fetching, setFetching] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [averageMessage, setAverageMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDetail, setShowDetail] = useState(false);

  const inputref = useRef();
  useEffect(() => {
    setTotalPage(Math.ceil((time.length) / offset));
  }, [time, offset, setTotalPage]);

  useEffect(() => {
    setFilteredData(time.slice((curpage - 1) * offset, curpage * offset));
  }, [time, curpage, offset]);

  const handleformrequest = async (e) => {
    e.preventDefault();
    setData([]);
    setTime([]);
    setFilteredData([]);
    setResultMessage([]);
    setAverageMessage([]);
    const [validated, validationMessage] = validation(start, end, link);
    if (!validated) {
      alert(validationMessage);
      return;
    }
    setFetching(true);
    const [videoIds, message] = await fetchIDs(link);
    if (videoIds.length === 0) {
      setFetching(false);
      alert(message);
      return;
    }
    const [res, curmessage] = await fetchDetailsFromIds(videoIds);
    if (res.length === 0) {
      setFetching(false);
      alert(curmessage);
      return;
    }

    if (start > res.length || (end !== DEFAULTEND && end > res.length)) {
      setData([]);
      setStart(DEFAULTSTART);
      setEnd(DEFAULTEND);
      setFetching(false);
      alert("Start or End out of range");
      return;
    }
    const [curcategory, categoryMessage] = await fetchCategoryDetailFromVideoDetail(res);
    if (!curcategory.length) {
      setData([]);
      setStart(DEFAULTSTART);
      setEnd(DEFAULTEND);
      setFetching(false);
      alert(categoryMessage);
      return;
    }
    setCategory(curcategory);
    const rawtimes = await getTimeAndDetailsFromData(res, start, end);
    const curtotaltime = rawtimes?.[rawtimes.length - 1]?.['totaltime'];
    setData(res);
    setTime(rawtimes);
    settotalTime(curtotaltime);
    setResultMessage(`Total Duration: ${formatDuration(curtotaltime)}`);
    setAverageMessage(`Average Duration: ${formatDuration(divideTheTime(curtotaltime, rawtimes.length))}`);
    setFetching(false);
  }

  const handleStartChange = (e) => {
    if (e.target.value === "") setStart(DEFAULTSTART);
    else setStart(Math.max(Math.floor(Number(e.target.value)), 1))
  }

  const handleEndChange = (e) => {
    if (e.target.value === "") setEnd(DEFAULTEND);
    else setEnd(Math.max(Math.floor(Number(e.target.value)), 1))
  }
  const handlechangelink = (e) => {
    const cur = e.target.value;
    setLink(cur);
    setCurPage(1);
  }

  return (
    <div className="container">
      <h1>YouTube Playlist Duration Calculator</h1>
      <form onSubmit={handleformrequest}>
        <label htmlFor="link">Enter the link of the YouTube playlist:<i className="fa fa-asterisk text-danger"></i>
        </label>
        <input type="text" id="link" ref={inputref} placeholder="Playlist URL" disabled={fetching} autoFocus value={link} onChange={(e) => { handlechangelink(e); }}></input>
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setLink("")}>Clear</span>

        <label htmlFor="start">Starting Video Index (1-based):</label>
        <input type="number" id="start" placeholder="Start Index(Optional)" value={(start === DEFAULTSTART) ? '' : start} onChange={handleStartChange} min={1} step={1} disabled={fetching} />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setStart(DEFAULTSTART)}>Clear</span>

        <label htmlFor="end">Ending Video Index (1-based):</label>
        <input type="number" step="1" id="end" placeholder="End Index(Optional)" value={end === DEFAULTEND ? '' : end} min={1} onChange={handleEndChange} disabled={fetching} />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setEnd(DEFAULTEND)}>Clear</span>

        <button id="calculate" type='submit' className={`btn btn-${fetching ? "secondary" : "success"} p-2 my-2`} disabled={fetching}>{fetching ? "Fetching..." : "Get Total Duration"}</button>
        <p>{resultMessage}</p>
        <p>{averageMessage}</p>
        
        {!fetching &&
          <>
            <div className="Link-header">
              <a href="/" className="App-link my-2" onClick={(e) => { e.preventDefault(); setShowDetail(!showDetail) }}>{showDetail ? "hide" : "show"} details</a>
            </div>
            <div className="Details" >
              {showDetail && <>
                <Details items={filteredData} />
                <Pagination totalPages={totalPages}></Pagination>
              </>}
            </div>
          </>
        }
      </form >
    </div >
  );
}

export default App;