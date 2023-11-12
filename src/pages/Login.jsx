import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ user, session, setSession, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user || session) {
    return <Navigate to="/app" />;
  }
  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setSession(data.session);
          } else {
            const data = await res.json();
            toast.error(data.message || "Something went wrong");
          }
        }}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter Password"
        />
        <button type="submit">Login</button>
      </form>
      Don't have an account yet? <Link to={"/"}>Signup</Link>
    </div>
  );
};

Login.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  setSession: PropTypes.func,
  setUser: PropTypes.func,
};

export default Login;
