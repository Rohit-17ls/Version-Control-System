import React, {useContext, useRef, useState} from 'react'
import Medium from '../components/Headings/Medium'
import Small from '../components/Headings/Small'
import Input from '../components/Core/Input'
import DeveloperList from '../components/Utility/DeveloperList'
import { AppContext } from '../context/AppContext'

const SearchProjects = () => {

    const {navigate} = useContext(AppContext);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const timeoutRef = useRef(null);


    const changeHandler = (e) => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        setProjectName(e.target.value);
        
        timeoutRef.current = setTimeout(async() => {
            if(!projectName.length) return;
            const res = await fetch(`http://localhost:7888/api/search/project?name=${projectName}`);
            const data = await res.json();
            console.log(data);
            setProjects(data.result);

        }, 1000);
        
    }

  return (
    <div className='w-4/5 sm-max:w-[95%] flex flex-col'>
        <Medium><Small>Search for Projects</Small></Medium>

        <Input name="search-projects"
               className='border-2'
               value={projectName} 
               autoComplete="off"
               placeholder={"Type your search here..."}
               changeHandler={(e) => {changeHandler(e)}}
               />


        {projects.length ?
                                 <ul className='flex flex-col w-[80%] sm-max:w-full p-5 my-5 bg-hover border-[1px] border-muted rounded-lg'>
                         {projects.map((project, ind) => <li className='border-b-[1px] border-muted' key={ind}>
                                                         <Medium>
                                                          <Small onClick={(e) => {navigate(`/${project.org_name}/${e.target.innerText}/main`)}}
                                                                 className='hover:underline'>
                                                            {project.project_name}
                                                          </Small>
                                                         </Medium>
                                                         <Small className='px-2 my-4 font-semibold'>TechLead : {project.techlead_name}</Small>
                                                         <Small className='px-2 block my-3'>Developers : </Small>
                                                         <DeveloperList projectName={project.project_name}/>

                                                         </li>)}
                         </ul>               

                       : <Small className='my-8 mx-5'>0 results found</Small>}     
    </div>
  )
}

export default SearchProjects