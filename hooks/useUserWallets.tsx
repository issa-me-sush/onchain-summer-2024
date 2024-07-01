import { useState, useEffect } from "react";
// @ts-ignore
const useUserWallets = (username) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("here");
                const response = await fetch(`/api/getUsersAddress?username=${username}`);
                console.log("here2", response);
                const result = JSON.parse(await response.text());
                console.log("result", result);
                setData(result);
            } catch (err) {
                // @ts-ignore
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    return { data, loading, error };
};

export default useUserWallets;
