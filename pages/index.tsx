import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login = () => {
    const { ready, authenticated, login } = usePrivy();
    const router = useRouter();

    useEffect(() => {
        if (ready && authenticated) {
            router.push("/home");
        }
    }, [ready, authenticated, router]);

    const handleLogin = () => {
        login();
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <button disabled={!ready} onClick={login} className="px-4 py-2 text-white bg-blue-500 rounded">
                Log in
            </button>
        </div>
    );
};

export default Login;
