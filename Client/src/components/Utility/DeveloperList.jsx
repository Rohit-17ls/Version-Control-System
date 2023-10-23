import React, { useState, useEffect } from 'react'

const DeveloperList = ({projectName}) => {

    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        const getDevelopers = async (projectName) => {
            if(!/^[a-zA-Z0-9_]+(-[a-zA-Z0-9_]+)*$/.test(projectName)) return;
            
            const res = await fetch(`http://localhost:7888/api/developers/${projectName}`);
            const data = await res.json();
            if(!data.status) return <span className='text-error'>{data.message}</span>
            
            setDevelopers(data.result);
          }

        getDevelopers(projectName);
    }, []);

  return (
            <div className='flex flex-row flex-wrap'>
                {developers.length ? developers.map((developer, ind) => <span className='m-3 p-2 w-fit min-w-[120px] bg-muted-light rounded-lg' key={ind}>{developer}</span>)
                                   : <span className='text-error'>Something went wrong</span>}
            </div>
  )
}

export default DeveloperList