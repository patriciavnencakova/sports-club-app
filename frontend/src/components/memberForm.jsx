// EventForm.jsx

import React, {useState} from "react";
import EventDetail from "./eventDetail";
import {gql, useMutation} from "@apollo/client";

const ADD_ACCOUNT = gql`
mutation add_account($email: String!, $role: String!) {
  addAccount(email: $email, role: $role) {
    account {
      email
      role {
        description
      }
    }
  }
}
`;

export default function MemberForm({roleTypes, setShowForm, notRegRefetch}) {
    const [selectedRoleType, setSelectedRoleType] = useState(roleTypes[0].description);
    const [errorMessage, setErrorMessage] = useState(null);
    const [addAccount] = useMutation(ADD_ACCOUNT, {
        onError: (error) => {
            console.log(error);
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
            setShowForm(false);
            setErrorMessage(null)
        }
    })

    const handleRoleTypeChange = (e) => {
        setSelectedRoleType(e.target.value);
    };

    const handleCancelButton = (e) => {
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const roleType = formData.get("roleType");
        const email = formData.get("email")

        try {
            await addAccount({
                variables: {
                    email: email,
                    role: roleType,
                },
            });
            if (notRegRefetch !== null) {
                await notRegRefetch();
            }
        } catch (e) {
            console.log('daco sa poruchalo', e);
            // TODO: spravit tu nieco? https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
        }

    };
    console.log(errorMessage)

    return (
        <div>
            {errorMessage}
            <form
                className="max-w-sm mx-auto"
                onSubmit={handleSubmit}
            >
                <label
                    htmlFor="roleType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Rola
                </label>
                <select
                    id="roleType"
                    name="roleType"
                    className="block w-64 py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={selectedRoleType}
                    onChange={handleRoleTypeChange}
                >
                    {roleTypes.map((type) => (
                        <option key={type.id} value={type.description}>{type.description}</option>
                    ))}
                </select>
                <br/>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-64 py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                />
                <br/>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                    >
                        Pridať
                    </button>
                    <button
                        type="button"
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                        onClick={() => setShowForm(false)}
                    >
                        Zrušiť
                    </button>
                </div>
            </form>
        </div>
    );
}
