import React, {useState} from "react";
import { useQuery, gql } from "@apollo/client";
import NavBar from "../components/navBar";
import EventForm from "../components/eventForm";
import MemberForm from "../components/memberForm";

const PLAYERS_QUERY = gql`
{
    players {
        id
        firstName
        lastName
        email
        __typename
    }
}
`;

const COACHES_QUERY = gql`
{
    coaches {
        id
        firstName
        lastName
        email
        __typename
    }
}
`;

const NOT_REGISTERED_QUERY = gql`
{
    notRegistered {
        id
        email
        role {
          description
        }
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

const GET_ROLE_TYPES = gql`
query getRoleTypes{
  roleTypes {
    id
    description
    __typename
  }
}
`;

export default function Members() {
    const { data: playersData, loading: playersLoading, error: playersError } = useQuery(PLAYERS_QUERY);
    const { data: coachesData, loading: coachesLoading, error: coachesError } = useQuery(COACHES_QUERY);
    const { data: notRegData, loading: notRegLoading, error: notRegError, refetch: notRegRefetch } = useQuery(NOT_REGISTERED_QUERY);
    const { data: roleData, loading: roleLoading, error: roleError } = useQuery(GET_ROLE);
    const [addMember, setAddMember] = useState(false);
    const { data: roleTypesData, loading: roleTypesLoading, error: roleTypesError } = useQuery(GET_ROLE_TYPES);


    if (playersLoading || coachesLoading || roleLoading || roleTypesLoading || notRegLoading) return "Loading...";
    if (playersError || coachesError || roleError || roleTypesError || notRegError) return <pre>{playersError.message || coachesError.message || roleError.message || roleTypesError.message || notRegError.message}</pre>

    const role = roleData.role ? roleData.role.description : null;
    const roleTypes = roleTypesData.roleTypes && roleTypesData.roleTypes.length > 0 ? roleTypesData.roleTypes : null;


    const toggleAddMember = () => {
        setAddMember(true);
    };

    return (
        <div>
            <NavBar/>
            <div className="max-w-sm mx-auto">
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Tréneri:</h2>
                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    {coachesData.coaches.map((coach) => (
                        <li key={coach.id} className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="/user.png"
                                         alt={`${coach.firstName} ${coach.lastName} image`}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {coach.firstName} {coach.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {coach.email}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        +421 999 999 999
                                    </p>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
                <br/>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm mx-auto">Hráči:</h2>
                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    {playersData.players.map((player) => (
                        <li key={player.id} className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="/user.png"
                                         alt={`${player.firstName} ${player.lastName} image`}/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {player.firstName} {player.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {player.email}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        +421 999 999 999
                                    </p>
                                </div>
                                <div
                                    className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    87
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <br/>
                {role === "tréner" && (
                    <div className="flex flex-col justify-center max-w-sm mx-auto">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white max-w-sm">Zatiaľ
                            neregistrovaní:</h2>
                        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                            {notRegData.notRegistered.map((notReg) => (
                                <li key={notReg.id} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className="flex-shrink-0">
                                            <img className="w-8 h-8 rounded-full" src="/user.png"/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {notReg.email}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {notReg.role.description}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <br/>
                    </div>
                )}
                {!addMember && role === "tréner" && (
                    <div className="flex justify-center max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={toggleAddMember}
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-blue-red dark:focus:ring-red-800"
                        >
                            Pridať neregistrovaného člena
                        </button>
                    </div>
                )}
                {addMember && (
                    <div className="flex justify-center max-w-sm mx-auto">
                        <MemberForm
                            roleTypes={roleTypes}
                            setShowForm={setAddMember}
                            notRegRefetch={notRegRefetch}
                        />
                    </div>
                )}
                <br/>
            </div>
        </div>
    );
}
