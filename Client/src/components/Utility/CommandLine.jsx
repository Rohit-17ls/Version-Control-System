import React, { useEffect, useState, useRef } from 'react'
import Input from '../Core/Input'

const CommandLine = ({orgname, projectName, branch, projectPath}) => {

    const [command, setCommand] = useState('');
    const [commandResponse, setCommandResponse] = useState({status : false, message : ''});
    // const [commandHistory, setCommandHistory] = useState([]);
    // const [commandIndex, setCommandIndex] = useState([]);
    // const commandRef = useRef();

    // useEffect(() => { 
    //     commandRef.current.addEventListener('keydown', (e) => {
    //         if(e.key === 'ArrowUp' && commandIndex > 0){
    //             setCommandIndex(commandIndex-1);
    //         }else if(e.key === 'ArrowDown' && commandIndex < commandHistory.length-1){
    //             setCommandIndex(commandIndex + 1);
    //         }
    //     })
    // }, [])

    const submitHandler = async(e) => {
        e.preventDefault();
        console.log(command);

        const res = await fetch('http://localhost:7888/api/command', {
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({command, orgname, projectName, branch, projectPath})    
        });

        const data = await res.json();

        console.log(data);
        setCommandResponse(data);
        // setCommandHistory(prevState => [prevState, ...command]);
    }



    return (
    <section className='bg-hover rounded-lg w-[80%] sm-max:w-full my-8'>
        <section className='w-full sm-max:w-full h-fit flex flex-row items-center border-[1px] border-muted rounded-lg'>
            <pre className='inline pl-2 pr-1 font-semibold text-success'>/{projectPath}$</pre>
            
            <form onSubmit={submitHandler} className='w-full'>
                <Input name='command'
                        className='pl-1 border-none consolas'
                        placeholder={'Enter your command here'}
                        // inputRef = {commandRef}
                        // value={commandHistory[commandIndex]}
                        autoComplete={'off'}
                        changeHandler={(e) => {
                                                setCommand(e.target.value);
                                              }}
                        
                />
            </form>
        </section>

        <div className={`${commandResponse.status ? 'p-3'  : 'text-error' }`}>
            <pre className='whitespace-pre-wrap p-2'>
                {commandResponse.status ? commandResponse.result : commandResponse.message}
            </pre>
        </div>
    </section>
    )
}

export default CommandLine