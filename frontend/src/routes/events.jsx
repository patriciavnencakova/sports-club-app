import React from "react";
import { useQuery, gql } from "@apollo/client";
import {Link} from "react-router-dom";
import NavBar from "../components/navBar";

const EVENTS_QUERY = gql`
{
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
  }
}
`;

export default function Events() {
    const { data, loading, error } = useQuery(EVENTS_QUERY);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    return (
        <div className>
            <NavBar />

            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Zoznam tréningov a zápasov tvojho tímu:</h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 max-w-sm mx-auto">
                {data.events.map((event) => (
                    <li key={event.id}>
                        <Link to={`/events/${event.id}`}>
                            {`${event.team.name} - ${event.type.description} (${event.date})`}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
