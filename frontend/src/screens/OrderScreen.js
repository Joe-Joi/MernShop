import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  completeOrder,
  arrangeOrder,
} from '../actions/orderActions';
import {
  ORDER_ARRANGE_RESET,
  ORDER_COMPLETE_RESET,
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

  const orderComplete = useSelector((state) => state.orderComplete);
  const { loading: loadingComplete, success: successComplete } = orderComplete;

  const orderArrange = useSelector((state) => state.orderArrange);
  const { loading: loadingArrange, success: successArrange } = orderArrange;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (!order || successComplete || successArrange || order._id !== orderId) {
      dispatch({ type: ORDER_ARRANGE_RESET });
      dispatch({ type: ORDER_COMPLETE_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (
      //if the current is neither seller or buyer, redirect to homepage
      userInfo.email !== order.seller &&
      userInfo.email !== order.buyer
    ) {
      history.push('/');
    }
  }, [dispatch, orderId, successArrange, successComplete, order]);

  const arrangeHandler = () => {
    dispatch(arrangeOrder(order));
  };
  const completeHandler = () => {
    dispatch(completeOrder(order));
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
                  <Col>{order.buyer}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Seller</Col>
                  <Col>
                    <a href={`mailto:${order.buyer}`}>
                      {order.orderItem.seller}
                    </a>
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
