import React, {useState, useContext, useEffect, useMemo } from 'react'
import { AppContext } from '../context/AppContext';
import Small from '../components/Headings/Small';
import ProjectStructure from '../components/Utility/ProjectStructure';

const Project = () => {

    const {navigate} = useContext(AppContext);
    const orgname = useMemo(() =>  {
                                const cookie = document.cookie.match(/orgname=[a-zA-Z]+(-[a-zA-Z0-9]+)*$/i);
                                if(!cookie) return cookie;

                                if(cookie.length) navigate('/auth');
                                return cookie[0].split('=')[1];
                            }, [])
    const projectName = useMemo(() => location.href.split('/')[4], [location.href]);

    const [path, setPath] = useState(location.href.split('/').slice(3,).join('/'));

    useEffect(() => {
        setPath(location.href.split('/').slice(3,).join('/'));
        if(orgname === null) navigate('/auth')
        console.log(location.href.split('/'));
    }, [location.href]);


  return (
    <section>
        <Small className='my-5 hover:underline' onClick={(e) => {navigate('/')}}>{orgname}</Small>
        <Small className='text-4xl'>{projectName}</Small>

        {/* <Routes>
            <Route path={"/asdf"} element={<ProjectStructure/>}/>
        </Routes> */}

        <ProjectStructure path={path} projectPath={path.split('/').slice(2,).join('/')}/>

    </section>
  )
}

export default Project