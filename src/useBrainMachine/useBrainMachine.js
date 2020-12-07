import { useState, useEffect, useRef } from "react";

const useBrainMachine = (config) => {
  const [state, setState] = useState(config.initial);
  const [data, setData] = useState(config.data);

  const prevState = useRef(state);

  const handleSend = (event) => {
    const currentStateNode = config.states[state];
    if (!currentStateNode) return;

    const stateNodeEvent =
      currentStateNode &&
      currentStateNode.on &&
      currentStateNode.on[event.type];
    if (!stateNodeEvent) return;

    const nextState = stateNodeEvent.target;
    setState(nextState);
  };

  useEffect(() => {
    const service = config.states[machine.state].service;

    if (service) {
      const handleService = async (state) => {
        const callState = state;
        try {
          if (service.src) {
            const data = await service.src();

            if (prevState.current === callState) {
              const nextState = service.onDone && service.onDone.target;
              if (nextState) setState(nextState);

              service.onDone &&
                service.onDone.actions &&
                service.onDone.actions({
                  response: data,
                  data: machine.data,
                  setData,
                });
            }
          }
        } catch (error) {
          const nextState = service.onError && service.onError.target;
          if (nextState) setState(nextState);

          service.onError &&
            service.onError.actions &&
            service.onError.actions({
              response: error,
              data: machine.data,
              setData,
            });
        }
      };

      handleService(state);
    }

    prevState.current = state;
  }, [state]);

  const machine = {
    state,
    data,
    send: handleSend,
  };

  return machine;
};

export default useBrainMachine;
