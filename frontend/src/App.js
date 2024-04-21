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

export default function App() {
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

// function MyButton() {
//   return (
//       <button>
//         I'm a button
//       </button>
//   );
// }
//
// export default function MyApp() {
//   return (
//       <div>
//         <h1>Welcome to my app</h1>
//         <MyButton />
//       </div>
//   );
// }

// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
