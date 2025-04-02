import { createContext, useEffect, useState } from "react"

const TableContext = createContext();

export const TableContextProvider = ({ children }) => {
    const isMobile = window.innerWidth <= 768;
    const [column, setColumn] = useState(isMobile?["Index","Thumbnail","Duration"]:["Index", "Title", "Thumbnail", "Duration", "Published Date", "Action"]);
    const [totalColumns, setTotalColumns] = useState(["Index", "Title", "Thumbnail", "Duration", "Published Date", "Action", "Views", "Likes", "Comment Count"])
    const [addColumn, setAddColumn] = useState("");
    const [leftColumn, setLeftColumn] = useState(totalColumns.filter(col => !column.includes(col)));
    useEffect(() => {
        setLeftColumn([...totalColumns].filter(col => !column.includes(col)));
        setAddColumn([...totalColumns].filter(col => !column.includes(col))?.[0] || "");
    }, [column, totalColumns]);
    
    return <TableContext.Provider value={{ column, setColumn, totalColumns, setTotalColumns, addColumn, setAddColumn, leftColumn, setLeftColumn }}>{children}</TableContext.Provider>
}
export default TableContext;