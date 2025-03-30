import ListItem from '../ListItem'
export default function TableComponent({ items }) {
    return (
        <div className='table-responsive'>
            <table className=''>
                <thead>
                    <tr>
                        <th className='index-column'>Index</th>
                        <th>Title</th>
                        <th>Thumbnail</th>
                        <th>Duration</th>
                        <th>Published Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        return (<ListItem key={item['idx']} item={item} />)
                    })
                    }
                </tbody>
            </table >
        </div>
    )
}
