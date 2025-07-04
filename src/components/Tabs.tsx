import React,{useState} from 'react';
const Tabs:React.FC=()=>{
    const [activeTab,setActiveTab]=useState('All');

    const tabs=['All','In progress','Completed'];
    return (
        <div className='flex space-x-4 px-4 py-2 border-b bg-gray-50'>
            {tabs.map((tab)=>(
                <button key={tab}  className={`px-4 py-1 rounded ${
            activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-700'
          }`} onClick={()=>{
            console.log(`${tab} tab clicked`);
            setActiveTab(tab);
          }}>{tab}</button>
            ))}
        </div>
    )
}
export default Tabs;