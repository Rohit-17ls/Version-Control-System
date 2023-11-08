import React, {useState, useEffect, useContext } from 'react'
import NotFound from '../../Routes/NotFound';
import FolderIcon from '../Icons/FolderIcon';
import FileIcon from '../Icons/FileIcon';
import { AppContext } from '../../context/AppContext';
import File from '../Core/File';

const ProjectStructure = ({path, branch, projectPath, orgname, projectName}) => {

    const [content, setContent] = useState({folders: [], files: []});
    const [isFile, setIsFile] = useState(false);
    const {navigate} = useContext(AppContext);

    useEffect(() => {
        const fetchDirectoryContents = async() => {
            console.log(`http://localhost:7888/api/project/${orgname}/${projectName}/${branch}/${projectPath}`)
            const res = await fetch(`http://localhost:7888/api/project/${orgname}/${projectName}/${branch}/${projectPath}`);
            const data = await res.json();

            console.log(data);

            if(!data.status){
                return <NotFound/>;
            }
            setIsFile(data.isFile);
            setContent(data);
            
        }

        fetchDirectoryContents();

    }, [path, branch]);

    const getTimeSinceModification = (lastUpdated) => {}

  return (
    <section className='w-[80%] mb-5 sm-max:w-full border-muted border-[1px] rounded-lg'>
        <div className='text-white font-medium bg-muted-light rounded-t-lg p-2 m-0'>{projectPath}</div>
        
        <p className='p-1 px-3 mb-3 text-2xl hover:underline border-muted border-b-[1px]' 
           onClick={(e) => {navigate(`${path.split('/').slice(0,-1).join('/')}`)}}><FolderIcon/>..</p>
        
        {isFile ? <File content={content.data} name={path.split('/').slice(-1)[0]}/> :
        // {isFile ? <></> :
        <ul className=''>
            {content.folders.map((folder,ind) => <li className='p-3 border-muted border-b-[1px] hover:bg-hover flex items-center'
                                                     key={ind}>
                                                    <FolderIcon/>
                                                    <span className='inline-flex flex-row flex-grow justify-between hover:underline'>
                                                        <span className='flex-grow'
                                                               onClick={(e) => {navigate(`${path}/${e.target.innerText}`)}}>
                                                            {folder.name}</span>
                                                        <span className='text-muted'>
                                                            {`${new Date(folder.lastUpdated).toLocaleDateString()} ${new Date(folder.lastUpdated).toLocaleTimeString()}` }
                                                        </span>
                                                    </span>
                                                </li>)}
            {content.files.map((file, ind) => <li className='p-3 border-muted border-b-[1px] hover:bg-hover flex items-center'
                                                    key={ind}>
                                                    <FileIcon/>
                                                    <span className='inline-flex flex-row  flex-grow justify-between hover:underline'>
                                                        <span className='flex-grow'
                                                               onClick={(e) => {navigate(`${path}/${e.target.innerText}`)}}>
                                                            {file.name}
                                                        </span>
                                                        <span className='text-muted'>
                                                            {`${new Date(file.lastUpdated).toLocaleDateString()} ${new Date(file.lastUpdated).toLocaleTimeString()}` }
                                                        </span>
                                                    </span>
                                              </li>)}
        </ul>}
    </section>
  )
}

export default ProjectStructure