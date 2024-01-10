import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { ListNested, Bell } from "react-bootstrap-icons";
import { Nav } from "react-bootstrap";

import "../styles/NavbarLogged.css";

const NavbarLogged = ({ id, username }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <nav className="navbar navbar-expand-md bg-body py-3">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={require("../components/assets/img/julius-logo.png")}
            width="153"
            height="46"
          />
          <Button variant="" onClick={handleShow}>
            <ListNested />
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav>
                <NavLink to={`/dashboard/${id}`}>Dashboard</NavLink>
              </Nav>
              <Nav>
                <NavLink to={`/carteira/${id}`}>Carteira</NavLink>
              </Nav>
              <Nav>
                <NavLink to={`/investimentos/${id}`}>Investimentos</NavLink>
              </Nav>
              <Nav>
                <NavLink to={`/bancos/${id}`}>Bancos</NavLink>
              </Nav>
              <Nav>
                <NavLink to={`/configuracao/${id}`}>Configuração</NavLink>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </a>
      </div>
      <button
        data-bs-toggle="collapse"
        className="navbar-toggler"
        data-bs-target="#navcol-2"
      >
        <span className="visually-hidden">Toggle navigation</span>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="#navcol-2">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <div className="d-flex justify-content-center align-items-center notification-icon">
              <Bell className="bell" />
            </div>
          </li>
          <li className="nav-item">
            <img
              className="rounded user-icon"
              src={require("./assets/img/user-dafault-image.jpg")}
            />
          </li>
          <li className="nav-item">
            <h6 className="username">{username}</h6>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarLogged;
