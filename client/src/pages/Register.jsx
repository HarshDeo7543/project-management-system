import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Developer')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      alert(err?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)} className="border p-2">
          <option>Developer</option>
          <option>ProjectManager</option>
          <option>Admin</option>
        </select>
        <button className="bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  )
}
