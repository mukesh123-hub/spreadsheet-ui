import React, { useState, useRef, useEffect } from 'react';
import { columns as initCols, data } from '../data/rows.ts';
import Toolbar from './Toolbar';
import Tabs from './Tabs';


function getStatusStyle(status: string) {
    switch (status) {
        case 'In-process':
            return 'bg-yellow-100 text-yellow-800';
        case 'Completed':
            return 'bg-green-100 text-green-800';
        case 'Blocked':
            return 'bg-red-100 text-red-800';
        case 'Need to start':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';

    }
}
const getPriorityStyle=(priority:string)=>{
    switch(priority){
        case 'High':
            return 'text-red-600';
        case'Medium':
            return 'text-yellow-600';
        case 'Low':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
                      
    }
};

type col={ key: string; label: string; width: number; visible: boolean };
const defaultCols:col[] = initCols.map((label, i) => ({
    key: `col${i}`,
    label,
    width: 150,
    visible: true,
}));
const Spreadsheet:React.FC = () => {
    const [cols, setCols] = useState<col[]>(defaultCols);
    const [focused,setFocused]=useState<{r:number; c:number}|null>(null);
    const cellRefs = useRef<(HTMLDivElement | null)[][]>([]);
    useEffect(()=>{
        cellRefs.current = data.map(() => cols.map(() => null));
    },[cols]);

    const handleKey=(e:React.KeyboardEvent)=>{
        if(!focused) return;
        let {r, c}=focused;
        switch(e.key){
           case 'ArrowRight': c=Math.min(c+1,cols.length-1); break;
              case 'ArrowLeft': c=Math.max(c-1,0); break;
                case 'ArrowUp': r=Math.max(r-1,0); break;
                case 'ArrowDown': r=Math.min(r+1,data.length-1); break;
                default: return; // Ignore other keys
        }
        setFocused({r,c});
        cellRefs.current[r]?.[c]?.focus();
        e.preventDefault();

    };
    return (
        <div className=' rounded shadow border bg-white'>
              <Toolbar cols={cols} setCols={setCols} />
              <Tabs />
              <div className='overflow-auto'>
                 <table className='table-fixed'>
                   <thead className='bg-gray-50 sticky top-0'>
                    <tr>
                        {cols.map((col,ci) =>
                           col.visible ? (
                            <th
                                key={col.key}
                                style={{ width: col.width }}
                                className='px-4 py-2  border-b'
                            >
                              {col.label}
                              <span 
                                className='ml-1 cursor-col-resize select-none'
                                onMouseDown={(e)=>{
                                    const startX=e.clientX;
                                    const startW=col.width;
                                    const onMouseMove=(e2:MouseEvent)=>{
                                        const nx=startW+(e2.clientX-startX);
                                        const newCols=[...cols];
                                        newCols[ci].width=Math.max(nx,60);
                                        setCols(newCols);

                                    };
                                    const onMouseUp=()=>{
                                        document.removeEventListener('mousemove', onMouseMove);
                                        document.removeEventListener('mouseup', onMouseUp);
                                    };
                                    document.addEventListener('mousemove', onMouseMove);
                                    document.addEventListener('mouseup', onMouseUp);
                                }}
                              >:

                              </span>
                            </th>
                           ) : null
                        )}
                    </tr>
                   </thead>
                   <tbody onKeyDown={handleKey}>
                     {data.map((row, ri) => (
                        <tr key={ri}>
                            {cols.map((col, ci) =>
                               col.visible ? (
                                <td
                                  key={col.key}
                                  ref={(el) => {
                                    if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
                                    cellRefs.current[ri][ci] = el!;
                                  }}
                                  tabIndex={0}
                                  className='px-2 py-1 border-r border-b focus:outline-none'
                                  onFocus={() => setFocused({ r: ri, c: ci })}
                                >
                                    {(() => {
                                        switch (col.label) {
                                            case 'Job Request':
                                                return row.job;
                                            case 'Submitted':
                                                return row.submitted;
                                            case 'Status':
                                                return (
                                                    <span className={`px-2 py-1 rounded ${getStatusStyle(row.status)}`}>
                                                        {row.status}
                                                    </span>
                                                );
                                            case 'Submitter':
                                                return row.submitter;
                                            case 'URL':
                                                return <a href="#" className="text-blue-600">{row.url}</a>;
                                            case 'Assigned':
                                                return row.assigned;
                                            case 'Priority':
                                                return <span className={getPriorityStyle(row.priority)}>{row.priority}</span>;
                                            case 'Due Date':
                                                return row.dueDate;
                                            case 'Value':
                                                return row.value;
                                            default:
                                                return '';
                                        }
                                    })()}
                                </td>
                               ) : null
                            )}
                        </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
              
        </div>     
    );
}

export default Spreadsheet;