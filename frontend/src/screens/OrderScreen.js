import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  completeOrder,
  arrangeOrder,
  createOrderReview,
} from '../actions/orderActions';
import {
  ORDER_ARRANGE_RESET,
  ORDER_COMPLETE_RESET,
  ORDER_CREATE_REVIEW_RESET,
} from '../constants/orderConstants';

// format ISO date to readable format
function formDate(dateForm) {
  if (dateForm === '') {
    return '';
  } else {
    var dateee = new Date(dateForm).toJSON();
    var date = new Date(+new Date(dateee))
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '');
    return date;
  }
}

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const orderComplete = useSelector((state) => state.orderComplete);
  const { loading: loadingComplete, success: successComplete } = orderComplete;

  const orderArrange = useSelector((state) => state.orderArrange);
  const { loading: loadingArrange, success: successArrange } = orderArrange;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderReviewCreate = useSelector((state) => state.orderReviewCreate);
  const {
    success: successOrderReview,
    loading: loadingOrderReview,
    error: errorProductReview,
  } = orderReviewCreate;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (
      !order ||
      successComplete ||
      successArrange ||
      order._id !== orderId ||
      successOrderReview
    ) {
      dispatch(getOrderDetails(orderId));
      dispatch({ type: ORDER_ARRANGE_RESET });
      dispatch({ type: ORDER_COMPLETE_RESET });
      dispatch({ type: ORDER_CREATE_REVIEW_RESET });
    } else if (
      //if the current is neither seller or buyer, redirect to homepage
      userInfo.email !== order.seller &&
      userInfo.email !== order.buyer &&
      !userInfo.isAdmin
    ) {
      history.replace('/');
    }
  }, [
    dispatch,
    orderId,
    successArrange,
    successComplete,
    order,
    match,
    successOrderReview,
  ]);

  const arrangeHandler = () => {
    dispatch(arrangeOrder(order));
  };
  const completeHandler = () => {
    dispatch(completeOrder(order));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createOrderReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>EXPECTED EXCHANGE ADDRESS&TIME</h2>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}{' '}
                {order.shippingAddress.postalCode},{' '}
              </p>
              <p>
                <strong>Time&Date:</strong>
                {order.shippingAddress.dateTime}{' '}
              </p>
              {!order.isExpired ? (
                order.isArranged ? (
                  order.isCompleted ? (
                    <Message variant="success">
                      Book has been exchanged, order is completed!
                    </Message>
                  ) : (
                    <Message variant="success">
                      Order is arranged, waitting for exchange!
                    </Message>
                  )
                ) : (
                  <Message variant="warning">
                    Waitting for Arrangement;
                    <p>
                      If the order is not arranged before{' '}
                      {formDate(order.expiredAt)}, the order will expire.
                    </p>
                  </Message>
                )
              ) : (
                <Message variant="danger">
                  Exchange failed, this order expired at{' '}
                  {formDate(order.expiredAt)}!
                </Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Book Info</h2>
              {!order.orderItem ? (
                <Message>No book requested</Message>
              ) : (
                <ListGroup variant="flush">
                  {
                    <ListGroup.Item>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={order.orderItem.image}
                            alt={order.orderItem.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${order.orderItem.product}`}>
                            {order.orderItem.name}
                          </Link>
                        </Col>
                        <Col md={4}>${order.orderItem.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  }
                </ListGroup>
              )}
            </ListGroup.Item>
            {/*only completed order can be reviwed by buyer*/}
            {order.isCompleted === true && (
              <ListGroup.Item variant="flush">
                <h2>Review</h2>

                {!order.review ? (
                  <Message>No review yet!</Message>
                ) : (
                  <ListGroup.Item key={order.review._id}>
                    <strong>{order.review.name}</strong>
                    <Rating value={order.review.rating} />
                    <p>{order.review.createdAt.substring(0, 10)}</p>
                    <p>{order.review.comment}</p>
                  </ListGroup.Item>
                )}

                {!order.review && userInfo.email === order.buyer && (
                  <ListGroup.Item variant="flush">
                    <h2>Write Your Review here</h2>
                    {successOrderReview && (
                      <Message variant="success">
                        Review submitted successfully
                      </Message>
                    )}
                    {loadingOrderReview && <Loader />}
                    {errorProductReview && (
                      <Message variant="danger">{errorProductReview}</Message>
                    )}

                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingOrderReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  </ListGroup.Item>
                )}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>USER INFO</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Buyer</Col>
                  <Col>
                    <LinkContainer to={`/profile/${order.buyer}`}>
                      <Alert.Link className="md" variant="light">
                        {order.buyer}
                      </Alert.Link>
                    </LinkContainer>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Seller</Col>
                  <Col>
                    <LinkContainer to={`/profile/${order.orderItem.seller}`}>
                      <Alert.Link className="md" variant="light">
                        {order.orderItem.seller}
                      </Alert.Link>
                    </LinkContainer>
                  </Col>
                </Row>
              </ListGroup.Item>

              {loadingArrange && <Loader />}
              {userInfo &&
                userInfo.email === order.seller &&
                !order.isArranged &&
                !order.isExpired && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={arrangeHandler}
                    >
                      Mark As Arranged
                    </Button>
                  </ListGroup.Item>
                )}
              {loadingComplete && <Loader />}
              {userInfo &&
                userInfo.email === order.seller &&
                order.isArranged &&
                !order.isCompleted &&
                !order.isExpired && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={completeHandler}
                    >
                      Mark As Completed
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
