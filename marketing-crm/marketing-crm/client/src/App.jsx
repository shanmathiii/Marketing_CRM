import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Campaigns from './pages/Campaigns'
import Segments from './pages/Segments'
import EmailTemplates from './pages/EmailTemplates'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'
import { getToken } from './utils/auth'

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="segments" element={<Segments />} />
        <Route path="emails" element={<EmailTemplates />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  )
}
