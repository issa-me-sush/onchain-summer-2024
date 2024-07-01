import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from '../components/ui/use-toast';
const OpenPage = () => {
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { toast } = useToast()
    const { user } = usePrivy();
    const username = user?.linkedAccounts?.find((account) => account.type === "github_oauth")?.username || "N/A";

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`/api/getRepoInfoForUser?username=${username}`);
                const data = await response.json();
                setRepos(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching repositories:", error);
            }
        };
        if (username) fetchRepos();
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const repo = JSON.parse(selectedRepo);
        const repoUrl = `https://github.com/${repo.org}/${repo.name}`;
        const repoName = repo.name;
        const imageUrl = repo.avatar;
        try {
            const response = await fetch("/api/addOpenRepo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    userId: username,
                    repoName,
                    repoUrl,
                    description,
                    imageUrl,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Open repository added successfully!");
                toast({
                  description: "Repository added successfully!",
                })
            } else {
                setMessage("Failed to add open repository.");
                toast({
                  description: "Failed!",
                })
            }
        } catch (error) {
            console.error("Error adding open repository:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-clay-card rounded-[30px] mt-10">
            <h1 className="mb-4 text-3xl font-bold">Open Repository</h1>
            {loading ? (
                <p>Loading repositories...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Select Repository</label>

                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={selectedRepo}
                            onChange={(e) => setSelectedRepo(e.target.value)}
                        >
                            <option value="">Select a repository</option>
                            {repos.map((repo, index) => (
                                <option key={index} value={JSON.stringify(repo)}>
                                    {repo.org}/{repo.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Difficulty</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            // value={description}
                            // onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Add Open Repository
                    </button>
                </form>
            )}
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default OpenPage;