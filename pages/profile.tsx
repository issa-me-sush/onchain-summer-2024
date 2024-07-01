import React, { useState,useEffect } from 'react';
import { usePrivy } from "@privy-io/react-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import useUserWallets from '../hooks/useUserWallets';
import { useToast } from '../components/ui/use-toast';
import useEas from '../hooks/eas';
const Profile = () => {
  const { user } = usePrivy();
  const { toast } = useToast()
  const {attestSchemaInBlockchain} = useEas()
  console.log("user",user)
  // @ts-ignore 
  const username = user?.linkedAccounts?.find(account => account.type === 'github_oauth')?.username || 'N/A';
  const { data, loading, error } = useUserWallets(username);
  console.log("wallets",data)
  const [githubData, setGithubData] = useState([]);
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
      
        const response = await fetch(`/api/getRepoInfoForUser?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setGithubData(data);
        } else {
          console.error("Failed to fetch GitHub data");
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } 
    };

    if (username) {
      fetchGithubData();
    }
  }, [username]);
  // @ts-ignore
  const walletAddress = data && data.length > 0 ? data[0].smart_contract_address : "-";
  // const attestationsReceived = [
  //   'Attested for completing project A',
  //   'Attested for bug fixing in project B',
  //   'Attested for code review in project C',
  // ];
  // const attestationsGiven = [
  //   'Attested project D',
  //   'Attested project E',
  //   'Attested project F',
  // ];
  const myRepos = [
    'Repository 1',
    'Repository 2',
    'Repository 3',
  ];

  const [mergeUrl, setMergeUrl] = useState('');
  const [maintainerGithubId, setMaintainerGithubId] = useState('');
  const [remark, setRemark] = useState('');
  const [attestationsReceived, setAttestationsReceived] = useState([]);
  const [attestationsGiven, setAttestationsGiven] = useState([]);
  const [contributorId, setContributorId] = useState('');
  const handleAttest = async (e) => {
    e.preventDefault();
    console.log(mergeUrl, maintainerGithubId, remark, contributorId)
    toast({
        description: "Please wait while the tx goes through! dont refresh until success toast!",
      })
    const tx = await attestSchemaInBlockchain(mergeUrl, maintainerGithubId, remark, contributorId);
    if (tx) {
      toast({
        description: "Attestation Successful! updating profile!",
      })
      const repoName = mergeUrl.split('/')[4]; // Extract repo name from merge URL
        // @ts-ignore 
      const repo = githubData.find((r) => r.name === repoName);


      if (!repo) {
        console.error('Repository not found in fetched data.');
        return;
      }

  // @ts-ignore 
      const starCount = repo.stars;
      

      const githubResponse = await fetch(`https://fleek-test.network/services/1/ipfs/bafkreieyba4qsgo5mfj7mvmk3t6ge7gho27dep6vrtdpwn6545qgjmeecy/api/getGithubUserInfo?username=${username}`);
        if (!githubResponse.ok) {
            throw new Error(`GitHub API responded with status: ${githubResponse.status}`);
        }
        const githubUserData = await githubResponse.json();
         const profileUrl = githubUserData.avatar_url;
         const response = await fetch('/api/addDev', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              githubId: username,
              profileUrl,
              starCount
          })
      });
      const data = await response.json();
      console.log('User updated:', data);
      toast({
        description: "profile updated!!",
      })
  
    }
  };
  useEffect(() => {
    const getAttestations = async () => {
      try {
        const response = await fetch(`/api/getAddressAttestationsReceived?recipient=${walletAddress}`);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.data && data.data.data && data.data.data.attestations) {
          setAttestationsReceived(data.data.data.attestations);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching attestations:', error);
      }
    };

    if (walletAddress !== "-" && !loading && walletAddress) {
      console.log("Fetching attestations for address:", walletAddress);
      getAttestations();
    }
  }, [walletAddress, loading]);

  useEffect(() => {
    const getAttestationsGiven = async () => {
      try {
        const response = await fetch(`/api/getAddressAttestationsGiven?attester=${walletAddress}`);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.data && data.data.data && data.data.data.attestations) {
          setAttestationsGiven(data.data.data.attestations);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching attestations given:', error);
      }
    };

    if (walletAddress !== "-" && !loading && walletAddress) {
      console.log("Fetching attestations given by address:", walletAddress);
      getAttestationsGiven();
    }
  }, [walletAddress, loading]);
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
            <ul key={index}>
              <div className="p-2 border rounded-lg mb-2 bg-white shadow">
             {/* @ts-ignore  */}
                <p><strong>Attester:</strong> {attestation.attester}</p>
                {/* @ts-ignore  */}
                <p><strong>Schema ID:</strong> {attestation.schemaId}</p>
                <p><strong>Decoded Data:</strong></p>
                <ul className="list-disc list-inside ml-4">
                       {/* @ts-ignore  */}
                  <li><strong>GitHub URL:</strong> {attestation.decodedData.github_url}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Maintainer GitHub ID:</strong> {attestation.decodedData.maintainer_github_id}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Remark:</strong> {attestation.decodedData.remark}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Contributor GitHub ID:</strong> {attestation.decodedData.contributor_github_id}</li>
                </ul>
              </div>
            </ul>
          ))}
        </ul>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">Attestations Given</h2>
        <ul className="list-disc list-inside text-gray-700">
          {attestationsGiven.map((attestation, index) => (
            <ul key={index}>
              <div className="p-2 border rounded-lg mb-2 bg-white shadow">
                     {/* @ts-ignore  */}
                <p><strong>Recipient:</strong> {attestation.recipient}</p>
                     {/* @ts-ignore  */}
                <p><strong>Schema ID:</strong> {attestation.schemaId}</p>
                <p><strong>Decoded Data:</strong></p>
                <ul className="list-disc list-inside ml-4">
                       {/* @ts-ignore  */}
                  <li><strong>GitHub URL:</strong> {attestation.decodedData.github_url}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Maintainer GitHub ID:</strong> {attestation.decodedData.maintainer_github_id}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Remark:</strong> {attestation.decodedData.remark}</li>
                       {/* @ts-ignore  */}
                  <li><strong>Contributor GitHub ID:</strong> {attestation.decodedData.contributor_github_id}</li>
                </ul>
              </div>
            </ul>
          ))}
        </ul>
      </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">My Repositories</h2>
        <ul className="list-disc list-inside text-gray-700">
          {loading ? (
            <li>Loading...</li>
          ) : (
            githubData.map((repo, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-clay-card mb-2">
                     {/* @ts-ignore  */}
                <p className="font-bold">{repo.name}</p>
                     {/* @ts-ignore  */}
                <p>{repo.description}</p>
                     {/* @ts-ignore  */}
                <p>{repo.org}</p>
                     {/* @ts-ignore  */}
                <p>{repo.isPrivate ? "Private" : "Public"}</p>
                     {/* @ts-ignore  */}
                <p>Updated at: {new Date(repo.updatedAt).toLocaleString()}</p>
                     {/* @ts-ignore  */}
                <p>Stars: {repo.stars}</p>
              </li>
            ))
          )}
        </ul>
      </div>

        </TabsContent>
        <TabsContent value="endorse">
          <h2 className="text-xl font-semibold mb-4">Endorse by Attesting</h2>
          <form className="space-y-4" onSubmit={handleAttest}>
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
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-clay-btn focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Create Attestation
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
