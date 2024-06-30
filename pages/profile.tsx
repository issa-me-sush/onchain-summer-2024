import React, { useState,useEffect } from 'react';
import { usePrivy } from "@privy-io/react-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import useUserWallets from '../hooks/useUserWallets';
const Profile = () => {
  const { user } = usePrivy();
  
  const username = user?.linkedAccounts?.find(account => account.type === 'github_oauth')?.username || 'N/A';
  const { data, loading, error } = useUserWallets(username);
  console.log("wallets",data)
  const [githubData, setGithubData] = useState([]);
  useEffect(() => {
    const fetchGithubData = async () => {
      const response = await fetch(`/api/getInfoFromGithub?username=${username}`);
      const data = await response.json();
      console.log(data)
      setGithubData(data);
    };

    if (username) {
      fetchGithubData();
    }
  }, [username]);
  // @ts-ignore
  const walletAddress = data && data.length > 0 ? data[0].embedded_address : "-";
  const attestationsReceived = [
    'Attested for completing project A',
    'Attested for bug fixing in project B',
    'Attested for code review in project C',
  ];
  const attestationsGiven = [
    'Attested project D',
    'Attested project E',
    'Attested project F',
  ];
  const myRepos = [
    'Repository 1',
    'Repository 2',
    'Repository 3',
  ];

  const [mergeUrl, setMergeUrl] = useState('');
  const [maintainerGithubId, setMaintainerGithubId] = useState('');
  const [remark, setRemark] = useState('');
  const [contributorId, setContributorId] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-clay-card rounded-[30px] mt-10">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex">
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="endorse" className="flex-1">Endorse by Attesting</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">GitHub Username</h2>
            <p className="text-gray-700">{username}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Wallet Address</h2>
            <p className="text-gray-700">{walletAddress}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Attestations Received</h2>
            <ul className="list-disc list-inside text-gray-700">
              {attestationsReceived.map((attestation, index) => (
                <li key={index}>{attestation}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">Attestations Given</h2>
            <ul className="list-disc list-inside text-gray-700">
              {attestationsGiven.map((attestation, index) => (
                <li key={index}>{attestation}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
  <h2 className="text-xl font-semibold mb-4">My Repositories</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {githubData.map((repo, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-clay-card">
        <h3 className="text-lg font-semibold">{repo.name}</h3>
        <p className="text-gray-700">{repo.org}</p>
        <p className="text-gray-600">{repo.description}</p>
        <p className="text-gray-500 text-sm mt-2">Updated at: {new Date(repo.updatedAt).toLocaleDateString()}</p>
        <p className="text-gray-500 text-sm">Private: {repo.isPrivate ? 'Yes' : 'No'}</p>
      </div>
    ))}
  </div>
</div>

        </TabsContent>
        <TabsContent value="endorse">
          <h2 className="text-xl font-semibold mb-4">Endorse by Attesting</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Merge URL</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={mergeUrl}
                onChange={(e) => setMergeUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Maintainer GitHub ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={maintainerGithubId}
                onChange={(e) => setMaintainerGithubId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Remark</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Contributor ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={contributorId}
                onChange={(e) => setContributorId(e.target.value)}
              />
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
