import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listReviews } from '../actions/userActions';
import {
  USER_UPDATE_PROFILE_RESET,
  USER_LIST_REVIEWS_RESET,
} from '../constants/userConstants';

const ProfileScreen = ({ history, match }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error: updateError } = userUpdateProfile;

  const userReviews = useSelector((state) => state.userReviews);
  const { loading: reviewsLoading, error: reviewError, reviews } = userReviews;
  useEffect(() => {
    //todo

    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || success || user.email !== match.params.email) {
        console.log(user, 'execute?', match.params.email);
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch({ type: USER_LIST_REVIEWS_RESET });
        dispatch(getUserDetails(match.params.email));
        dispatch(listReviews(match.params.email));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, success, match]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      setMessage('');
    }
  };

  return (
    <Row>
      {/* <Meta title={`${name}'s profile`} /> */}
      <Col md={3}>
        <h2>User Profile</h2>
        {userInfo && userInfo.email === match.params.email && (
          <>
            {message && <Message variant="danger">{message}</Message>}
            {updateError && <Message variant="danger">{updateError}</Message>}
            {success && <Message variant="success">Profile Updated</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    disabled={true}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">
                  Update
                </Button>
              </Form>
            )}
          </>
        )}

        {(!userInfo || userInfo.email !== match.params.email) && (
          <ListGroup variant="flush">
            <ListGroup.Item variant="secondary">NAME:</ListGroup.Item>
            <ListGroup.Item variant="dark">{name}</ListGroup.Item>
            <ListGroup.Item variant="secondary">EMAIL:</ListGroup.Item>
            <ListGroup.Item variant="dark">{email}</ListGroup.Item>
          </ListGroup>
        )}
      </Col>

      <Col md={9}>
        <h2>Personal Rating & Received Reviews</h2>

        {reviewsLoading ? (
          <Loader />
        ) : reviewError ? (
          <Message variant="danger">{reviewError}</Message>
        ) : (
          <>
            Personal Rating :
            <Rating
              value={
                reviews.reduce((acc, item) => item.review.rating + acc, 0) /
                reviews.length
              }
            />
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>BOOK</th>
                  <th>DATE</th>
                  <th>REVIEW</th>
                  <th style={{ width: 130 + 'px' }}>RATING</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderItem.name}</td>
                    <td>{order.review.createdAt.substring(0, 10)}</td>
                    <td>{order.review.comment}</td>
                    <td>
                      <Rating value={order.review.rating} />
                    </td>
                    <td>
                      <LinkContainer to={`/product/${order.orderItem.product}`}>
                        <Button className="btn-sm" variant="dark">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
