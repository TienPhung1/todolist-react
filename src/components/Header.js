import React, { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  useEffect(() => {
    if (user && user.auth === false && window.location.pathname !== "/login") {
      navigate("/login");
      toast.success("Log Out Success");
    }
  }, [user]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand to="/">Todo-List</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <>
              <Nav className="me-auto">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
                <NavLink to="/users" className="nav-link">
                  Manage User
                </NavLink>
              </Nav>

              <Nav>
                {user && user.email && (
                  <span className="nav-link">Welcome to {user.email} </span>
                )}
                <NavDropdown title="Setting" id="basic-nav-dropdown">
                  {user && user.auth === true ? (
                    <NavDropdown.Item onClick={() => handleLogout()}>
                      LogOut
                    </NavDropdown.Item>
                  ) : (
                    <NavLink to="/login" className="dropdown-item">
                      Login
                    </NavLink>
                  )}
                </NavDropdown>
              </Nav>
            </>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
