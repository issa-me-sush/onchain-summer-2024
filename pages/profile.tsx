import React from 'react';

const Profile = () => {
  const username = 'dev1';
  const contributions = [
    'Fixed bug in repository X',
    'Implemented feature Y',
    'Refactored module Z',
  ];
  const attestations = [
    'Attested for completing project A',
    'Attested for bug fixing in project B',
    'Attested for code review in project C',
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-clay-card rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">GitHub Username</h2>
        <p className="text-gray-700">{username}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">Contributions</h2>
        <ul className="list-disc list-inside text-gray-700">
          {contributions.map((contribution, index) => (
            <li key={index}>{contribution}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Attestations</h2>
        <ul className="list-disc list-inside text-gray-700">
          {attestations.map((attestation, index) => (
            <li key={index}>{attestation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
