import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import Medium from '../components/Headings/Medium';
import Small from '../components/Headings/Small';
import { AppContext } from '../context/AppContext';

const ORGNAME_INDEX = 3;
const PROJECT_INDEX = 4;

const CommitInsights = () => {

  const {navigate} = useContext(AppContext);
  const [range, setRange] = useState({skip : 0, count : 3});
  const [error, setError] = useState('');
  const insightsRef = useRef();

  const {hrefSplit, orgname, projectName} = useMemo(() => {
        const hrefSplit = location.href.split('/');
        const orgname = hrefSplit[ORGNAME_INDEX]
        const projectName = hrefSplit[PROJECT_INDEX];
        return {hrefSplit, orgname, projectName};
  });


  useEffect(() => {
    const fetchCommitInsights = async() => {
        const res = await fetch(`http://localhost:7888/api/commits/${orgname}/${projectName}/${range.skip}/${range.count}`);
        const data = await res.json();
        console.log(data);

        if(!data.status){
            setError(data.message);
            return;
        }

        insightsRef.current.innerHTML = data.result;
    }

    console.log(range);
    fetchCommitInsights();

  }, [range]);


  return (
    <div className='flex flex-col align-baseline mb-5'>
        <Medium>Commit Insights</Medium>
        <Small className='mx-4 hover:underline' 
               onClick={(e) => {navigate(`/${orgname}/${projectName}/main`)}}>
                {orgname}/{projectName}
        </Small>

        <Small className='text-error'>{error}</Small>

        <div className='flex flex-row flex-wrap gap-3 min-w-[400px] max-w-[600px] border-muted border-[1px] p-3 rounded-lg'>
            <div>
                <label className='font-semibold'>Skip : </label>
                <input className='outline-none rounded-lg p-1'
                       type="number"
                       value={range.skip}
                       onChange={(e) => {
                            setRange(prevState => { return {...prevState, skip : parseInt(e.target.value)}});
                       }}/>
            </div>
            <div>
                <label className='font-semibold'>Count : </label>
                <input className='outline-none rounded-lg p-1'
                       type="number"
                       value={range.count}
                       onChange={(e) => {
                        setRange(prevState => { return {...prevState, count : parseInt(e.target.value)}});
                   }}/>
            </div>
        </div>        

        <section>
            <pre ref={insightsRef} className='whitespace-pre-wrap'>

            </pre>
        </section>

    </div>
  )
}

export default CommitInsights