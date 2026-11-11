import { Button, Card, Form } from 'react-bootstrap';

export const Component = () => {
  return (
    <Card body>
      <Card.Title>Login</Card.Title>
      <Form>
        <Form.Group>
          <Form.Label htmlFor="username">Username:</Form.Label>
          <Form.Control id="username" name="username" type="text" />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password:</Form.Label>
          <Form.Control id="password" name="password" type="password" />
        </Form.Group>
        <Form.Group className="my-2">
          <Button>Submit</Button>
        </Form.Group>
      </Form>
    </Card>
  );
};
