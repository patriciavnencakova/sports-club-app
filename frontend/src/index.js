import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Members from "./routes/members";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import Events from "./routes/events";
import Login from "./routes/login";
import Register from "./routes/register";
import {setContext} from "@apollo/client/link/context";
import Homepage from "./routes/homepage";
import {getJwtToken} from "./utils/auth";
import Event from "./routes/event";

const graphqlUri = process.env.REACT_APP_GRAPHQL_URI || "http://127.0.0.1:8000/graphql";

// Create an HTTP link
const httpLink = new HttpLink({
    uri: graphqlUri,
});

// Middleware to add the JWT token to the headers
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = getJwtToken()

    // Return the headers to the context
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : '', // Add the token to the headers if it exists
        }
    };
});

// Create a new Apollo Client with the combined link
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />,
    },
    {
        path: "login/",
        element: <Login />
    },
    {
        path: "register/",
        element: <Register />
    },
    {
        path: "members/",
        element: <Members />,
    },
    {
        path: "events/",
        element: <Events />,
    },
    {
        path: "events/:id",
        element: <Event />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </React.StrictMode>
);