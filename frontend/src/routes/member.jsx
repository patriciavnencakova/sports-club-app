import React from "react";
import {useQuery, gql} from "@apollo/client";
import {Link, useParams} from "react-router-dom";
import NavBar from "../components/navBar";

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

const MEMBER_BY_ID = gql`
  query memberById($id: Int!) {
    member(id: $id) {
      id
      firstName
      lastName
      email
      birth
      team {
        name
      }
    }
  }
`;

const GET_ROLE_BY_ID = gql`
query getRole($id: Int){
  role(id: $id) {
    id
    description
    __typename
  }
}
`;

const GET_FEE = gql`
query getFee{
  fee {
    id
    hasPaid
    date
    __typename
  }
}
`;


export default function Member() {
    const {id: memberId} = useParams();
    const {data: loggedData, loading: loggedLoading, error: loggedError} = useQuery(MEMBER_BY_ID, {
        variables: {id: parseInt(memberId)}
    });
    const {data: roleData, loading: roleLoading, error: roleError} = useQuery(GET_ROLE_BY_ID, {
        variables: {id: parseInt(memberId)}
    });
    const {data: feeData, loading: feeLoading, error: feeError} = useQuery(GET_FEE);

    if (loggedLoading || roleLoading || feeLoading) return "Loading...";
    if (loggedError || roleError || feeError) return <pre>{loggedError.message}</pre>;

    const user = loggedData.member ? loggedData.member : null;
    const role = roleData.role ? roleData.role.description : null;
    const fee = feeData.fee ? feeData.fee : null;

    return (
        <div className="mb-8">
            <NavBar/>
            <Link
                to={`/members/${user.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 max-w-lg mx-auto"
            >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Tím: <b>{user.team.name}</b>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Rola: <b>{role}</b>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Dátum narodenia: <b>{formatDate(user.birth)}</b>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    E-mail: <b>{user.email}</b>
                </p>
                {role === 'hráč' && (
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Stav registračného poplatku:
                        <b style={{color: fee.hasPaid ? 'green' : 'red'}}>
                            {fee.hasPaid ? ' zaplatené' : ' nezaplatené (50€)'}
                        </b>
                        {fee.hasPaid && (
                            <span className="ml-2 text-gray-600 dark:text-gray-300">
                                ({formatDate(fee.date)})
                            </span>
                        )}
                    </p>
                )}
            </Link>
        </div>
    );
}
