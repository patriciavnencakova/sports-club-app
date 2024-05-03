import React from "react";
import { useQuery, gql } from "@apollo/client";
import {Link} from "react-router-dom";
import NavBar from "../components/navBar";
import EventDetail from "../components/eventDetail";

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

export default function Events() {
    const { data, loading, error } = useQuery(EVENTS_QUERY);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    return (
        <div className>
            <NavBar />
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Zoznam tréningov a zápasov tvojho tímu:</h2>
            {data.events.map((event) => (
                <div key={event.id}>
                    <Link to={`/events/${event.id}`}>
                        <EventDetail
                            event={event}
                            showMembers={false}
                        />
                    </Link>
                    <br/>
                </div>
            ))}
        </div>
    );
}
