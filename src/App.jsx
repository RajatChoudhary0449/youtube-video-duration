import './App.css';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import divideTheTime from './utils/divideTheTime';
import formatDuration from './utils/formatDuration';
import toastNotification from './utils/toastNotification';
import useDataContext from './hooks/useDataContext';
import validation from './validation/validation';
import getTimeAndDetailsFromData from './services/getTimeAndDetailsFromData';
import fetchIDs from './services/fetchIDs';
import fetchDetailsFromIds from './services/fetchDetailsFromIds';
import fetchCategoryDetailFromVideoDetail from './services/fetchCategoryDetailFromVideoDetail';
import Details from './Components/Details';
import Pagination from './Components/Pagination';
import { DEFAULTSTART, DEFAULTEND } from './constant/values';
import { SyncLoader } from 'react-spinners'
function App() {
  const { setData, setTime, curpage, setCurPage, totalPages, settotalTime, setCategory, setFilteredData } = useDataContext();
  const [link, setLink] = useState("")
  const [start, setStart] = useState(DEFAULTSTART)
  const [end, setEnd] = useState(DEFAULTEND)
  const [fetching, setFetching] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [averageMessage, setAverageMessage] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const placeholderRef = useRef(0);
  const showButtonRef = useRef(null);
  const array = useMemo(() => [
    "https://www.youtube.com/playlist?list=UID",
    "https://www.youtube.com/watch?v=UID&list=UID"
  ], []);
  const intervalRef = useRef();

  useEffect(() => {
    if (!link.length) {
      intervalRef.current = setInterval(() => {
        placeholderRef.current = (placeholderRef.current + 1) % array.length;
        inputref.current.placeholder = array[placeholderRef.current];
      }, 2000);
    }
    else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) };
  }, [array.length, link.length, array]);

  const inputref = useRef();

  const handleformrequest = async (e) => {
    e.preventDefault();
    setData([]);
    setTime([]);
    setFilteredData([]);
    setResultMessage([]);
    setAverageMessage([]);
    setShowDetail(false);
    const [validated, validationMessage] = validation(start, end, link);
    if (!validated) {
      toastNotification(validationMessage, "error");
      return;
    }
    setFetching(true);
    const [videoIds, message] = await fetchIDs(link);
    if (videoIds.length === 0) {
      setFetching(false);
      toastNotification(message, "error");
      return;
    }
    const [res, curmessage] = await fetchDetailsFromIds(videoIds);
    if (res.length === 0) {
      setFetching(false);
      toastNotification(curmessage, "error");
      return;
    }

    if (start > res.length || (end !== DEFAULTEND && end > res.length)) {
      setData([]);
      setStart(DEFAULTSTART);
      setEnd(DEFAULTEND);
      setFetching(false);
      toastNotification("Start or End out of range", "info");
      return;
    }
    const [curcategory, categoryMessage] = await fetchCategoryDetailFromVideoDetail(res);
    if (!curcategory.length) {
      setData([]);
      setStart(DEFAULTSTART);
      setEnd(DEFAULTEND);
      setFetching(false);
      toastNotification(categoryMessage, "error");
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
    toastNotification("Fetched Successfully", "success");
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
      <form onSubmit={handleformrequest} name="Submit-Form">
        <label htmlFor="link">Enter the link of the YouTube playlist:<i className="fa fa-asterisk text-danger"></i>
        </label>

        <input type="text" id="link" ref={inputref} placeholder={array[placeholderRef.current]} disabled={fetching} autoFocus value={link} onChange={(e) => { handlechangelink(e); }} className='abc' />

        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setLink("")}>Clear</span>

        <label htmlFor="start">Starting Video Index (1-based):</label>
        <input type="number" id="start" placeholder="Start Index(Optional)" value={(start === DEFAULTSTART) ? '' : start} onChange={handleStartChange} min={1} step={1} disabled={fetching} className='abc' />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setStart(DEFAULTSTART)}>Clear</span>

        <label htmlFor="end">Ending Video Index (1-based):</label>
        <input type="number" step="1" id="end" placeholder="End Index(Optional)" value={end === DEFAULTEND ? '' : end} min={1} onChange={handleEndChange} disabled={fetching} className='abc' />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setEnd(DEFAULTEND)}>Clear</span>

        <button id="calculate" type='submit' className={`btn  btn-${fetching ? "secondary" : "success"} py-2 abc`} disabled={fetching}>
          {fetching ? "Fetching..." : "Get Total Duration"}
        </button>

        {fetching && <div className='d-flex justify-content-center'>
          <SyncLoader loading={fetching} size={8}></SyncLoader>
        </div>
        }
        <p>{resultMessage}</p>
        <p>{averageMessage}</p>

        {!fetching &&
          <>
            <div className="Link-header">
              <button className='App-link my-2 border-0' ref={showButtonRef} type={"button"} onClick={() => setShowDetail(!showDetail)}>{showDetail ? "Hide" : "Show"} details</button>
            </div>
            <div className="Details" >
              {showDetail && <>
                <Details />
                <Pagination totalPages={totalPages} curpage={curpage} setCurPage={setCurPage} ></Pagination>
              </>}
            </div>
          </>
        }
      </form >
    </div >
  );
}

export default App;