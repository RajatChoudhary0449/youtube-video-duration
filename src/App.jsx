import './App.css';
import React, { useEffect, useRef, useState } from 'react'
import ShowDetails from './Components/ShowDetails'
import divideTheTime from './utils/divideTheTime';
import formatDuration from './utils/formatDuration';
import useDataContext from './hooks/useDataContext';
import validation from './validation/validation';
import getTimeAndDetailsFromData from './services/getTimeAndDetailsFromData';
import fetchIDs from './services/fetchIDs';
import fetchDetailsFromIds from './services/fetchDetailsFromIds';
function App() {
  const { setData, time, setTime, curpage, setCurPage, setTotalPage, settotalTime, offset } = useDataContext();
  const [link, setLink] = useState("")
  const [start, setStart] = useState(-1)
  const [end, setEnd] = useState(Infinity)
  const [fetching, setFetching] = useState(false);
  const [resultMessage, setresultMessage] = useState("");
  const [averageMessage, setaverageMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const inputref = useRef();
  useEffect(() => {
    setTotalPage(Math.ceil((time.length) / offset));
  }, [time, offset, setTotalPage]);

  useEffect(() => {
    setFilteredData(time.slice((curpage - 1) * offset, curpage * offset));
  }, [time, curpage, offset]);

  const handleformrequest = async (e) => {
    e.preventDefault();
    const [validated, validationMessage] = validation(start, end,link);
    if (!validated) {
      alert(validationMessage);
      return;
    }
    setFetching(true);
    const [videoIds,message]=await fetchIDs(link);
    if(videoIds.length===0)
    {
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

    if (start > res.length || (end !== Infinity && end > res.length)) {
      setStart(-1);
      setEnd(Infinity);
      setFetching(false);
      alert("Start or End out of range");
      return;
    }

    const rawtimes = await getTimeAndDetailsFromData(res, start, end);
    const curtotaltime = rawtimes?.[rawtimes.length - 1]?.['totaltime'];
    setData(res);
    setTime(rawtimes);
    settotalTime(curtotaltime);
    setresultMessage(`Total Duration: ${formatDuration(curtotaltime)}`);
    setaverageMessage(`Average Duration: ${formatDuration(divideTheTime(curtotaltime, rawtimes.length))}`);
    setFetching(false);
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

        <label htmlFor="link">Enter the link of the YouTube playlist:</label>
        <input type="text" id="link" ref={inputref} placeholder="Playlist URL" disabled={fetching} autoFocus value={link} onChange={(e) => { handlechangelink(e); }} onFocus={() => { setStart(-1); setEnd(Infinity); }} ></input>

        <label htmlFor="start">Starting Video Index (1-based):</label>
        <input type="number" id="start" placeholder="Start Index(Optional)" value={(start === -1) ? '' : start} onChange={(e) => setStart(Number(e.target.value))} min={1} step={1} disabled={fetching} />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setStart(-1)}>Clear</span>

        <label htmlFor="end">Ending Video Index (1-based):</label>
        <input type="number" step="1" id="end" placeholder="End Index(Optional)" value={end === Infinity ? '' : end} min={1} onChange={(e) => setEnd(Number(e.target.value))} disabled={fetching} />
        <span className='d-flex text-primary justify-content-end' style={{ cursor: "pointer" }} onClick={() => setEnd(Infinity)}>Clear</span>

        <button id="calculate" type='submit' className={`btn btn-${fetching ? "secondary" : "success"} p-2 mt-2`} disabled={fetching}>{fetching ? "Fetching..." : "Get Total Duration"}</button>
        <p id="result">{resultMessage}</p>
        <p>{averageMessage}</p>
        {!fetching && <ShowDetails data={filteredData} ></ShowDetails>}
      </form >
    </div >
  );
}

export default App;