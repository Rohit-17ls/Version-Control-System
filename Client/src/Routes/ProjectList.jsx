import React, {useState, useContext, useEffect, useMemo } from 'react'
import { AppContext } from '../context/AppContext'
import Small from '../components/Headings/Small';
import Medium from '../components/Headings/Medium';
import DeveloperList from '../components/Utility/DeveloperList';

const ProjectList = () => {

    const {navigate} = useContext(AppContext);

    const hrefSplit = useMemo(() => {
        return location.href.split('/');
    }, [navigate]);

    const [orgname, setOrgname] = useState(hrefSplit[3]);
    const [projects, setProjects] = useState([]);


  useEffect(() => {
    const fetchProjects = async() => {
      if(!/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(orgname)) return;

      const res = await fetch(`http://localhost:7888/api/projects/${orgname}`);
      const data = await res.json();

      if(data.status){
        setProjects(data.result);
      }

    }

    fetchProjects();
  }, []);

  


  return (
    <div>
      <Medium>
        <Small>Projects by {orgname}</Small>
      </Medium>

      {projects.length ?
                         <ul className='flex flex-col w-[80%] sm-max:w-full p-5 my-5 bg-hover border-[1px] border-muted rounded-lg'>
                         {projects.map((project, ind) => <li className='border-b-[1px] border-muted' key={ind}>
                                                         <Medium>
                                                          <Small onClick={(e) => {navigate(`/${orgname}/${e.target.innerText}/main`)}}
                                                                 className='hover:underline'>
                                                            {project.project_name}
                                                          </Small>
                                                         </Medium>
                                                         <Small className='px-2 my-4 font-semibold'>TechLead : {project.techlead_name}</Small>
                                                         <Small className='px-2 block my-3'>Developers : </Small>
                                                         <DeveloperList projectName={project.project_name}/>

                                                         </li>)}
                         </ul>               

                       : <Small className='my-8 mx-5'>No projects from '{orgname}'</Small>}

    </div>
  )
}

export default ProjectList