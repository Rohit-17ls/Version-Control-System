import React from 'react'
import Medium from '../components/Headings/Medium'
import Mute from '../components/Effect/Mute'
import Center from '../components/Effect/Center'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Auth = () => {

    const {navigate} = useContext(AppContext);

  return (
    <section className='mt-[10vh]'>
        <Center>
            <Medium>Signin to continue</Medium>
        </Center>
        <section className='w-100% mt-[10vh] flex flex-row justify-evenly items-center gap-5 sm-max:flex-col'>
            <div className='max-w-[400px] h-fit min-h-[190px] p-4 border-[1px] rounded-lg border-muted cursor-pointer hover' 
                 onClick={() => {navigate('/org/signup')}}>
                <Medium>Organization</Medium>
                <Mute block={true}>Signup/Login for organization. Create projects and forget having to worry about managing collaborative, distributed source control for all your teams.</Mute>
            </div>
            <div className='max-w-[400px] h-fit min-h-[190px] p-4 border-[1px] rounded-lg border-muted cursor-pointer hover'
                 onClick={() => {navigate('/dev/signup')}}>
                <Medium>Developer</Medium>
                <Mute block={true}>Signup/Login for Developers/TechLeads. Contribute to your organization's projects and improve your productivity using our interface designed keeping developers like you in mind.</Mute>
            </div>


        </section>
    </section>
  )
}

export default Auth