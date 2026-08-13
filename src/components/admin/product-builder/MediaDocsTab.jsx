import React from 'react';
import { FileText, Upload, Trash2, Link } from 'lucide-react';

export default function MediaDocsTab({ data, updateData }) {
  const documents = data.documents || [];

  const addDocumentPlaceholder = () => {
    const newDoc = {
      id: Date.now().toString(),
      name: 'New Document',
      type: 'Brochure',
      url: ''
    };
    updateData({ documents: [...documents, newDoc] });
  };

  const updateDocument = (id, field, value) => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    updateData({ documents: updatedDocs });
  };

  const removeDocument = (id) => {
    updateData({ documents: documents.filter(doc => doc.id !== id) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Media & Documents</h2>
          <p className="text-sm text-gray-400">Manage brochures, policy wordings, and other product assets.</p>
        </div>
        <button 
          onClick={addDocumentPlaceholder}
          className="flex items-center gap-2 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <Upload className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
          <p className="text-slate-400 max-w-sm mb-6">Upload brochures, policy terms, and other relevant documents for this product.</p>
          <button 
            onClick={addDocumentPlaceholder}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="glass-panel p-5 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-800/30">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shrink-0">
                <FileText className="w-6 h-6 text-teal-400" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Document Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors text-sm"
                    placeholder="e.g. Policy Wording 2024"
                    value={doc.name}
                    onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Document Type</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors text-sm"
                    value={doc.type}
                    onChange={(e) => updateDocument(doc.id, 'type', e.target.value)}
                  >
                    <option value="Brochure">Brochure</option>
                    <option value="Policy Wording">Policy Wording</option>
                    <option value="Prospectus">Prospectus</option>
                    <option value="Claim Form">Claim Form</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => removeDocument(doc.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-auto md:ml-0"
                title="Remove Document"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
