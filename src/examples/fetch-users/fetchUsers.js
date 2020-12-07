import React from "react";
import { useBrainMachine } from "../../useBrainMachine";

const fetchService = () => {
  return new Promise((resolve) => {
    const data = [
      { id: 1, name: "Mikel" },
      { id: 2, name: "Asier" },
      { id: 3, name: "Carlos" },
    ];
    setTimeout(() => resolve(data), 3000);
  });
};

const FetchUsers = () => {
  const { state, data, send } = useBrainMachine({
    initial: "idle",
    data: {
      users: [],
      error: "",
    },
    states: {
      idle: {
        on: {
          FETCH: { target: "loading" },
        },
      },
      loading: {
        service: {
          id: "fetch",
          src: fetchService,
          onDone: {
            target: "success",
            actions: ({ response, setData }) => {
              setData((prevData) => ({
                ...prevData,
                users: response,
              }));
            },
          },
          onError: {
            target: "error",
            actions: ({ response, setData }) => {
              setData((prevData) => ({
                ...prevData,
                error: response,
              }));
            },
          },
        },
        on: {
          CANCEL: { target: "idle" },
        },
      },
      success: {
        on: {
          RESET: {
            target: "idle",
            actions: ({ setData }) => {
              setData({
                name: "",
                error: "",
              });
            },
          },
          FETCH: {
            target: "loading",
          },
        },
      },
      error: {},
    },
  });

  const { users, error } = data;

  return (
    <section>
      <h1>Fetch users</h1>
      <hr />
      <a
        href=" https://xstate.js.org/viz/?gist=98aa7a9d1d4bebc935033f85bc3b3992"
        target="_blank"
        rel="noreferrer"
      >
        Visualize the state machine
      </a>
      <p>
        Current State: <strong>{state.toUpperCase()}</strong>
      </p>

      {state === "loading" && <p>Loading data...</p>}
      {state === "error" && <p>{error}</p>}
      {state === "success" && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}

      <button type="button" onClick={() => send({ type: "FETCH" })}>
        Fetch Users
      </button>
      <button type="button" onClick={() => send({ type: "CANCEL" })}>
        Cancel
      </button>
      <button type="button" onClick={() => send({ type: "RESET" })}>
        Reset
      </button>
    </section>
  );
};

export default FetchUsers;
