import { Fragment, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Link, Outlet } from 'react-router-dom';
import { Card, Container, Nav, Navbar } from 'react-bootstrap';

import { routes } from '../routes';

// only titled routes get a nav entry - the index route is reachable via the brand
const navRoutes = routes.filter((route) => route.path && route.handle?.title);

export default function Layout() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator) {
      // Remember where the user was going, so you can send them back after login
      auth.signinRedirect({ state: { returnTo: window.location.pathname } });
    }
  }, [auth]);

  if (auth.error) {
    return (
      <Card body>
        <Card.Title>Sign-in failed</Card.Title>
        {auth.error.message}
      </Card>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <Card body>
        <Card.Title>Redirecting...</Card.Title>Redirecting to sign in…
      </Card>
    );
  }

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
                  {route.handle.title}
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
