import { Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { routes } from '../routes';

// only titled routes get a nav entry - the index route is reachable via the brand
const navRoutes = routes.filter((route) => route.path && route.handle?.title);

export default function Layout() {
  return (
    <Fragment>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand>
            <Nav.Link as={Link} to="/">
              pantry-web
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              {navRoutes.map((route) => (
                <Nav.Link as={Link} key={route.path} to={`/${route.path}`}>
                  {route.handle?.title}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="h-100">
        <Outlet />
      </Container>
    </Fragment>
  );
}
