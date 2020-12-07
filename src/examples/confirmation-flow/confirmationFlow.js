import React from "react";
import Modal from "react-modal";
import { useBrainMachine } from "../../useBrainMachine";

const fakeService = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Oh no!");
    }, 2000);
  });
};

const ConfirmationFlow = () => {
  const { state, data, send } = useBrainMachine({
    id: "confirmationFlow",
    initial: "idle",
    data: {
      error: null,
    },
    states: {
      idle: {
        on: {
          begin: { target: "confirming" },
        },
      },
      confirming: {
        on: {
          confirm: { target: "loading" },
          cancel: { target: "idle" },
        },
      },
      loading: {
        service: {
          id: "confirmService",
          src: fakeService,
          onDone: {
            target: "idle",
          },
          onError: {
            target: "confirming",
            actions: ({ response, setData }) => {
              setData(() => ({
                error: response,
              }));
            },
          },
        },
      },
    },
  });

  const isLoading = state === "loading";
  const isModalOpen = state === "confirming" || state === "loading";

  return (
    <section>
      <h1>Modal Confirmation Flow</h1>
      <hr />

      <a
        href="https://xstate.js.org/viz/?gist=5e58b8951a1b6e41ea92ca7b74f23218"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visualize the machine
      </a>

      <p>
        Current State: <strong>{state.toUpperCase()}</strong>
      </p>

      <button type="button" onClick={() => send({ type: "begin" })}>
        Destroy!
      </button>

      <Modal
        onRequestClose={() => send({ type: "cancel" })}
        isOpen={isModalOpen}
      >
        <h2>Are you sure?</h2>
        {data.error && <p>Error: {data.error}</p>}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => send({ type: "cancel" })}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => send({ type: "confirm" })}
        >
          Yes Definitely
        </button>
      </Modal>
    </section>
  );
};

export default ConfirmationFlow;
