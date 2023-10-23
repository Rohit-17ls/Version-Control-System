import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

const extensionRegex = /[^\.]*[a-zA-Z0-9]+$/;

const File = ({content, name}) => {

    const codeRef = useRef();

    useEffect(() => {
        
        const match = name.match(extensionRegex);
        if(match){
            const extension = match[0];
            const markup = hljs.highlight(content, {language : extension}).value;
            codeRef.current.innerHTML = markup;
        }
         
    }, [])

  return (
    
    <>
        <pre ref={codeRef} className='language-java px-3 whitespace-pre-wrap'>
            {content}
        </pre>
    </>
    )
}

export default File