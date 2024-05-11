// EventForm.jsx

import React, {useState} from "react";
import EventDetail from "./eventDetail";
import {gql, useMutation} from "@apollo/client";

const EDIT_EVENT = gql`
mutation edit_event($eventId: ID, $type: String!, $date: Date!, $location: String!) {
  editEvent(eventId: $eventId, type: $type, date: $date, location: $location) {
    event {
      id
      date
      location
      team {
        name
      }
    }
  }
}
`;

export default function EventForm({event, eventTypes, setShowForm, eventsRefetch}) {
    const [selectedEventType, setSelectedEventType] = useState(event?.type.description || eventTypes[0].description);
    const [editEvent] = useMutation(EDIT_EVENT)

    const handleEventTypeChange = (e) => {
        setSelectedEventType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const eventType = formData.get("eventType");
        const date = formData.get("date")
        const location = formData.get("location")

        try {
            await editEvent({
                variables: {
                    eventId: event ? event.id : null,
                    type: eventType,
                    date: date,
                    location: location,
                },
            });
            setShowForm(false);
            if (eventsRefetch !== null) {
                await eventsRefetch();
            }
        } catch (e) {
            console.log('daco sa poruchalo', e);
            // TODO: spravit tu nieco? https://stackoverflow.com/questions/59465864/handling-errors-with-react-apollo-usemutation-hook
        }

    };

    return (
        <form
            className="max-w-sm mx-auto"
            onSubmit={handleSubmit}
        >
            <label
                htmlFor="eventType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Čo?
            </label>
            <select
                id="eventType"
                name="eventType"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                defaultValue={selectedEventType}
                onChange={handleEventTypeChange}
            >
                {eventTypes.map((type) => (
                    <option key={type.id} value={type.description}>{type.description}</option>
                ))}
            </select>
            <br/>
            <label
                htmlFor="date-picker"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Kedy?
            </label>
            <input
                type="date"
                id="date"
                name="date"
                defaultValue={event?.date || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
            />
            <br/>
            <label
                htmlFor="small-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Kde?
            </label>
            <input
                type="text"
                id="location"
                name="location"
                defaultValue={event?.location || ""}
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
            />
            <br/>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                    Poslať
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
    );
}
