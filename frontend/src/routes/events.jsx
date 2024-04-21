import React from "react";
import { useQuery, gql } from "@apollo/client";

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
        <div>
            <h1>Events</h1>
            <ul>
                {data.events.map((event) => (
                    <li key={event.id}>{`${event.team.name} - ${event.type.description} (${event.date})`}</li>
                ))}
            </ul>
        </div>
    );
}
