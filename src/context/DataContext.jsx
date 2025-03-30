import { createContext, useState } from "react";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [time, setTime] = useState([]);

    const [curpage, setCurPage] = useState(1);
    const [totalPages, setTotalPage] = useState(0);

    const [totalTime, settotalTime] = useState([0, 0, 0, 0]);
    const [offset, setOffset] = useState(10);

    const [category, setCategory] = useState("");
    return (
        <DataContext.Provider value={{ data, setData, time, setTime, curpage, setCurPage, totalTime, settotalTime, totalPages, setTotalPage, offset, setOffset, category, setCategory }}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
