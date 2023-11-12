import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

const getAllTasks = async (sessionToken) => {
  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "GET",
    headers: {
      "session-token": sessionToken,
    },
  });

  if (res.ok) {
    const data = await res.json();
    return data.tasks;
  } else {
    const data = await res.json();

    throw new Error(data.message);
  }
};

const List = ({ user, session, setUser, setSession }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks(session.token)
      .then((tasks) => {
        setTasks(tasks);
      })
      .catch((err) => {
        if (err.message == "Unauthorized") {
          // means that the session token is invalid
          setUser(null);
          setSession(null);
        }
      });

    return () => {};
    // dependency array
    // any state variable that is used inside the effect
    // should be added to the dependency array
  }, [setUser, setSession, setTasks, session.token]);

  // this could be extracted to a gard component
  // once we move the user and session to a redux store/react context
  if (!user || !session) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        List Page
      </h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await fetch("http://localhost:3000/api/tasks", {
            method: "POST",
            headers: {
              "session-token": session.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              deadline,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const task = data.task;
            setTasks([...tasks, task]);
            toast.success("task created!");
          } else {
            const data = await res.json();

            if (data.message == "Unauthorized") {
              // means that the session token is invalid
              setUser(null);
              setSession(null);
            }
          }
        }}
        style={{
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <label htmlFor="task">Task Title*</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="task"
          type="text"
          placeholder="Task title"
        />
        <label htmlFor="deadline">Deadline</label>
        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          type="datetime-local"
          placeholder="Dead line"
          id="deadline"
        />
        <button>Create task</button>
      </form>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        {tasks.map((t, i) => {
          return (
            <div
              key={t.id}
              style={{
                padding: "12px",
                border: "1px solid #333",
                marginBottom: "6px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <input
                  onChange={() => {
                    const newTasks = [...tasks];
                    newTasks[i].isCompleted = !newTasks[i].isCompleted;
                    setTasks(newTasks);

                    // TODO: update task on server
                  }}
                  type="checkbox"
                  checked={t.isCompleted || false}
                />
                {t.title}
              </div>
              {t.deadline && (
                <p>
                  {new Date(t.deadline).toLocaleDateString() +
                    " " +
                    new Date(t.deadline).toLocaleTimeString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

List.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  setUser: PropTypes.func,
  setSession: PropTypes.func,
};

export default List;
