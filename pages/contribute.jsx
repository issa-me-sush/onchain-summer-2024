import React, { useState, useEffect } from 'react';

const AvailablePage = () => {
  const [openRepos, setOpenRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenRepos = async () => {
    try {
      const response = await fetch('/api/fetchOpen');
      const data = await response.json();
      setOpenRepos(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching open repositories:', error);
    }
  };

  useEffect(() => {
    fetchOpenRepos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-clay-card rounded-[30px] mt-10">
      <h1 className="text-3xl font-bold mb-4"> Earn Attestations by Contributing! </h1>
      {loading ? (
        <p>Loading repositories...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {openRepos.map((repo, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
              {repo.imageUrl && <img src={repo.imageUrl} alt={repo.repoName} className="w-full h-32 object-cover mb-4 rounded-lg" />}
              <h3 className="text-xl font-semibold mb-2">{repo.repoName}</h3>
              <p className="text-gray-700 mb-4">{repo.description}</p>
              <a href={repo.repoUrl} target="_blank" className="text-blue-600 hover:underline">Contribute</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailablePage;
