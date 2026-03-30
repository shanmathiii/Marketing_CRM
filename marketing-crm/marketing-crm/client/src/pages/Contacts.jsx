import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, UserX } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', location: '' })

  const fetchContacts = async () => {
    try {
      const { data } = await api.get(`/contacts?search=${search}`)
      setContacts(data.contacts)
    } catch { toast.error('Failed to load contacts') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchContacts() }, [search])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/contacts', form)
      toast.success('Contact created!')
      setShowModal(false)
      setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', location: '' })
      fetchContacts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return
    try {
      await api.delete(`/contacts/${id}`)
      toast.success('Deleted!')
      fetchContacts()
    } catch { toast.error('Failed to delete') }
  }

  const handleUnsubscribe = async (id) => {
    try {
      await api.put(`/contacts/${id}/unsubscribe`)
      toast.success('Unsubscribed!')
      fetchContacts()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">{contacts.length} total contacts</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus size={16} /> Add Contact
        </button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search contacts..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No contacts found. Add your first one!</td></tr>
            ) : contacts.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.firstName} {c.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-600">{c.company || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleUnsubscribe(c._id)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded">
                      <UserX size={15} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Add New Contact</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First Name" value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <input placeholder="Last Name" value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <input required type="email" placeholder="Email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Phone" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Company" value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Location" value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
