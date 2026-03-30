import { useState, useEffect } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Segments() {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', isDynamic: true, filters: [] })
  const [filter, setFilter] = useState({ field: 'location', operator: 'equals', value: '' })

  const fetchSegments = async () => {
    try {
      const { data } = await api.get('/segments')
      setSegments(data)
    } catch { toast.error('Failed to load segments') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSegments() }, [])

  const addFilter = () => {
    if (!filter.value) return toast.error('Enter a filter value')
    setForm({ ...form, filters: [...form.filters, { ...filter }] })
    setFilter({ field: 'location', operator: 'equals', value: '' })
  }

  const handlePreview = async () => {
    try {
      const { data } = await api.post('/segments/preview', { filters: form.filters })
      setPreview(data)
    } catch { toast.error('Preview failed') }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/segments', form)
      toast.success('Segment created!')
      setShowModal(false)
      setForm({ name: '', description: '', isDynamic: true, filters: [] })
      setPreview(null)
      fetchSegments()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this segment?')) return
    try {
      await api.delete(`/segments/${id}`)
      toast.success('Deleted!')
      fetchSegments()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segments</h1>
          <p className="text-gray-500 text-sm mt-1">Group contacts by behavior and demographics</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus size={16} /> New Segment
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : segments.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
            No segments yet. Create your first one!
          </div>
        ) : segments.map(s => (
          <div key={s._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{s.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.isDynamic ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {s.isDynamic ? 'Dynamic' : 'Static'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users size={14} />
                <span className="text-sm font-medium">{s.contactCount} contacts</span>
              </div>
              <button onClick={() => handleDelete(s._id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                <Trash2 size={15} />
              </button>
            </div>
            {s.filters?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1">Filters:</p>
                {s.filters.map((f, i) => (
                  <span key={i} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded mr-1 mb-1">
                    {f.field} {f.operator} {f.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Create Segment</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required placeholder="Segment Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Description" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-gray-600">Add Filters</p>
                <div className="flex gap-2">
                  <select value={filter.field} onChange={e => setFilter({ ...filter, field: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                    <option value="location">Location</option>
                    <option value="company">Company</option>
                    <option value="age">Age</option>
                    <option value="isSubscribed">Subscribed</option>
                    <option value="engagementScore">Engagement Score</option>
                  </select>
                  <select value={filter.operator} onChange={e => setFilter({ ...filter, operator: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater than</option>
                    <option value="less_than">Less than</option>
                  </select>
                  <input placeholder="Value" value={filter.value}
                    onChange={e => setFilter({ ...filter, value: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
                  <button type="button" onClick={addFilter}
                    className="bg-primary-50 text-primary-600 px-3 rounded-lg text-xs hover:bg-primary-100">Add</button>
                </div>
                {form.filters.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                    <span className="text-xs text-gray-600">{f.field} {f.operator} <strong>{f.value}</strong></span>
                    <button type="button" onClick={() => setForm({ ...form, filters: form.filters.filter((_, idx) => idx !== i) })}
                      className="text-red-400 text-xs ml-2">✕</button>
                  </div>
                ))}
                {form.filters.length > 0 && (
                  <button type="button" onClick={handlePreview}
                    className="text-xs text-primary-600 hover:underline">Preview segment size</button>
                )}
                {preview && (
                  <div className="bg-blue-50 text-blue-700 text-xs rounded px-3 py-2">
                    {preview.count} contacts match · Sample: {preview.sample?.map(c => c.firstName).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-primary-600 text-white rounded-lg py-2 text-sm hover:bg-primary-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
