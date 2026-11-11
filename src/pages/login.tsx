import { Fragment } from 'react';
import { useFormik } from 'formik';
import { Button, Card, Form } from 'react-bootstrap';

export const Component = () => {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: () => {
      // todo: submit login request and get token
    }
  });

  return (
    <Fragment>
      <title>Pantry - Login</title>
      <Card body>
        <Card.Title>Login</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="username">Username:</Form.Label>
            <Form.Control
              id="username"
              name="username"
              onChange={handleChange}
              type="text"
              value={values.username}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="password">Password:</Form.Label>
            <Form.Control
              id="password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
          </Form.Group>
          <Form.Group className="my-2">
            <Button type="submit">Submit</Button>
          </Form.Group>
        </Form>
      </Card>
    </Fragment>
  );
};
