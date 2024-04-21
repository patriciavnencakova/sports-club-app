import React, {useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import { useParams } from "react-router-dom";

const EVENT_BY_ID = gql`
  query eventById($id: Int!) {
    events(id: $id) {
      id
      date
      type {
        description
      }
      location
      team {
        id
        name
      }
    }
  }
`;

const CREATE_VOTE = gql`
  mutation vote($memberId: ID!, $eventId: ID!, $response: Boolean!, $comment: String) {
    vote(memberId: $memberId, eventId: $eventId, response: $response, comment: $comment) {
      vote {
        id
        member {
          id
        }
        event {
          id
        }
        response
        comment
      }
    }
  }
`;

export default function Event() {
    // const [loginUser] = useMutation(EVENT_BY_ID);
    const [attendance, setAttendance] = useState('1');
    const [reason, setReason] = useState(true);

    const { id } = useParams();
    const { data, loading, error } = useQuery(EVENT_BY_ID, {
        variables: { id: parseInt(id) } // Convert id to integer if needed
    });

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>;

    const event = data.events[0]; // Assuming there's only one event returned

    const handleAttendanceChange = (e) => {
        setAttendance(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Prepare the form data to be submitted
        const formData = {
            attendance: attendance === '1',
            reason: reason
        };

        // Perform further actions with the form data, such as sending it to the server
        console.log('Form data:', formData);

        // Clear the form fields
        setAttendance('1');
        setReason('');
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            {/* Event details */}
            <div className="mb-8">
                <a
                    href="#"
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 max-w-sm mx-auto"
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {event.type.description}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Kedy? <b>{event.date}</b>
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Kde? <b>{event.location}</b>
                    </p>
                </a>
            </div>
            <div className="mb-8">
                {/* Attendance options */}
                <div className="flex items-center mb-4 max-w-sm mx-auto">
                    <input
                        id="pridem-radio"
                        type="radio"
                        name="attendance"
                        value="1"
                        checked={attendance === '1'}
                        onChange={handleAttendanceChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                        htmlFor="pridem-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        Prídem
                    </label>
                </div>
                <div className="flex items-center mb-4 max-w-sm mx-auto">
                    <input
                        id="nepridem-radio"
                        type="radio"
                        name="attendance"
                        value="0"
                        checked={attendance === '0'}
                        onChange={handleAttendanceChange}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                        htmlFor="nepridem-radio"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        Neprídem
                    </label>
                </div>

                {/* Reason for absence */}
                {attendance === '0' && (
                    <div className="mb-8">
                        <div className="max-w-sm mx-auto">
                            <div className="mb-5">
                                <label
                                    htmlFor="large-input"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Dôvod neprítomnosti:
                                </label>
                                <input
                                    type="text"
                                    id="large-input"
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit button */}
                <div className="max-w-sm mx-auto">
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-red-500 rounded-md focus:outline-none hover:bg-red-600"
                    >
                        Poslať
                    </button>
                </div>
            </div>
        </form>
        </div>
    );
}
