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

const GET_REASONS = gql`
query getReasons($eventId: Int!) {
  reasons(eventId: $eventId) {
    member {
      firstName
      lastName
    }
    event {
      date
      location
    }
    response
    comment
  }
}
`

const DELETE_EVENT = gql`
mutation deleteE($eventId: ID!) {
  deleteE(eventId: $eventId) {
    event {
      location
      date
    }
  }
}
`;

export default function Event() {
    const [createVote] = useMutation(CREATE_VOTE);
    let navigate = useNavigate();
    const [deleteEvent] = useMutation(DELETE_EVENT, {
        onCompleted: () => {
            navigate(`/events/`);
        }
    });
    const {id: eventId} = useParams();
    const [showForm, setShowForm] = useState(false);
    const [editEvent, setEditEvent] = useState(false);
    const [showReasons, setshowReasons] = useState(false);

    const {data: eventData, loading: eventLoading, error: eventError, refetch: eventRefetch} = useQuery(EVENT_BY_ID, {
        variables: {id: parseInt(eventId)}
    });

    const {data: voteData, loading: voteLoading, error: voteError, refetch: voteRefetch} = useQuery(VOTE_BY_EVENT_ID, {
        variables: {eventId: parseInt(eventId)}
    });

    const {data: roleData, loading: roleLoading, error: roleError} = useQuery(GET_ROLE);
    const {data: eventTypesData, loading: eventTypesLoading, error: eventTypesError} = useQuery(GET_EVENT_TYPES);

    const {data: reasonsData, loading: reasonsLoading, error: reasonsError} = useQuery(GET_REASONS, {
        variables: {eventId: parseInt(eventId)}
    });

    if (eventLoading || voteLoading || roleLoading || eventTypesLoading || reasonsLoading) return "Loading...";
    if (eventError || voteError || roleError || eventTypesError || reasonsError)
        return <pre>{eventError.message || voteError.message || roleError.message || eventTypesError.message
            || reasonsError.message}</pre>;

    const event = eventData.events && eventData.events.length > 0 ? eventData.events[0] : null;
    const vote = voteData.vote ? voteData.vote : null;
    // TODO: Send an enum
    const role = roleData.role ? roleData.role.description : null;

    const eventTypes = eventTypesData.eventTypes && eventTypesData.eventTypes.length > 0 ? eventTypesData.eventTypes : null;
    const reasons = reasonsData.reasons ? reasonsData.reasons : null;

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const toggleEditEvent = () => {
        setEditEvent(true);
        setshowReasons(false);
    };

    const toggleShowReasons = () => {
        setshowReasons(true)
        setEditEvent(false);
    };

    const handleSubmitDelete = async (e) => {
        e.preventDefault();
        const variables = {
            eventId: parseInt(eventId),
        };
        try {
            await deleteEvent({variables});
        } catch (err) {
            console.error('Error while deletion: ', err);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <NavBar/>
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
                    showReasons ? (
                        <div className="max-w-sm mx-auto">
                            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Dôvody
                                neprítomnosti:</h2>
                            <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                                {reasons.map((reason) => (
                                    <li key={reason.id} className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="flex-shrink-0">
                                                <img className="w-8 h-8 rounded-full" src="/user.png"
                                                     alt={`${reason.member.firstName} ${reason.member.lastName} image`}/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {reason.member.firstName} {reason.member.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {reason.comment}
                                                </p>
                                            </div>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                                onClick={() => setshowReasons(false)}
                            >
                                Skryť
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center max-w-sm mx-auto">
                            <button
                                type="button"
                                onClick={toggleEditEvent}
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                            >
                                Upraviť {event.type.description.toLowerCase()}
                            </button>
                            <button
                                type="button"
                                onClick={toggleShowReasons}
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                            >
                                Dôvody neprítomnosti
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitDelete}
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                            >
                                Odstrániť {event.type.description.toLowerCase()}
                            </button>
                        </div>
                    )
                )
            )}
        </div>
    );
}
