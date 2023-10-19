import React, {useState, useEffect, useContext } from 'react'
import Small from '../Headings/Small'
import NotFound from '../../Routes/NotFound';
import FolderIcon from '../Icons/FolderIcon';
import FileIcon from '../Icons/FileIcon';
import { AppContext } from '../../context/AppContext';
import File from '../Core/File';

const ProjectStructure = ({path, projectPath}) => {

    const [content, setContent] = useState({});
    const [isFile, setIsFile] = useState(true);
    const {navigate} = useContext(AppContext);

    useEffect(() => {
        const fetchDirectoryContents = async() => {
            console.log(path);
            const res = await fetch(`http://localhost:7888/api/project/${path}`);
            const data = await res.json();

            console.log(data);

            if(!data.status){
                return <NotFound/>;
            }
            setIsFile(data.isFile);
            setContent(data);
            
        }

        fetchDirectoryContents();

    }, [path]);

  return (
    <section className='w-[80%] m-0 sm-max:w-full border-muted border-[1px] rounded-lg'>
        <div className='text-white font-medium bg-muted rounded-t-lg p-2 m-0'>{projectPath}</div>
        
        <p className='p-1 px-5 mb-3 text-2xl hover:underline border-muted border-b-[1px]' 
           onClick={(e) => {navigate(`${path.split('/').slice(0,-1).join('/')}`)}}>..</p>
        
        {isFile ? <File content={content.data}/> :
        // {isFile ? <></> :
        <ul className=''>
            {content.folders.map((folder,ind) => <li className='p-3 hover:underline border-muted border-b-[1px]'
                                                     key={ind}
                                                     onClick={(e) => {navigate(`${path}/${e.target.innerText}`)}}>
                                                    <FolderIcon/>{folder}
                                                </li>)}
            {content.files.map((file, ind) => <li className='p-3 hover:underline border-muted border-b-[1px]'
                                                    key={ind}
                                                    onClick={(e) => {navigate(`${path}/${e.target.innerText}`)}}>
                                                    <FileIcon/>{file}
                                              </li>)}
        </ul>}
    </section>
  )
}

export default ProjectStructure