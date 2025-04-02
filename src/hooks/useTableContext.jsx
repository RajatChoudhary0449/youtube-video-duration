import { useContext } from 'react'
import TableContext from '../context/TableContext'

const useTableContext = () => useContext(TableContext);
export default useTableContext;
