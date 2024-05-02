import React from "react";
import {useNavigate} from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();

    const handleHomePage = async (e) => {
        e.preventDefault();
        navigate("/events/");
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("refreshToken");
        navigate("/");
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li>
                        <a href="#"
                           onClick={handleHomePage}
                           className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Events</a>
                    </li>
                    <li>
                        <a href="#"
                           onClick={handleLogout}
                           className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Odhlásiť
                            sa</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
