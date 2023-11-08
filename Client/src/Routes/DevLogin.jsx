import React, { useContext, useState } from 'react'
import Center from '../components/Effect/Center'
import Medium from '../components/Headings/Medium'
import Input from '../components/Core/Input'
import Label from '../components/Core/Label'
import Button from '../components/Core/Button'
import { Link } from 'react-router-dom'
import Password from '../components/Core/Password'
import { AppContext } from '../context/AppContext'

const DevLogin = () => {

    const {navigate} = useContext(AppContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    const handleLogin = async(e) => {
        const res = await fetch('http://localhost:7888/api/auth/dev/login', {
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({devname : username, password})
        })

        const data = await res.json();

        if(!data.authStatus){
            setResponse(data.message);
            return;
        }

        navigate('/');


        console.log(username, password);
    }
    

  return (
    <section className='mx-auto p-3 mt-[5vh] max-w-[450px] min-w-[300px] border-[1px] border-muted rounded-lg'>
        <Center>
            <Medium>Login for Devs</Medium>
        </Center>
        <div className='px-5 mt-[5vh] flex flex-col gap-5'>
            <div>
                <Label block={true}>Username</Label>
                <Input name={'username'}
                    value={username}
                    placeholder={'Enter username'}
                    changeHandler={(e) => {setUsername(e.target.value)}}/>
            </div>

            <div>
                <Label block={true}>Password</Label>
                <Password name={'password'}
                    value={password}
                    placeholder={'Enter password - atleast 10 chars'}
                    changeHandler={(e) => {setPassword(e.target.value)}}/>
            </div>

            <Center>
                <div className='text-error'>{response}</div>
            </Center>

            <div className='mx-auto w-3/4'>
                <Button clickHandler={handleLogin} >Login</Button>
                <div className='text-center'>Don't have an account? <Link to="/dev/signup">Signup</Link></div>
            </div>

        </div>
    </section>
  )
}

export default DevLogin