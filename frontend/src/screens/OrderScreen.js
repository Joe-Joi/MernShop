import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import { ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
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
              {order.isCompleted ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Finish Exchagne </Message>
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
                        <Col md={4}>{order.orderItem.price}</Col>
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

              {!order.isPaid && (
                <ListGroup.Item>{loadingPay && <Loader />}</ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
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
