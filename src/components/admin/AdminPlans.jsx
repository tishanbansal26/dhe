import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Shield, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../EmptyState';

export default function AdminPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('insurance_plans').select('*, insurance_companies(name)').order('name');
    if (!error) setPlans(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      await supabase.from('insurance_plans').delete().eq('id', id);
      fetchData();
    }
  };

  const openEdit = (plan) => {
    setFormData({
      id: plan.id,
      company_id: plan.company_id,
      name: plan.name,
      category: plan.category,
      type: plan.type,
      tag: plan.tag,
      active: plan.active,
      summary: plan.metadata?.summary || '',
      premium: plan.metadata?.premium || '',
      iconName: plan.metadata?.iconName || 'Shield'
    });
    setShowModal(true);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Insurance Plans</h3>
        <button 
          onClick={() => navigate('/admin/product-builder')}
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-colors"
        >
          <BrainCircuit className="w-4 h-4" /> Policy Product Builder
        </button>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Plan Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4 flex gap-2">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-700/50 rounded-lg"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Plan Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Premium</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {plans.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium">{p.name}</td>
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 text-white font-medium">{plan.name}</td>
                  <td className="px-4 py-4 text-teal-400">{plan.insurance_companies?.name}</td>
                  <td className="px-4 py-4 text-gray-300">{plan.category}</td>
                  <td className="px-4 py-4 text-gray-300">{plan.metadata?.premium || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${plan.active ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                      {plan.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/admin/product-builder/${plan.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors p-2 bg-blue-500/10 rounded-lg" title="Edit in Builder">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8">
                    <EmptyState 
                      title="No Plans Found" 
                      description="There are currently no insurance plans listed."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
