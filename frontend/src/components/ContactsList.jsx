export default function ContactsList({ contacts }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <h2 className="text-lg font-semibold mb-2">Emergency Contacts</h2>

      {contacts?.length === 0 ? (
        <p className="text-gray-500">No emergency contacts found.</p>
      ) : (
        <ul className="list-disc ml-6 text-gray-700">
          {contacts.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
