import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {})
  }, [])

  const totalTasksByStatus = projects.reduce((acc, p) => {
    if (!p.Tasks) return acc
    p.Tasks.forEach(t => acc[t.status] = (acc[t.status] || 0) + 1)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">To Do</div>
          <div className="text-xl">{totalTasksByStatus['To Do'] || 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-xl">{totalTasksByStatus['In Progress'] || 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Done</div>
          <div className="text-xl">{totalTasksByStatus['Done'] || 0}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Projects</h2>
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-gray-600">Progress: {p.progress}%</div>
              </div>
              <div className="text-sm text-gray-500">Team: {p.teamMembers?.map(t => t.name).join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
