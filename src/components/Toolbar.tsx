import React from 'react';
type col={key:string; label:string; width:number; visible:boolean};
interface ToolbarProps{
    cols:col[];
    setCols:React.Dispatch<React.SetStateAction<col[]>>;

}
const Toolbar:React.FC<ToolbarProps>=({cols,setCols})=>{
    return(
        <div className='flex items-center gap-2 p-2 border-b'>
            <label className='font-semibold'>Columns:</label>
            {cols.map((col, ci) => (
                <label key={col.key} className='text-sm flex items-center'>
                    <input
                        type='checkbox'
                        checked={col.visible}
                        onChange={() => {
                            const newCols = [...cols];
                            newCols[ci].visible = !newCols[ci].visible;
                            setCols(newCols);
                        }}
                    />
                    <span className='ml-1'>{col.label}</span>
                </label>
            ))}
        </div>
    )
}

export default Toolbar;