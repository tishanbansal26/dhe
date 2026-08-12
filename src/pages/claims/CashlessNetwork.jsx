import React, { useState, useEffect } from 'react';
import { MapPin, Search, Building2, Phone, Star, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CashlessNetwork() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Cashless Hospital Network - Radhe Investments';
    
    const fetchHospitals = async () => {
      const { data } = await supabase.from('hospitals').select('*');
      if (data) setHospitals(data);
      setLoading(false);
    };
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Cashless Hospital Network</h2>
          <p className="text-gray-400">Find a network hospital near you to avail cashless treatment facilities.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="City or Hospital Name" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <div className="flex-1">
              <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                <option>All Insurers</option>
                <option>HDFC Life</option>
                <option>Care Health</option>
                <option>Niva Bupa</option>
              </select>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-3 flex justify-center p-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="col-span-1 md:col-span-3 p-12 text-center text-gray-500 border-2 border-dashed border-slate-700 rounded-2xl">
              No hospitals found matching your search.
            </div>
          ) : (
            filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white leading-tight">{hospital.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" /> {hospital.rating}
                  </div>
                </div>
                <p className="text-emerald-400 text-sm font-medium mb-4">{hospital.type}</p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> 
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone className="w-4 h-4 shrink-0" /> {hospital.phone}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
