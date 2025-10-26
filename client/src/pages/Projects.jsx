import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')

  useEffect(() => { load() }, [])
  function load() { api.get('/projects').then(r => setProjects(r.data)).catch(()=>{}) }

  async function create(e) {
    e.preventDefault()
    try {
      await api.post('/projects', { name })
      setName('')
      load()
    } catch (err) { alert(err?.response?.data?.message || 'Failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <form onSubmit={create} className="mb-4 flex gap-2">
        <input className="border p-2 flex-1" placeholder="New project name" value={name} onChange={e=>setName(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded">Create</button>
      </form>

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <div className="font-bold">{p.name}</div>
            <div className="text-sm text-gray-600">Progress: {p.progress}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
