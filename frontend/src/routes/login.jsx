import React, {useEffect, useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {getJwtToken, setJwtToken, setRefreshToken} from "../utils/auth";
import { useNavigate } from "react-router-dom"; // Import useHistory hook


const LOGIN = gql`
mutation LoginUser($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    success
    errors
    token
    refreshToken
    user {
      id
      username
    }
  }
}
`;

const VERIFY_TOKEN = gql`
mutation verifyToken($token: String) {
  verifyToken(token: $token) {
    errors
    payload
    success
  }
}
`

export default function Login() {
    const [loginUser] = useMutation(LOGIN);
    const [verifyToken] = useMutation(VERIFY_TOKEN);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // TODO: Make it so the form doesn't appear at all.
    useEffect(() => {
        async function verifyTokenAndRedirect() {
            try {
                const { data: verifyData } = await verifyToken({
                    variables: {
                        token: getJwtToken(),
                    },
                });

                console.log(verifyData, verifyData.verifyToken, verifyData.verifyToken.success, verifyData.verifyToken.success === true);

                if (verifyData && verifyData.verifyToken && verifyData.verifyToken.success === true) {
                    navigate('/events'); // Redirect to '/events' if token verification succeeds
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                // Handle error if needed
            }
        }

        verifyTokenAndRedirect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target); // Extract form data

        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const { data } = await loginUser({
                variables: {
                    username: username,
                    password: password,
                },
            });

            if (data && data.tokenAuth && data.tokenAuth.errors && data.tokenAuth.errors.message) {
                setError(data.tokenAuth.errors.message);
            } else {
                setError(null);
            }
            if (data && data.tokenAuth) {
                setJwtToken(data.tokenAuth.token);
                console.log('tokenAuth', data.tokenAuth);
                setRefreshToken(data.tokenAuth.refreshToken);
                navigate("/events");
            }
        } catch (e) {
            // TODO: spravit tu nieco? https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
        }
    };

    return (
        <div>
        {error !== null && (
            <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    {error}
                </div>
            </div>
        )}

            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        E-mail
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    required
                />
            </div>
            <div className="mb-5">
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Heslo
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    required
                />
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-red dark:focus:ring-red-800"
                >
                    Prihlásiť sa
                </button>
            </div>
            </form>
        </div>
    )
}
