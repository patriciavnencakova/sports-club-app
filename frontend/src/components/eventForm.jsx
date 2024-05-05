// EventForm.jsx

import React, {useState} from "react";

export default function EventForm({eventId, createVote, voteRefetch, eventRefetch, setShowForm}) {
    const [attendance, setAttendance] = useState(true);
    const [comment, setComment] = useState("");

    const handleAttendanceChange = (e) => {
        const value = e.target.value === '1';
        setAttendance(value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const variables = {
            eventId: eventId,
            response: attendance,
            comment: comment
        };

        try {
            const {data} = await createVote({variables});
            console.log('Vote created:', data);
            setAttendance(true);
            setComment("");

            await voteRefetch();
            await eventRefetch();
            setShowForm(false);
        } catch (err) {
            console.error('Error creating vote:', err);
        }

        console.log('Form data:', variables);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-8">
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
    );
}
