// src/components/ContactsList.jsx
import { Phone, AlertCircle } from "lucide-react";

export default function ContactsList({ contacts = [] }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Emergency Contacts
        </h2>
      </div>

      {/* Empty state */}
      {contacts.length === 0 ? (
        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-4 rounded-xl">
          <AlertCircle size={18} />
          <span>No emergency contacts registered</span>
        </div>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c, index) => (
            <li
              key={index}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-slate-50 hover:bg-slate-100 transition
                         text-slate-700 font-medium"
            >
              <Phone size={18} className="text-blue-600" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

