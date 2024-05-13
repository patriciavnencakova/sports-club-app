import React, {useEffect, useState} from "react";
import {useQuery, gql, useMutation} from "@apollo/client";
import {Link, useParams, useNavigate} from "react-router-dom";
import NavBar from "../components/navBar";
import EventDetail from "../components/eventDetail";

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

const DELETE_MEMBER = gql`
mutation deleteM($memberId: ID!) {
  deleteM(memberId: $memberId) {
    member {
      firstName
      lastName
      email
    }
  }
}
`;

const COMING = gql`
query coming($id: Int!) {
  coming(id: $id) {
    id
    location
    date
    type {
      description
    }
  }
}
`;

const NOT_COMING = gql`
query notComing($id: Int!) {
  notComing(id: $id) {
    id
    location
    date
    type {
      description
    }
  }
}
`;

const NOT_RESPONDED = gql`
query notResponded($id: Int!) {
  notResponded(id: $id) {
    id
    location
    date
    type {
      description
    }
  }
}
`;

export default function Member() {
    const {id: memberId} = useParams();
    let navigate = useNavigate();
    const [updateFee] = useMutation(UPDATE_FEE);
    const [deleteMember] = useMutation(DELETE_MEMBER, {
        onCompleted: () => {
            navigate(`/members/`);
        }
    });
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
    const {data: comingData, loading: comingLoading, error: comingError, refetch:comingRefetch} = useQuery(COMING, {
        variables: {id: parseInt(memberId)}
    });

    const {data: notComingData, loading: notComingLoading, error: notComingError, refetch:notComingRefetch} = useQuery(NOT_COMING, {
        variables: {id: parseInt(memberId)}
    });

    const {data: notRespondedData, loading: notRespondedLoading, error: notRespondedError, refetch:notRespondedRefetch} = useQuery(NOT_RESPONDED, {
        variables: {id: parseInt(memberId)}
    });

    const [showFee, setShowFee] = useState(false);
    const [paid, setPaid] = useState(true);

    useEffect(() => {
        if (feeData && feeData.fee) {
            setPaid(feeData.fee.hasPaid);
        }
    }, [feeData]);

    useEffect(() => {
        if (comingData && comingData.coming) {
            comingRefetch();
        }
    }, [comingData]);

    useEffect(() => {
        if (notComingData && notComingData.notComing) {
            notComingRefetch();
        }
    }, [notComingData]);

    useEffect(() => {
        if (notRespondedData && notRespondedData.notResponded) {
            notRespondedRefetch();
        }
    }, [notRespondedData]);

    if (notRespondedLoading || notComingLoading || comingLoading || loggedLoading || roleLoading || feeLoading || roleLogLoading) return "Loading...";
    if (notRespondedError || notComingError || comingError || loggedError || roleError || feeError || roleLogError)
        return <pre>{notRespondedError.message} || {notComingError.message} || {comingError.message} || {loggedError.message} || {roleError.message} || {feeError.message} || {roleLogError.message}</pre>;

    const user = loggedData.member ? loggedData.member : null;
    const roleId = roleData.role ? roleData.role.description : null;
    const roleLog = roleLogData.role ? roleLogData.role.description : null;
    const fee = feeData.fee ? feeData.fee : null;
    const coming = comingData.coming && comingData.coming.length > 0 ? comingData.coming : [];
    const notComing = notComingData.notComing && notComingData.notComing.length > 0 ? notComingData.notComing : [];
    const notResponded = notRespondedData.notResponded && notRespondedData.notResponded.length > 0 ? notRespondedData.notResponded : [];

    const handlePaidChange = (e) => {
        const value = e.target.value === '1';
        setPaid(value);
    };

    const handleSubmitChange = async (e) => {
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

    const handleSubmitDelete = async (e) => {
        e.preventDefault();
        const variables = {
            memberId: parseInt(memberId),
        };
        try {
            await deleteMember({variables});
        } catch (err) {
            console.error('Error while deletion: ', err);
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
                <div className="flex justify-center" style={{ marginBottom: "30px" }}>
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
                        onClick={handleSubmitDelete}
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
                                    onClick={handleSubmitChange}
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
            {roleId === 'hráč' && (
            <div className="mb-8 max-w-4xl mx-auto">
                <div style={{display: 'flex', alignItems: 'stretch', justifyContent: 'center'}}>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/check.png" alt="Check" style={{width: '20px', height: 'auto'}}/>
                        <p>{coming.length}</p>
                        <ul className="list-disc">
                            {coming.map((event) => (
                                <div key={event.id}>
                                    <li>{event.type.description} ({event.location}, {formatDate(event.date)})</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/false.png" alt="X" style={{width: '20px', height: 'auto'}}/>
                        <p>{notComing.length}</p>
                        <br/>
                        <ul className="list-disc">
                            {notComing.map((event) => (
                                <div key={event.id}>
                                    <li>{event.type.description} ({event.location}, {formatDate(event.date)})</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/question.png" alt="Question" style={{width: '20px', height: 'auto'}}/>
                        <p>{notResponded.length}</p>
                        <br/>
                        <ul className="list-disc">
                            {notResponded.map((event) => (
                                <div key={event.id}>
                                    <li>{event.type.description} ({event.location}, {formatDate(event.date)})</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
