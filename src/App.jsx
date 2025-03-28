import './App.css';
import React, { useEffect, useRef, useState } from 'react'
import ShowDetails from './Components/ShowDetails'
import { FetchData } from './services/FetchData'
import divideTheTime from './utils/divideTheTime';
import gettimefromdata from './utils/gettimefromdata';
import formatDuration from './utils/formatDuration';
import useDataContext from './hooks/useDataContext';
function App() {
  const { data, setdata, time, settime, curpage, setCurPage, settotalTime, offset } = useDataContext();
  const [link, setLink] = useState("")
  const [start, setstart] = useState(-1)
  const [end, setend] = useState(Infinity)
  const [fetching, setFetching] = useState(false);
  const [resultmessage, setresultmessage] = useState("");
  const [averagemessage, setaveragemessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [totalPages, setTotalPage] = useState(0);

  const inputref = useRef();
  useEffect(() => {
    setTotalPage(Math.ceil((time.length) / offset));
    setFilteredData(time.slice(0, offset));
  }, [time, offset]);

  useEffect(() => {
    setFilteredData(time.slice((curpage - 1) * offset, curpage * offset + 1));
  }, [curpage, offset]);

  useEffect(() => {
    settime(gettimefromdata(data, start, end));
  }, [data]);

  function validation(start, end) {
    if (end < start) {
      return [false, "End cannot be set less than start"];
    }
    return [true, "Good to go"];
  }
  const handleformrequest = async (e) => {
    e.preventDefault();
    const [validated, message] = validation(start, end);
    if (!validated) {
      alert(message);
      return;
    }
    if (!link.length) {
      alert("Link cannot be left empty");
      return;
    }
    setFetching(true);
    const [res, result, average] = await FetchData(link);
    if (res.length === 0) {
      setFetching(false);
      inputref.current.focus()
      alert("Please check the link");
      return;
    }
    if (start > res.length || (end !== Infinity && end > res.length)) {
      setstart(-1);
      setend(Infinity);
      setFetching(false);
      alert("Start or End out of range");
      return;
    }
    if (result) {
      setresultmessage(result);
      setFetching(false);
      return;
    }
    if (average) {
      setaveragemessage(average);
      setFetching(false);
      return;
    }
    setdata(res);
    const rawtimes = gettimefromdata(res, start, end);
    if (res.length === 0) {
      setFetching(false);
      return;
    }
    const curtotaltime = rawtimes[rawtimes.length - 1]['totaltime'];
    settotalTime(curtotaltime);
    setresultmessage(`Total Duration: ${formatDuration(curtotaltime)}`);
    setaveragemessage(`Average Duration: ${formatDuration(divideTheTime(curtotaltime, rawtimes.length))}`);
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
        <input type="text" id="link" ref={inputref} placeholder="Playlist URL" autoFocus value={link} onChange={(e) => { handlechangelink(e); }} onFocus={() => { setstart(-1); setend(Infinity); }} ></input>

        <label htmlFor="start">Starting Video Index (1-based):</label>
        <input type="number" id="start" placeholder="Start Index(Optional)" value={(start === -1) ? '' : start} onChange={(e) => setstart(Number(e.target.value))} min={1} step={1} contentEditable={!fetching} />
        <span className='d-flex text-primary justify-content-end' onClick={() => setstart(-1)}>Set Default</span>

        <label htmlFor="end">Ending Video Index (1-based):</label>
        <input type="number" step="1" id="end" placeholder="End Index(Optional)" value={end === Infinity ? '' : end} min={1} onChange={(e) => setend(Number(e.target.value))} contentEditable={!fetching} />
        <span className='d-flex text-primary justify-content-end' onClick={() => setend(Infinity)}>Set Default</span>

        <button id="calculate" type='submit' className={`btn btn-${fetching ? "secondary" : "success"} p-2 mt-2`} disabled={fetching}>{fetching ? "Fetching..." : "Get Total Duration"}</button>
        <p id="result">{resultmessage}</p>
        <p>{averagemessage}</p>
        {!fetching && <ShowDetails data={filteredData} totalPages={totalPages} ></ShowDetails>}
      </form >
    </div >
  );
}

export default App;