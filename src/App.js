import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { ConfirmationFlow, FetchUsers } from "./examples/";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>🧠 useBrainMachine</h1>
      <p>
        A custom hook that emulates the{" "}
        <a
          href="https://github.com/davidkpiano/xstate"
          target="_blank"
          rel="noreferrer"
        >
          XState
        </a>{" "}
        API to create a very simple state machine in react
      </p>

      <h3>Examples:</h3>
      <ul>
        <li>
          <Link to="/fetch-users">Fetch users</Link>
        </li>
        <li>
          <Link to="/confirmation-flow">Confirmation flow</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path="/fetch-users">
          <FetchUsers />
        </Route>
        <Route exact path="/confirmation-flow">
          <ConfirmationFlow />
        </Route>
      </Switch>
    </div>
  );
}
