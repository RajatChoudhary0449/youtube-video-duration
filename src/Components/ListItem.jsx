import React from 'react'
import formatDuration from '../utils/formatDuration';

export default function ListItem({ item }) {
    const { idx, curtime, totaltime } = item;
    return (
        <tr>
            <td>{idx}</td>
            <td>{formatDuration(curtime)}</td>
            <td>{formatDuration(totaltime)}</td>
        </tr>
    )
}
