import { createContext, useState } from "react";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
    const [data, setdata] = useState([]);
    const [time, settime] = useState([]);

    const [curpage, setCurPage] = useState(1);
    const [totalPages, setTotalPage] = useState(0);

    const [totalTime, settotalTime] = useState([0, 0, 0, 0]);
    const [offset, setOffset] = useState(10);
    return (
        <DataContext.Provider value={{ data, setdata, time, settime, curpage, setCurPage, totalTime, settotalTime, totalPages, setTotalPage, offset, setOffset }}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
