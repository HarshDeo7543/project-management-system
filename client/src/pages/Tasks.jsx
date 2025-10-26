import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Tasks() {
  const [tasks, setTasks] = useState([])

  useEffect(() => { api.get('/tasks').then(r=>setTasks(r.data)).catch(()=>{}) }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-3 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{t.title}</div>
                <div className="text-sm text-gray-600">{t.description}</div>
              </div>
              <div className="text-sm text-gray-600">{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
