import React, {useState, useContext, useEffect, useMemo } from 'react'
import { AppContext } from '../context/AppContext';
import Small from '../components/Headings/Small';
import ProjectStructure from '../components/Utility/ProjectStructure';
import CommandLineIcon from '../components/Icons/CommandLineIcon';
import BranchIcon from '../components/Icons/BranchIcon';
import CommandLine from '../components/Utility/CommandLine';
import BranchList from '../components/Utility/BranchList';


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
                                const cookie = document.cookie.match(/orgname=[a-zA-Z]+(-[a-zA-Z0-9]+)*$/i);
                                if(!cookie) return cookie;

                                // if(cookie.length) navigate('/auth');
                                return hrefSplit[3];
                            }, []);

    const [projectName, branchName] = useMemo(() => [hrefSplit[PROJECT_INDEX],
                                                     hrefSplit[BRANCH_INDEX]], [navigate]);

    

    const [path, setPath] = useState(hrefSplit.slice(ORGNAME_INDEX,).join('/'));
    const [commandPalette, setCommandPalette] = useState(false);
    const [currentBranch, setCurrentBranch] = useState(branchName);
    const [showBranch, setShowBranch] = useState(false);

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


    return (
      <section>
          <Small className='my-5 hover:underline' onClick={(e) => {navigate('/')}}>{orgname}</Small>
          <Small className='text-4xl'>{projectName}</Small>
          <div className='flex flex-row items-center gap-[3vw] my-6'>
            <div className={`${showBranch ? 'flex flex-col' : ''} `}
                 onClick={(e) => {setShowBranch(!showBranch)}}>
             <div className='gap-3 px-3 py-1 bg-muted-light rounded-lg hover:cursor-pointer'>
              <BranchIcon/>
                {branchName}
             </div>
              {showBranch && <BranchList switchBranch={switchBranch} orgname={orgname} projectName={projectName}/>}
            </div>
            
            <div onClick={(e) => {setCommandPalette(!commandPalette)}}>
              <CommandLineIcon/>
            </div>
          </div>

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