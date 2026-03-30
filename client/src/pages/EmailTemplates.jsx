import { useState, useEffect } from 'react'
import { Plus, Trash2, Mail } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const categoryColors = {
  promotional: 'bg-blue-100 text-blue-600',
  newsletter: 'bg-purple-100 text-purple-600',
  transactional: 'bg-green-100 text-green-600',
  welcome: 'bg-orange-100 text-orange-600'
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '', category: 'promotional', htmlContent: '' })

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/emails')
      setTemplates(data)
    } catch { toast.error('Failed to load templates') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTemplates() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/emails', form)
      toast.success('Template created!')
      setShowModal(false)
      setForm({ name: '', subject: '', category: 'promotional', htmlContent: '' })
      fetchTemplates()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return
    try {
      await api.delete(`/emails/${id}`)
      toast.success('Deleted!')
      fetchTemplates()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 text-sm mt-1">{templates.length} templates</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus size={16} /> New Template
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p>
          : templates.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
              No templates yet. Create your first one!
            </div>
          ) : templates.map(t => (
            <div key={t._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gray-50 border-b border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => setPreview(t)}>
                <div className="text-center">
                  <Mail size={24} className="text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Click to preview</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[t.category]}`}>
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 truncate">{t.subject}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPreview(t)}
                    className="flex-1 text-xs bg-gray-50 text-gray-600 rounded-lg py-1.5 hover:bg-gray-100">Preview</button>
                  <button onClick={() => handleDelete(t._id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold">{preview.name}</h2>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <p className="text-sm text-gray-500 mb-3">Subject: <strong>{preview.subject}</strong></p>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: preview.htmlContent || '<p>No content</p>' }} />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Create Email Template</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required placeholder="Template Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input required placeholder="Email Subject" value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="promotional">Promotional</option>
                <option value="newsletter">Newsletter</option>
                <option value="transactional">Transactional</option>
                <option value="welcome">Welcome</option>
              </select>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">HTML Content</label>
                <textarea required placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                  value={form.htmlContent} rows={8}
                  onChange={e => setForm({ ...form, htmlContent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
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
