import React, {useEffect, useState} from "react";
import { useQuery, gql } from "@apollo/client";
import {Link} from "react-router-dom";
import NavBar from "../components/navBar";
import EventDetail from "../components/eventDetail";
import EventForm from "../components/eventForm";

const EVENTS_QUERY = gql`
query getEvents {
  events {
    __typename
    id
    date
    location
    type {
      description
    }
    team {
      name
    }
    coming {
        id
        firstName
        lastName
      }
      notComing {
        id
        firstName
        lastName
      }
      notResponded {
        id
        firstName
        lastName
      }
  }
}
`;

const GET_ROLE = gql`
query getRole{
  role {
    id
    description
    __typename
  }
}
`;

const GET_EVENT_TYPES = gql`
query getEventTypes{
  eventTypes {
    id
    description
    __typename
  }
}
`;

export default function Events() {
    const { data: eventsData, loading: eventsLoading, error: eventsError, refetch: eventsRefetch } = useQuery(EVENTS_QUERY);
    const { data: roleData, loading: roleLoading, error: roleError } = useQuery(GET_ROLE);
    const { data: eventTypesData, loading: eventTypesLoading, error: eventTypesError } = useQuery(GET_EVENT_TYPES);
    const [addEvent, setAddEvent] = useState(false);

    const [filteredEvents, setFilteredEvents] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (eventsData && eventsData.events) {
            const filtered = eventsData.events.filter(event => event.date >= currentDate);
            setFilteredEvents(filtered);
        }
    }, [eventsData]);

    if (eventsLoading || roleLoading || eventTypesLoading) return "Loading...";
    if (eventsError || roleError || eventTypesError) return <pre>{eventsError.message || roleError.message}</pre>

    const role = roleData.role ? roleData.role.description : null;
    const eventTypes = eventTypesData.eventTypes && eventTypesData.eventTypes.length > 0 ? eventTypesData.eventTypes : null;


    const toggleAddEvent = () => {
        setAddEvent(true);
    };

    console.log(eventsData);

    return (
        <div className>
            <NavBar />
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Zoznam aktuálnych udalostí tvojho tímu:</h2>
            {filteredEvents.map((event) => (
                <div key={event.id}>
                    <EventDetail
                        event={event}
                        showMembers={false}
                    />
                    <br/>
                </div>
            ))}
            {!addEvent && role === "tréner" && (
                <div className="flex justify-center max-w-sm mx-auto">
                    <button
                        type="button"
                        onClick={toggleAddEvent}
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-red dark:focus:ring-red-800"
                    >
                        Pridať udalosť
                    </button>
                </div>
            )}
            {addEvent && (
                <EventForm
                    event={null}
                    eventTypes={eventTypes}
                    setShowForm={setAddEvent}
                    eventsRefetch={eventsRefetch}
                />
            )}
            <br/>
        </div>
    );
}
