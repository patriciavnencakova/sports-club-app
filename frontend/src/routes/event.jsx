import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import {useNavigate, useParams} from "react-router-dom";
import VoteForm from "../components/voteForm";
import NavBar from "../components/navBar";
import EventDetail from "../components/eventDetail";
import EventForm from "../components/eventForm";

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

const VOTE_BY_EVENT_ID = gql`
query voteByEventId($eventId: Int!){
  vote(eventId: $eventId) {
    member {
      firstName
      lastName
    }
    event {
      id
      date
      type{
        description
      }
      location
    }
    response
    comment
  }
}
`

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

export default function Event() {
    const [createVote] = useMutation(CREATE_VOTE);
    const {id: eventId} = useParams();
    const [showForm, setShowForm] = useState(false);
    const [editEvent, setEditEvent] = useState(false);
    // const [event, setEvent] = useState(null);

    const {data: eventData, loading: eventLoading, error: eventError, refetch: eventRefetch} = useQuery(EVENT_BY_ID, {
        variables: {id: parseInt(eventId)}
    });

    const {data: voteData, loading: voteLoading, error: voteError, refetch: voteRefetch} = useQuery(VOTE_BY_EVENT_ID, {
        variables: {eventId: parseInt(eventId)}
    });

    const {data: roleData, loading: roleLoading, error: roleError} = useQuery(GET_ROLE);
    const {data: eventTypesData, loading: eventTypesLoading, error: eventTypesError} = useQuery(GET_EVENT_TYPES);

    if (eventLoading || voteLoading || roleLoading || eventTypesLoading) return "Loading...";
    if (eventError || voteError || roleError || eventTypesError) return <pre>{eventError.message || voteError.message}</pre>;

    const event = eventData.events && eventData.events.length > 0 ? eventData.events[0] : null;
    const vote = voteData.vote ? voteData.vote : null;
    // TODO: Send an enum
    const role = roleData.role ? roleData.role.description : null;

    const eventTypes = eventTypesData.eventTypes && eventTypesData.eventTypes.length > 0 ? eventTypesData.eventTypes : null;
    console.log(eventTypes)

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const toggleEditEvent = () => {
        setEditEvent(true);
    };

    return (
        <div>
            <div className="mb-8">
                <NavBar
                    role={role}
                />
                <EventDetail
                    event={event}
                    showMembers={true}
                />
            </div>
            {role === "hráč" ? (
                !vote || showForm ? (
                    <VoteForm
                        eventId={eventId}
                        createVote={createVote}
                        voteRefetch={voteRefetch}
                        eventRefetch={eventRefetch}
                        setShowForm={setShowForm}
                    />
                ) : (
                    <div className="max-w-sm mx-auto">
                        <p style={{fontSize: 20}}>Tvoja
                            odpoveď: <strong>{vote.response ? 'prídem' : 'neprídem'}</strong></p>
                        {vote.comment && <p style={{fontSize: 18}}>Dôvod: <strong>{vote.comment}</strong></p>}
                        <br/>
                        <button
                            type="button"
                            onClick={toggleForm}
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-red dark:focus:ring-red-800"
                        >
                            Zmeniť odpoveď
                        </button>
                    </div>
                )
            ) : (
                editEvent ? (
                    <EventForm
                        event={event}
                        eventTypes={eventTypes}
                        setShowForm={setEditEvent}
                        eventsRefetch={null}
                    />
                ) : (
                    <div className="flex justify-center max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={toggleEditEvent}
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-red dark:focus:ring-red-800"
                        >
                            Upraviť {event.type.description.toLowerCase()}
                        </button>
                    </div>
                )
            )
            }
        </div>
    );
}
