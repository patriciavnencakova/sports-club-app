import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import { useParams } from "react-router-dom";
import EventForm from "./components/vote_component";

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
    const [attendance, setAttendance] = useState(true);
    const [comment, setComment] = useState("");
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
        } catch (err) {
            console.error('Error creating vote:', err);
        }

        console.log('Form data:', variables);
    };

    return (
        <div>
            <div className="mb-8">
                <a
                    href="#"
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 max-w-sm mx-auto"
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {event.type.description}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Kedy? <b>{event.date}</b>
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Kde? <b>{event.location}</b>
                    </p>
                </a>
            </div>
            {vote ? (
                <div>
                    <h2>Vote Information:</h2>
                    <p>Response: {vote.response ? 'Yes' : 'No'}</p>
                    {vote.comment && <p>Comment: {vote.comment}</p>}
                </div>
            ) : (
                <EventForm
                    attendance={attendance}
                    handleAttendanceChange={handleAttendanceChange}
                    handleCommentChange={handleCommentChange}
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
