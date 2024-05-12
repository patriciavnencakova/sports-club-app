import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
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

const GET_ROLE = gql`
query getRole{
  role {
    id
    description
    __typename
  }
}
`;

const GET_FEE = gql`
query getFee($id: Int!) {
  fee(id: $id) {
    id
    hasPaid
    date
    __typename
  }
}
`;

const UPDATE_FEE = gql`
  mutation fee($memberId: ID!, $hasPaid: Boolean!) {
    fee(memberId: $memberId, hasPaid: $hasPaid) {
    fee {
      hasPaid
        member {
          firstName
          lastName
          email
        }
      }
    }
  }
`;

export default function Member() {
    const {id: memberId} = useParams();
    const [updateFee] = useMutation(UPDATE_FEE);
    const {data: loggedData, loading: loggedLoading, error: loggedError} = useQuery(MEMBER_BY_ID, {
        variables: {id: parseInt(memberId)}
    });
    const {data: roleData, loading: roleLoading, error: roleError} = useQuery(GET_ROLE_BY_ID, {
        variables: {id: parseInt(memberId)}
    });
    const {data: roleLogData, loading: roleLogLoading, error: roleLogError} = useQuery(GET_ROLE);
    const {data: feeData, loading: feeLoading, error: feeError, refetch:feeRefetch} = useQuery(GET_FEE, {
        variables: {id: parseInt(memberId)}
    });

    const [showFee, setShowFee] = useState(false);
    const [paid, setPaid] = useState(true);

    useEffect(() => {
        if (feeData && feeData.fee) {
            setPaid(feeData.fee.hasPaid);
        }
    }, [feeData]);

    if (loggedLoading || roleLoading || feeLoading || roleLogLoading) return "Loading...";
    if (loggedError || roleError || feeError || roleLogError)
        return <pre>{loggedError.message} || {roleError.message} || {feeError.message} || {roleLogError.message}</pre>;

    const user = loggedData.member ? loggedData.member : null;
    const roleId = roleData.role ? roleData.role.description : null;
    const roleLog = roleLogData.role ? roleLogData.role.description : null;
    const fee = feeData.fee ? feeData.fee : null;

    const handlePaidChange = (e) => {
        const value = e.target.value === '1';
        setPaid(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const variables = {
            memberId: parseInt(memberId),
            hasPaid: paid,
        };
        try {
            await updateFee({variables});
            setShowFee(false);
            await feeRefetch();
        } catch (err) {
            console.error('Error updating: ', err);
        }
    }

    return (
        <div>
            <NavBar/>
            <div className="mb-8">
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
                        Rola: <b>{roleId}</b>
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Dátum narodenia: <b>{formatDate(user.birth)}</b>
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        E-mail: <b>{user.email}</b>
                    </p>
                    {roleId === 'hráč' && (
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
            {!showFee && roleLog === 'tréner' && roleId === 'hráč' && (
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                        onClick={() => setShowFee(true)}
                    >
                        Zmeniť poplatok
                    </button>
                    <button
                        type="submit"
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                        // onClick={() => setShowCancel(true)}
                    >
                        Odstrániť hráča
                    </button>
                </div>
            )
            }
            {showFee && (
                <div className="flex justify-center">
                    <form>
                        <div className="mb-8">
                            <div className="flex items-center mb-4 max-w-sm mx-auto">
                                <input
                                    id="paid"
                                    type="radio"
                                    name="paid"
                                    value="1"
                                    checked={paid === true}
                                    onChange={handlePaidChange}
                                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="paid"
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    zaplatené
                                </label>
                            </div>
                            <div className="flex items-center mb-4 max-w-sm mx-auto">
                                <input
                                    id="unpaid"
                                    type="radio"
                                    name="paid"
                                    value="0"
                                    checked={paid === false}
                                    onChange={handlePaidChange}
                                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="unpaid"
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    nezaplatené
                                </label>
                            </div>
                            <div className="max-w-sm mx-auto">
                                <button
                                    type="submit"
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                                    onClick={handleSubmit}
                                >
                                    Zmeniť
                                </button>
                                <button
                                    type="button"
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                                    onClick={() => setShowFee(false)}
                                >
                                    Zrušiť
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
