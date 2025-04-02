import { createContext, useEffect, useState } from "react";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
    const isMobile = window.innerWidth <= 768;
    const [data, setData] = useState([]);
    const [time, setTime] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [curpage, setCurPage] = useState(1);
    const [totalPages, setTotalPage] = useState(0);

    const [totalTime, settotalTime] = useState([0, 0, 0, 0]);
    const [offset, setOffset] = useState(isMobile ? 5 : 10);

    const [category, setCategory] = useState("");

    useEffect(() => {
        setTotalPage(Math.ceil((time.length) / offset));
    }, [time, offset, setTotalPage]);

    useEffect(() => {
        setFilteredData(time.slice((curpage - 1) * offset, curpage * offset));
    }, [time, curpage, offset]);

    return (
        <DataContext.Provider value={{ data, setData, time, setTime, curpage, setCurPage, totalTime, settotalTime, totalPages, setTotalPage, offset, setOffset, category, setCategory, filteredData, setFilteredData }}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
