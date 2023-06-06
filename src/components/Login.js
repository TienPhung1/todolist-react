import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLoginRedux } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);

  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email or Password is required");
      return;
    }

    dispatch(handleLoginRedux(email, password));

    // let res = await loginApi(email.trim(), password);
    // if (res && res.token) {
    //   loginContext(email, res.token);
    //   navigate("/users");
    // } else {
    //   if (res && res.status === 400) {
    //     //error
    //     toast.error(res.data.error);
    //   }
    // }
  };

  const handleBack = () => {
    navigate("/users");
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    if (account && account.auth === true) {
      navigate("/users");
    }
  }, [account]);

  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Login</div>
      <div className="text">Email or username ( eve.holt@reqres.in )</div>
      <input
        type="text"
        placeholder="Email or username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="input-2">
        <input
          type={isShowPassword === true ? "text" : "password"}
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(event) => handlePressEnter(event)}
        />
        <i
          className={
            isShowPassword === true
              ? "fa-regular fa-eye"
              : "fa-regular fa-eye-slash"
          }
          onClick={() => setIsShowPassword(!isShowPassword)}
        ></i>
      </div>
      <button
        className={email && password ? "active" : ""}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {isLoading && <i className="fas fa-spinner fa-spin"></i>}
        &nbsp;Login
      </button>
      <div className="back">
        <span onClick={() => handleBack()}>Go back</span>
      </div>
    </div>
  );
};

export default Login;
