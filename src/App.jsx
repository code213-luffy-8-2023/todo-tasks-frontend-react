import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import List from "./pages/List";
import { useEffect } from "react";

const saveUserToStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const readUserFromStorage = () => {
  const str = localStorage.getItem("user");
  return JSON.parse(str);
};

const saveSessionToStorage = (session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

const readSessionFromStorage = () => {
  const str = localStorage.getItem("session");
  return JSON.parse(str);
};

function App() {
  const [user, setUser] = useState(readUserFromStorage() || null);
  const [session, setSession] = useState(readSessionFromStorage() || null);

  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  useEffect(() => {
    saveSessionToStorage(session);
  }, [session]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Signup
              user={user}
              session={session}
              setSession={setSession}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              user={user}
              session={session}
              setUser={setUser}
              setSession={setSession}
            />
          }
        />
        <Route
          path="/app"
          element={
            <List
              user={user}
              session={session}
              setUser={setUser}
              setSession={setSession}
            />
          }
        />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
