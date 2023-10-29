import React, { useContext } from 'react'
import Big from '../components/Headings/Big'
import Button from '../components/Core/Button'
import Small from '../components/Headings/Small'
import Medium from '../components/Headings/Medium'
import BranchIcon from '../components/Icons/BranchIcon'
import HomePageIconVersionControl from '../components/Icons/HomePageIconVersionControl'
import HomePageIconCode from '../components/Icons/HomePageIconCode'
import {AppContext} from '../context/AppContext'

const Home = () => {

  const {navigate} = useContext(AppContext);

  return (


      <div className="bg-none min-h-screen flex flex-col items-start justify-center text-white">
      <header className="mb-12">
        <Big className='inline my-5'>Version -</Big>
        <Medium className='inline text-fg-color my-5'>
          The Version Control Platform
        </Medium>
        <p className="text-lg mt-6">A simplistic version control interface for your project that lets you create and manage your projects, create commits, branches, and collaborate with your team.</p>
      </header>
      <section className=" mb-12">
        <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
        <ul className="list-disc list-inside">
          <li>Create and manage projects</li>
          <li>Create, merge, and delete branches</li>
          <li>Create and manage commits</li>
          <li>Collaborate with developers and tech leads</li>
          <li>Access version control services similar to GitHub</li>
        </ul>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Why Choose Us?</h2>
        <p className="text-lg mb-4">
          Your Version Control Platform provides a reliable and robust version control system for your organization's software development needs. With features like branch management, commit tracking, and powerful collaboration tools, we make version control easy and efficient.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className='bg-gray-100 rounded p-2 my-2 m-auto'>
            <BranchIcon height={300} width={300} strokeWidth={0.8}/>
          </div>
          <div className='bg-gray-100 rounded p-2 my-2 m-auto'>
            <HomePageIconCode height={300} width={300} strokeWidth={1}/>
          </div>
          <div className='bg-gray-100 rounded p-2 my-2 m-auto'>
            <HomePageIconVersionControl height={300} width={300} strokeWidth={0.8}/>
          </div>
        </div>
      </section>
      <section className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-3">Get Started</h2>
        <p className="text-lg mb-4">
          Sign up today to start using our powerful version control platform. Whether you are an organization looking to manage your projects or a developer ready to contribute, we have the tools you need.
        </p>
        <Button className="bg-muted-light text-white font-semibold py-2 px-4 my-[10vh] rounded w-[33%]"
        clickHandler={(e) => {navigate('/auth')}}>
          Sign Up
        </Button>
      </section>
      <footer className="text-center w-full m-0">
        <p>&copy; 2023 Version</p>
      </footer>
    </div>

    
  )
}

export default Home