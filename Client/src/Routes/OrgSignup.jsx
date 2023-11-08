import React, { useState, useContext, useCallback } from 'react'
import Center from '../components/Effect/Center'
import Medium from '../components/Headings/Medium'
import Input from '../components/Core/Input'
import Label from '../components/Core/Label'
import Button from '../components/Core/Button'
import { Link } from 'react-router-dom'
import Password from '../components/Core/Password'
import { AppContext } from '../context/AppContext'

const OrgSignup = () => {

    const [orgname, setOrgname] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    const {navigate} = useContext(AppContext);

    const handleSignup = async() => {
        if(!orgname.length){
            setResponse('Organization name cannot be empty');
        }

        const res = await fetch('http://localhost:7888/api/auth/org/signup', {
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({orgname , password})
        })
        const data = await res.json();

        if(data.authStatus){
            navigate('/org/login');
            return;
        }

        setResponse(data.message);
        console.log(data);
    }

    const validateOrgName = useCallback((name) => {
        if(!/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(name)){
            setResponse(`Invalid name , regexp ^[a-zA-Z]+(-[a-zA-Z0-9]+)*$`);
        }else if(response.length){
            setResponse('');
        }
        setOrgname(name);
    })


  return (
    <section className='mx-auto p-3 mt-[5vh] max-w-[450px] min-w-[300px] border-[1px] border-muted rounded-lg'>
        <Center>
            <Medium>Signup for Organizations</Medium>
        </Center>
        <div className='px-5 mt-[5vh] flex flex-col gap-5'>
            <div>
                <Label block={true}>Organization name</Label>
                <Input name={'orgname'}
                    error={!orgname.length ? false : !/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(orgname)}
                    value={orgname}
                    placeholder={'Enter organization name'} 
                    changeHandler={(e) => {validateOrgName(e.target.value)}}/>
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

            <div className='mx-auto w-2/3'>
                <Button clickHandler={handleSignup}>Signup</Button>
                <div className='text-center'>Already have an account? <Link to="/org/login">Login</Link></div>
            </div>

        </div>
    </section>
  )
}

export default OrgSignup