import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import {useNavigate, useParams} from "react-router-dom";
import EventForm from "../components/eventForm";
import NavBar from "../components/navBar";
import EventDetail from "../components/eventDetail";

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
    event{
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

export default function Event() {
    const [createVote] = useMutation(CREATE_VOTE);
    const { id: eventId } = useParams();
    const [showForm, setShowForm] = useState(false);
    // const [event, setEvent] = useState(null);

    const { data: eventData, loading: eventLoading, error: eventError, refetch: eventRefetch } = useQuery(EVENT_BY_ID, {
        variables: { id: parseInt(eventId) }
    });

    const { data: voteData, loading: voteLoading, error: voteError, refetch: voteRefetch } = useQuery(VOTE_BY_EVENT_ID, {
        variables: { eventId: parseInt(eventId) }
    });

    if (eventLoading || voteLoading) return "Loading...";
    if (eventError || voteError) return <pre>{eventError.message || voteError.message}</pre>;

    const event = eventData.events && eventData.events.length > 0 ? eventData.events[0] : null;
    const vote = voteData.vote ? voteData.vote : null;

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <div className="mb-8">
                <NavBar/>
                <EventDetail
                    event={event}
                    showMembers={true}
                />
            </div>
            {!vote || showForm ? (
                <EventForm
                    eventId={eventId}
                    createVote={createVote}
                    voteRefetch={voteRefetch}
                    eventRefetch={eventRefetch}
                    setShowForm={setShowForm}
                />
            ) : (
                <div className="max-w-sm mx-auto">
                    <p style={{fontSize: 20}}>Tvoja odpoveď: <strong>{vote.response ? 'prídem' : 'neprídem'}</strong>
                    </p>
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
            }
        </div>
    );
}
