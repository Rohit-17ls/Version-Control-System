import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Small from '../components/Headings/Small';
import Medium from '../components/Headings/Medium';
import { AppContext } from '../context/AppContext';

const ORGNAME_INDEX = 3;
const PROJECT_INDEX = 4;
const COMMIT_HASH_INDEX = 6;

const CommmitAnalysis = () => {

    const {navigate} = useContext(AppContext);
    const [error, setError] = useState('');
    // const [diff, setDiff] = useState('');
    const [analysis, setAnalysis] = useState('');
    const {hrefSplit, orgname, projectName, commitHash} = useMemo(() => {
        const hrefSplit = location.href.split('/');

        return {hrefSplit, orgname : hrefSplit[ORGNAME_INDEX], projectName : hrefSplit[PROJECT_INDEX], commitHash : hrefSplit[COMMIT_HASH_INDEX]};
    });

    const insightsRef = useRef();

    const getAIAnalysis = useCallback(async (diff) => {
        try{
            const res = await fetch('http://localhost:7888/api/commit/analyze', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({diff})
    
            });
    
            const data = await res.json();
            // analysisRef.current.innerHTML = data.result;
            setAnalysis(data.result);
    
            console.log(data);
            
            if(!data.status){
                setError(data.message);
                return;
            }

        }catch(err){
            setError("AI is unavailable, possibly due to high demand. Try again later...");r
            return;
        }



        // const data = await res.text();
        // console.log(data);
        // setAnalysis(data);

    }, []);

    useEffect(() => {
        const fetchCommitDiff = async() => {

            try{
                const res = await fetch(`http://localhost:7888/api/commit/${orgname}/${projectName}/${commitHash}`);
                const data = await res.json();
                if(!data.status){
                    setError(data.message);
                    return;
                }

                insightsRef.current.innerHTML = data.result;

            }catch(err){
                setError("Couldn't fetch diff");r
                return;
            }


            console.log(insightsRef.current.innerText.replaceAll('\n', ' '));
            getAIAnalysis(insightsRef.current.innerText);

        }


        fetchCommitDiff();

    }, []);

  return (
    <div>
        <Medium className='my-5'>AI insights on commit <span className='text-yellow-300'>{commitHash} </span>
         from <strong className='hover:underline' onClick={(e) => {navigate(`${orgname}/${projectName}/main`)}}>
            {orgname}/{projectName}
        </strong>
        </Medium>
        

        <section>
            <pre ref={insightsRef}>

            </pre>

            <Small className='block my-7'>Insights from AI</Small>
            <Small className='text-error'>{error}</Small>

            <pre className='min-w-[500px] max-w-[800px]  bg-hover p-3 my-8 whitespace-pre-wrap'>
                {analysis ||
                    <div className='my-8 text-center'>
                        <Small className='block my-3'>AI is analysing, please be patient</Small>
                        <span id='loader'></span>
                    </div>}
            </pre>
        </section>
    </div>
  )
}

export default CommmitAnalysis
