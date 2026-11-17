import { Fragment, useEffect } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Link, Outlet } from 'react-router-dom';
import { Button, Card, Container, Nav, Navbar } from 'react-bootstrap';

import { routes } from '../routes';
import { setAuthHandlers } from '../utils/api';

// only titled routes get a nav entry - the index route is reachable via the brand
const navRoutes = routes.filter((route) => route.path && route.handle?.title);

export default function Layout() {
  const auth = useAuth();

  // assigned during render rather than in an effect: child effects run first,
  // so pages would otherwise fire their first queries without a token
  setAuthHandlers({
    getToken: () => auth.user?.access_token,
    renew: async () => {
      const renewed = await auth.signinSilent().catch(() => null);
      if (renewed) return renewed.access_token;

      await auth.signinRedirect();
      return null;
    }
  });

  useEffect(() => {
    // don't redirect while a callback is pending or after one failed - otherwise
    // a callback error immediately triggers another login and we loop forever
    if (
      !hasAuthParams() &&
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.error
    ) {
      // remember where the user was going, so you can send them back after login
      auth.signinRedirect({ state: { returnTo: window.location.pathname } });
    }
  }, [auth]);

  if (auth.error) {
    return (
      <Card body>
        <Card.Title>Sign-in failed</Card.Title>
        <Card.Text>{auth.error.message}</Card.Text>
        <Button onClick={() => auth.signinRedirect()}>Try again</Button>
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
              Pantry
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
