import React from "react";
import { useQuery, gql } from "@apollo/client";

const MEMBERS_QUERY = gql`
{
    members {
        id
        isActive
        name
        surname
        __typename
    }
}
`;

export default function Members() {
    const { data, loading, error } = useQuery(MEMBERS_QUERY);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    return (
        <div>
            <h1>Members</h1>
            <ul>
                {data.members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                ))}
            </ul>
        </div>
    );
}
