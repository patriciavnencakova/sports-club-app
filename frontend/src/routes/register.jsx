import React, {useState} from "react";
import {gql, useMutation } from "@apollo/client";
import {useNavigate} from "react-router-dom";

const REGISTRATION = gql`
mutation RegisterUser(
  $firstName: String!
  $lastName: String!
  $email: String!
  $birthDate: Date!
  $password: String!
  $confirmPassword: String!
) {
  registration(
    firstName: $firstName
    lastName: $lastName
    email: $email
    birthDate: $birthDate
    password: $password
    confirmPassword: $confirmPassword
  ) {
    vote {
      id
      birth
      name
      surname
      __typename
    }
    __typename
  }
}
`;

export default function Register() {
    const [errorMessage, setErrorMessage] = useState(null);
    let navigate = useNavigate();

    const [registerUser] = useMutation(REGISTRATION, {
        onError: (error) => {
            setErrorMessage(
                <div
                    className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                    role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        Error: {error.message}
                    </div>
                </div>
            );
        },
        onCompleted: () => {
            navigate('/login');
        }
    });

    console.log(errorMessage)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target); // Extract form data

        const firstName = formData.get('first-name');
        const lastName = formData.get('last-name');
        const birthDate = formData.get('date-picker');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        try {
            await registerUser({
                variables: {
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                },
            });
        } catch (e) {
            // TODO: spravit tu nieco? https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            { errorMessage }
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Registrácia
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="first-name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Meno
                                </label>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="first-name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="last-name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Priezvisko
                                </label>
                                <input
                                    type="text"
                                    id="last-name"
                                    name="last-name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            {/* TODO: Check https://flowbite.com/docs/plugins/datepicker/ */}
                            <div>
                                <label
                                    htmlFor="date-picker"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Dátum narodenia
                                </label>
                                <input
                                    type="date"
                                    id="date-picker"
                                    name="date-picker"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="nejaky@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Heslo
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Potvď heslo
                                </label>
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Zaregistrovať
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Máš už vytvorené konto?{" "}
                                <a
                                    href="login"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Prihlás sa sem.
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    )
}