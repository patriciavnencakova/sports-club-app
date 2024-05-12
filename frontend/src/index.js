import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Members from "./routes/members";
import {ApolloClient, ApolloProvider, from, gql, HttpLink, InMemoryCache, Observable} from "@apollo/client";
import Events from "./routes/events";
import Login from "./routes/login";
import Register from "./routes/register";
import {setContext} from "@apollo/client/link/context";
import Homepage from "./routes/homepage";
import {getJwtToken, getRefreshToken, setJwtToken, setRefreshToken} from "./utils/auth";
import Event from "./routes/event";
import {onError} from "@apollo/client/link/error";
import Member from "./routes/member";

const graphqlUri = process.env.REACT_APP_GRAPHQL_URI || "http://127.0.0.1:8000/graphql";

// Create an HTTP link
const httpLink = new HttpLink({
    uri: graphqlUri,
});

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      refreshExpiresIn
      errors
      payload
    }
  }
`;

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

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.extensions && err.extensions.code === 'unauthenticated') {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    // Refresh the access token using the refresh token
                    return new Observable((observer) => {
                        client.mutate({
                            mutation: REFRESH_TOKEN_MUTATION,
                            variables: { refreshToken },
                        }).then(({ data }) => {
                            const newAccessToken = data.refreshToken.token;
                            const newRefreshToken = data.refreshToken.refreshToken;
                            setJwtToken(newAccessToken);
                            setRefreshToken(newRefreshToken);
                            const oldHeaders = operation.getContext().headers;
                            operation.setContext({
                                headers: {
                                    ...oldHeaders,
                                    authorization: `JWT ${newAccessToken}`,
                                },
                            });
                            const subscriber = {
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer),
                            };
                            forward(operation).subscribe(subscriber);
                        }).catch((error) => {
                            console.error('Error refreshing access token:', error);
                            observer.error(error);
                        });
                    });
                } else {
                    console.log("UWAGA UWAGAAAAA!", graphQLErrors, refreshToken);
                }
            }
        }
    }
});

// Create a new Apollo Client with the combined link
const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache()
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />,
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },
    {
        path: "members",
        element: <Members />,
    },
    {
        path: "members/:id",
        element: <Member />,
    },
    {
        path: "events",
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