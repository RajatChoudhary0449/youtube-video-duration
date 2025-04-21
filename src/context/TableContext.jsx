import { createContext, useEffect, useState } from "react"
import { ALLCOLS, DEFAULTCOLS } from "../constant/values";

const TableContext = createContext();

export const TableContextProvider = ({ children }) => {
    const [column, setColumn] = useState(DEFAULTCOLS);
    const [totalColumns, setTotalColumns] = useState(ALLCOLS)
    const [addColumn, setAddColumn] = useState("");
    const [leftColumn, setLeftColumn] = useState(totalColumns.filter(col => !column.includes(col)));
    useEffect(() => {
        setLeftColumn([...totalColumns].filter(col => !column.includes(col)));
        setAddColumn([...totalColumns].filter(col => !column.includes(col))?.[0] || "");
    }, [column, totalColumns]);
    
    return <TableContext.Provider value={{ column, setColumn, totalColumns, setTotalColumns, addColumn, setAddColumn, leftColumn, setLeftColumn }}>{children}</TableContext.Provider>
}
export default TableContext;