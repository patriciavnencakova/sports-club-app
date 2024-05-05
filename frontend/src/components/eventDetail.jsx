import React from "react";
import { Link } from "react-router-dom";

export default function EventDetail({event, showMembers}) {
    return (
        <div>
            <Link
                to={`/events/${event.id}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 max-w-lg mx-auto"
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
                <br/>
                <div style={{display: 'flex', alignItems: 'stretch', justifyContent: 'center'}}>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/check.png" alt="Check" style={{width: '20px', height: 'auto'}}/>
                        <p>{event.coming.length}</p>
                        {showMembers && event.coming.map((member) => (
                            <div key={member.id}>
                                <p>{member.firstName} {member.lastName}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/question.png" alt="Question" style={{width: '20px', height: 'auto'}}/>
                        <p>{event.notResponded.length}</p>
                        {showMembers && event.notResponded.map((member) => (
                            <div key={member.id}>
                                <p>{member.firstName} {member.lastName}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <img src="/false.png" alt="X" style={{width: '20px', height: 'auto'}}/>
                        <p>{event.notComing.length}</p>
                        {showMembers && event.notComing.map((member) => (
                            <div key={member.id}>
                                <p>{member.firstName} {member.lastName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
}
