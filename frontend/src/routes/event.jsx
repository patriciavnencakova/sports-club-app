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
    }
  }
`;

const VOTE_BY_EVENT_ID = gql`
query voteByEventId($id: Int!){
  vote(id: $id) {
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

    const { data: eventData, loading: eventLoading, error: eventError } = useQuery(EVENT_BY_ID, {
        variables: { id: parseInt(eventId) }
    });

    const { data: voteData, loading: voteLoading, error: voteError, refetch: voteRefetch } = useQuery(VOTE_BY_EVENT_ID, {
        variables: { id: parseInt(eventId) }
    });

    if (eventLoading || voteLoading) return "Loading...";
    if (eventError || voteError) return <pre>{eventError.message || voteError.message}</pre>;

    const event = eventData.events[0];
    const vote = voteData.vote && voteData.vote.length > 0 ? voteData.vote[0] : null;

    return (
        <div>
            <div className="mb-8">
                <NavBar />
                <EventDetail
                    event={event}
                />
            </div>
            {vote ? (
                <div className="max-w-sm mx-auto">
                    <h2>Vote Information:</h2>
                    <p>Response: {vote.response ? 'Yes' : 'No'}</p>
                    {vote.comment && <p>Comment: {vote.comment}</p>}
                </div>
            ) : (
                <EventForm
                    eventId={eventId}
                    createVote={createVote}
                    voteRefetch={voteRefetch}
                />
            )}
        </div>
    );
}
