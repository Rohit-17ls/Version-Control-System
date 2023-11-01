import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Routes/Home'
import NotFound from './Routes/NotFound'
import Auth from './Routes/Auth'
import DevSignup from './Routes/DevSignup'
import DevLogin from './Routes/DevLogin'
import OrgSignup from './Routes/OrgSignup'
import OrgLogin from './Routes/OrgLogin'
import AppContextProvider from './context/AppContext'
import NewProject from './Routes/NewProject'
import Project from './Routes/Project'
import ProjectList from './Routes/ProjectList'
import SearchProjects from './Routes/SearchProjects'
import CommitInsights from './Routes/CommitInsights'


function App() {

  return (
    <AppContextProvider>
      <div id="app">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/dev/signup" element={<DevSignup/>}/>
          <Route path="/dev/login" element={<DevLogin/>}/>
          <Route path="/org/signup" element={<OrgSignup/>}/>
          <Route path="/org/login" element={<OrgLogin/>}/>
          <Route path="/new-project" element={<NewProject/>}/>
          <Route path="projects" element={<SearchProjects/>}/>
          <Route path="/:orgname/projects" element={<ProjectList/>}/>
          <Route path="/:orgname/:projectName/commits" element={<CommitInsights/>}/>
          <Route path="/:org/:projectName/:branchName/*" element={<Project/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      
      </div>
    </AppContextProvider>
  )
}

export default App
