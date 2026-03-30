import { useState, useEffect } from 'react'
import { Plus, Trash2, Play, Pause } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const statusColors = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-600',
  active: 'bg-green-100 text-green-600',
  paused: 'bg-yellow-100 text-yellow-600',
  completed: 'bg-purple-100 text-purple-600'
}
const typeColors = {
  email: 'bg-blue-50 text-blue-600',
  sms: 'bg-green-50 text-green-600',
  push: 'bg-orange-50 text-orange-600',
  social: 'bg-pink-50 text-pink-600'
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'email', subject: '', content: '', budget: '', scheduledAt: '' })

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get('/campaigns')
      setCampaigns(data)
    } catch { toast.error('Failed to load campaigns') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCampaigns() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/campaigns', form)
      toast.success('Campaign created!')
      setShowModal(false)
      setForm({ name: '', type: 'email', subject: '', content: '', budget: '', scheduledAt: '' })
      fetchCampaigns()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign?')) return
    try {
      await api.delete(`/campaigns/${id}`)
      toast.success('Deleted!')
      fetchCampaigns()
    } catch { toast.error('Failed') }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/campaigns/${id}`, { status })
      toast.success('Status updated!')
      fetchCampaigns()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">{campaigns.length} total campaigns</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus size={16} /> New Campaign
        </button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">No campaigns yet. Create your first one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(c => (
            <div key={c._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[c.type]}`}>{c.type}</span>
              </div>
              {c.subject && <p className="text-sm text-gray-600 truncate">{c.subject}</p>}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                {c.budget > 0 && <span className="text-xs text-gray-500">Budget: ${c.budget}</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{c.metrics?.sent || 0}</p>
                  <p className="text-xs text-gray-400">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{c.metrics?.opened || 0}</p>
                  <p className="text-xs text-gray-400">Opened</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{c.metrics?.clicked || 0}</p>
                  <p className="text-xs text-gray-400">Clicked</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                {c.status === 'draft' && (
                  <button onClick={() => handleStatusChange(c._id, 'active')}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 rounded-lg py-1.5 text-xs hover:bg-green-100">
                    <Play size={12} /> Activate
                  </button>
                )}
                {c.status === 'active' && (
                  <button onClick={() => handleStatusChange(c._id, 'paused')}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-50 text-yellow-600 rounded-lg py-1.5 text-xs hover:bg-yellow-100">
                    <Pause size={12} /> Pause
                  </button>
                )}
                <button onClick={() => handleDelete(c._id)}
                  className="flex items-center justify-center bg-red-50 text-red-500 rounded-lg py-1.5 px-3 text-xs hover:bg-red-100">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Create Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required placeholder="Campaign Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
                <option value="social">Social Media</option>
              </select>
              <input placeholder="Subject Line" value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <textarea placeholder="Campaign content..." value={form.content} rows={4}
                onChange={e => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              <input type="number" placeholder="Budget ($)" value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Schedule Date & Time</label>
                <input type="datetime-local" value={form.scheduledAt}
                  onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
