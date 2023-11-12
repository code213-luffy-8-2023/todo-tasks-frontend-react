import { useReducer } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "male",
  dateOfBirth: "",
};

const reducer = (state, action) => {
  state[action.type] = action.payload;
  return { ...state };
};

function Signup({ user, session, setUser, setSession }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  if (user || session) {
    return <Navigate to="/app" />;
  }

  return (
    <div>
      <h1>Signup</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (state.password !== state.confirmPassword) {
            toast.error("Password and Confirm Password Not match");
            return;
          }

          if (
            !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
              state.password
            )
          ) {
            toast.error("password > 8 and has 1 special char");
          }

          const reqData = {
            ...state,
          };
          delete reqData.confirmPassword;

          const res = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reqData),
          });

          if (res.ok) {
            // signup succesfull
            /**
             * @type {
             *    user: {
             *    id: String,
             *   firstName: String,
             *  lastName: String,
             * email: String,
             * gender: String,
             * },
             * session: {
             *  token: string,
             * exp: string
             * }
             * }
             */
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
          value={state.firstName}
          onChange={(e) => {
            dispatch({ type: "firstName", payload: e.target.value });
          }}
          type="text"
          placeholder="Enter First Name"
        />
        <input type="text" placeholder="Enter Last Name" />
        <select
          onChange={(e) =>
            dispatch({
              type: "gender",
              payload: e.target.value,
            })
          }
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          value={state.dateOfBirth}
          onChange={(e) => {
            dispatch({ type: "dateOfBirth", payload: e.target.value });
          }}
          type="date"
          placeholder="Enter Date of Birth"
        />
        <input
          required
          value={state.email}
          onChange={(e) => {
            dispatch({ type: "email", payload: e.target.value });
          }}
          type="email"
          placeholder="Enter Email"
        />
        <div
          style={{
            display: "flex",
          }}
        >
          <input
            minLength={8}
            required
            value={state.password}
            onChange={(e) => {
              dispatch({ type: "password", payload: e.target.value });
            }}
            type={"password"}
            placeholder="Enter Password"
          />{" "}
        </div>
        <input
          minLength={8}
          required
          value={state.confirmPassword}
          onChange={(e) => {
            dispatch({ type: "confirmPassword", payload: e.target.value });
          }}
          type="password"
          placeholder="Confirm Password"
        />
        <button type="submit">Signup</button>
      </form>
      Already have an account? <Link to={"/login"}>Login</Link>
    </div>
  );
}

Signup.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  setUser: PropTypes.func,
  setSession: PropTypes.func,
};

export default Signup;
