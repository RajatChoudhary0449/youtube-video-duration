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
import TableComponent from './Components/Pages/TableComponent';
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
    const cur= e.target.value.replace(/[^0-9]/g, "");
    if (cur === "") setStart(DEFAULTSTART);
    else setStart(Math.max(Math.floor(Number(cur)), 1))
  }

  const handleEndChange = (e) => {
    const cur= e.target.value.replace(/[^0-9]/g, "");
    if (cur === "") setEnd(DEFAULTEND);
    else setEnd(Math.max(Math.floor(Number(cur)), 1))
  }
  const handlechangelink = (e) => {
    const cur = e.target.value;
    setLink(cur);
    setCurPage(1);
  }
  return (
    <>
      <div className="container" style={{ maxWidth: "850px", boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset" }}>
        <h1>YouTube Playlist Duration Calculator</h1>
        <form onSubmit={handleformrequest} name="Submit-Form" >
          
          <div className='mb-4'>
            <label htmlFor="link">Link of the YouTube playlist:<i className="fa fa-asterisk text-danger"></i>
            </label>
            <div class="input-group ">
              <input type="text" id="link" className="form-control w-75 p-2" ref={inputref} placeholder={array[placeholderRef.current]} disabled={fetching} autoFocus value={link}
                onChange={(e) => handlechangelink(e)}
              />
              <span class="input-group-text" onClick={() => setLink("")}><i className='fas fa-eraser'></i></span>
            </div>
          </div>

          <div className='mb-4'>
            <label htmlFor="start">Starting Video Index (1-based):</label>
            <div class="input-group ">
              <input type="number" id="start" placeholder="Start Index(Optional)" value={(start === DEFAULTSTART) ? '' : start} onChange={handleStartChange} min={1} step={1} disabled={fetching} className="form-control w-75 p-2" />
              <span class="input-group-text" onClick={() => setStart(DEFAULTSTART)}><i className='fas fa-eraser'></i></span>
            </div>
          </div>

          <div className='mb-4'>
            <label htmlFor="end">Ending Video Index (1-based):</label>
            <div class="input-group ">
              <input type="number" id="end" placeholder="End Index(Optional)" value={(end === DEFAULTEND) ? '' : end} onChange={handleEndChange} min={1} step={1} disabled={fetching} className="form-control w-75 p-2" />
              <span class="input-group-text" onClick={() => setEnd(DEFAULTEND)}><i className='fas fa-eraser'></i></span>
            </div>
          </div>
          <button id="calculate" type='submit' className={`btn  btn-${fetching ? "secondary" : "success"} py-2 w-100`} disabled={fetching}>
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
                </>}
              </div>
            </>
          }
        </form >
      </div >
      {showDetail &&
        <div className='container mt-4'>
          <TableComponent />
          <div className="d-flex justify-content-center my-2 d-sm-none d-md-none">
            <span className="fw-bold">Scroll to get more details</span>
          </div>
          <Pagination totalPages={totalPages} curpage={curpage} setCurPage={setCurPage} />
        </div>
      }
    </>
  );
}

export default App;