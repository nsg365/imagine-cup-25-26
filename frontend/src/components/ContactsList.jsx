// src/components/ContactsList.jsx
import { Phone } from "lucide-react";

export default function ContactsList({ contacts }) {
  return (
    <div className="bg-white shadow-sm p-6 rounded-xl border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Emergency Contacts
      </h2>

      <ul className="space-y-2">
        {contacts.map((c, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-gray-700 font-medium"
          >
            <Phone size={18} className="text-blue-600" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
