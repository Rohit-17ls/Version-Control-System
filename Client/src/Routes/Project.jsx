import React, {useState, useContext, useEffect, useMemo, useRef, useCallback } from 'react'
import { AppContext } from '../context/AppContext';
import Small from '../components/Headings/Small';
import ProjectStructure from '../components/Utility/ProjectStructure';
import CommandLineIcon from '../components/Icons/CommandLineIcon';
import BranchIcon from '../components/Icons/BranchIcon';
import CommandLine from '../components/Utility/CommandLine';
import BranchList from '../components/Utility/BranchList';
import AddIcon from '../components/Icons/AddIcon';
import Button from '../components/Core/Button';
import DownloadIcon from '../components/Icons/DownloadIcon';
import Center from '../components/Effect/Center';
import CommitInsightsIcon from '../components/Icons/CommitInsightsIcon';


const ORGNAME_INDEX = 3;
const PROJECT_INDEX = 4;
const BRANCH_INDEX = 5;

const Project = () => {

    console.log('Project re-rendered')
    const {navigate} = useContext(AppContext);

    const hrefSplit = useMemo(() => {
                                      return location.href.split('/');
                                    }, [navigate]);

    const orgname = useMemo(() =>  {
                                // const cookie = document.cookie.match(/orgname=[a-zA-Z]+(-[a-zA-Z0-9]+)*$/i);
                                // if(!cookie) return cookie;

                                // // if(cookie.length) navigate('/auth');
                                // return hrefSplit[3];
                                return hrefSplit[ORGNAME_INDEX];
                            }, []);

    const [projectName, branchName] = useMemo(() => [hrefSplit[PROJECT_INDEX],
                                                     hrefSplit[BRANCH_INDEX]], [navigate]);

    

    const [path, setPath] = useState(hrefSplit.slice(ORGNAME_INDEX,).join('/'));
    const [commandPalette, setCommandPalette] = useState(false);
    const [showBranch, setShowBranch] = useState(false);
    const [files, setFiles] = useState([]);
    const [addFilesStatus, setAddFilesStatus] = useState('');

    const uploadFilesRef = useRef();
    const downloadTargetRef = useRef();

    useEffect(() => {
        setPath(hrefSplit.slice(ORGNAME_INDEX,).join('/'));
        if(orgname === null) navigate('/auth')
        console.log('Use Effect due to change in URL : ', path, branchName);


    }, [navigate]);

    const switchBranch = (branch) => {
      if(branch.replace('*', '') === branchName) return;
      console.log(path.split('/').map((param, ind) => ind === 2 ? branch : param).join('/'));
      navigate(path.split('/').map((param, ind) => ind === 2 ? branch : param).join('/'));
      // setCurrentBranch(branch);
    }

    const handleFilesDrop = useCallback(async(e) => {
      e.preventDefault();

      if(e.dataTransfer.items){
        [...e.dataTransfer.items].forEach(async(item, i) => {
          if(item.kind === "file"){
            const file = item.getAsFile();
            const reader = new FileReader();

            reader.onload = async(e) => {
              const fileContent = e.target.result;
              setFiles(prevState => [...prevState, {name : file.name, content : fileContent}]);
            }

            reader.readAsText(file)
          }
        });

      }
    });

    const addFiles = useCallback(async() => {
      if(!files.length) return;

      const res = await fetch('http://localhost:7888/api/addFiles', {
        method : 'POST',
        credentials : 'include',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({orgname : orgname ,
                               path : path.split('/').filter((x, ind) => ind != 2).slice(1,).join('/'),
                               branch : branchName,
                               data : files})
      });
      const data = await res.json();

      setAddFilesStatus(data.message);

      console.log(data);
      
    });

    const downloadProject = useCallback(async(e) => {
      console.log(`http://localhost:7888/api/${orgname}/${projectName}.git`)
      fetch(`http://localhost:7888/api/${orgname}/${projectName}.git`, {
        method : 'GET'
      }).then((response) => {
        if(response.status === 200){
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            downloadTargetRef.current.href = url;
            downloadTargetRef.current.click();
            downloadTargetRef.current.download = `${projectName}.zip`
            window.URL.revokeObjectURL(url);

          })
        }
      })
    })


    return (
      <section>
          <Small className='my-5 hover:underline' onClick={(e) => {navigate(`/${orgname}/projects`)}}>{orgname}</Small>
          <Small className='text-4xl'>{projectName}</Small>
          <div className='flex flex-row items-center gap-[2vw] my-6'>
            <div className={`${showBranch ? 'flex flex-col' : ''} `}
                 onClick={(e) => {setShowBranch(!showBranch)}}>
             <div className='gap-3 px-3 py-1 bg-muted-light rounded-lg hover:cursor-pointer'>
              <BranchIcon/>
                {branchName}
             </div>
              {showBranch && <BranchList switchBranch={switchBranch} orgname={orgname} projectName={projectName}/>}
            </div>
            
            <div onClick={(e) => {setCommandPalette(!commandPalette)}} title="Open Command Line">
              <CommandLineIcon/>
            </div>
            <div className='align-top'
                 title="Add Files"
                 onClick={(e) => {uploadFilesRef.current.showModal()}}>
              <AddIcon/>
            </div>
            <div title="Download as zip" onClick={(e) => {downloadProject(e)}}>
              <DownloadIcon/>
            </div>
            <div title="Commit Insights"
                 className='mt-[-8px] ml-[-10px]'
                 onClick={(e) => {navigate(`/${orgname}/${projectName}/commits`)}}>
              <CommitInsightsIcon/>
            </div>
            <a className='hidden' ref={downloadTargetRef}></a>
          </div>

          {/* Begin Modals */}
          <dialog ref={uploadFilesRef}>
            <div className='bg-none min-w-[400px] w-[60vw] h-[40vh] rounded-lg p-4 flex flex-col gap-3'>
              <p onClick={(e) => {uploadFilesRef.current.close()}} className='ml-[98%] hover:cursor-pointer'>✖</p>

              <p className='text-muted pl-4 my-3'>
                Upload Files to <strong className='text-white'>{path.split('/').filter((x, ind) => ind !== 2 ).join('/')}</strong>,
                branch : <strong className='text-white'>{branchName}</strong>
              </p>

              <div className='border-[4px] border-muted border-dashed w-4/5 h-4/5 m-auto text-center text-muted p-4 overflow-y-scroll'
                   onDragOver = {(e) => {e.preventDefault()}}
                   onDrop={(e) => {handleFilesDrop(e)}}>
                {files.length === 0 ? "Drop your files here" 
                                    : files.map((file, ind) => <div key={ind} className='text-start px-2 m-1 rounded-lg font-semibold'>
                                                                  {file.name} <small className='pl-3'>{file.content.length}B</small>
                                                                </div>)
                }
              </div>
              <Center><span>{addFilesStatus}</span></Center>
              <Button className='w-[33%] bg-success-dark' clickHandler={(e) => {addFiles()}}>Add Files</Button>
            </div>

          </dialog>

          {/* End Modals */}

          {commandPalette && <CommandLine orgname={orgname}
                                          projectName={projectName}
                                          branch={branchName} 
                                          projectPath={path.split('/').filter((x, ind) => ind !== 2).slice(2,).join('/')}/>}


          <ProjectStructure path={path} 
                            orgname={orgname}
                            projectName={projectName}
                            branch={branchName}
                            projectPath={path.split('/').filter((x, ind) => ind !== 2).slice(2,).join('/')}/>

      </section>
    )
}

export default Project