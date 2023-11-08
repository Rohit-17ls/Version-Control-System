import React, {useState,  useEffect } from 'react'

const BranchList = ({switchBranch, orgname, projectName}) => {

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchBranches = async() => {
            const res = await fetch(`http://localhost:7888/api/branches/${orgname}/${projectName}`);
            const data = await res.json();

            if(data.status){
                setBranches(data.result);
            }
            console.log(data);
        }

        fetchBranches();

    }, []);


  return (
    <ul className='bg-hover max-h-[10vh] overflow-y-scroll rounded-lg rounded-t-sm'>
        {branches.map((branch, ind) => <li onClick={(e) => {switchBranch(branch.replace('*', '').trim())}}
                                           key={ind} 
                                           className='w-full px-3 py-1 hover:opacity-90 hover:cursor-pointer'>
                                            {branch}
                                        </li>)}

    </ul>
  )
}

export default BranchList