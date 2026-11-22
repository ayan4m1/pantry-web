import { Fragment } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';

import { listHouseholdsOptions } from '../../client/identity/@tanstack/react-query.gen';
import { Link } from 'react-router-dom';

export const Component = () => {
  const {
    data: households,
    isPending,
    error
  } = useQuery(listHouseholdsOptions());

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Couldn&apos;t load households ({error.status})</p>;

  return (
    <Fragment>
      <title>Pantry - Households</title>
      <Row>
        <Col md={10} xs={8}>
          <h1>Your households</h1>
        </Col>
        <Col md={2} xs={4}>
          <Link to="/households/create">
            <Button variant="outline-success">Add</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <ul>
          {households.map((h) => (
            <li key={h.id}>
              <Link to={`/households/${h.id}`}>{h.name}</Link>
            </li>
          ))}
        </ul>
      </Row>
    </Fragment>
  );
};
