import React, {useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import { useParams } from "react-router-dom";
import {comment} from "postcss";

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
  mutation vote($eventId: ID!, $response: Boolean!, $comment: String) {
    vote(eventId: $eventId, response: $response, comment: $comment) {
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
    const [createVote] = useMutation(CREATE_VOTE);
    const [attendance, setAttendance] = useState(true);
    const [comment, setComment] = useState("");
    const { id: eventId } = useParams();

    const { data, loading, error } = useQuery(EVENT_BY_ID, {
        variables: { id: parseInt(eventId) } // Convert id to integer if needed
    });

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>;

    const event = data.events[0]; // Assuming there's only one event returned

    const handleAttendanceChange = (e) => {
        const value = e.target.value === '1'; // Convert '1' to true, '0' to false
        setAttendance(value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const formData = new FormData(e.target);

        const formData = {
            attendance: attendance,
            comment: comment
        };
        console.log(comment);
        console.log(attendance);

        const variables = {
            // memberId: 1, // Replace with the actual member ID
            eventId: eventId,
            response: attendance,
            comment: comment
        };

        try {
            const {data} = await createVote({variables});

            console.log('Vote created:', data);
        } catch (err) {
            // Handle error, if needed
            console.error('Error creating vote:', err);
        }

        // Perform further actions with the form data, such as sending it to the server
        console.log('Form data:', variables);

        // Clear the form fields
        setAttendance(true);
        setComment("");
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
                        checked={attendance === true}
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
                        checked={attendance === false}
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
                {attendance === false && (
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
                                    id="comment"
                                    name="comment"
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={handleCommentChange}
                                    required
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
