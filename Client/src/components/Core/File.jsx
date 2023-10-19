import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

const File = ({content, name}) => {

    const codeRef = useRef();

    useEffect(() => {
        
        // if(content){
        //     console.log(hljs.highlight(content, {language: 'java'}).value);
        //     codeRef.current.innerHTML = hljs.highlight(content, {language: 'java'}).value;
        // } 
    }, [])

  return (
    
    <pre ref={codeRef} className='language-java px-3 whitespace-pre-wrap'>
        {content}
    </pre>
    )
}

export default File