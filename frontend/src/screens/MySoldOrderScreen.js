import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listMySoldOrders } from '../actions/orderActions';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

const MySoldOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderListMySold = useSelector((state) => state.orderListMySold);
  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = orderListMySold;

  //check authority. only login user can check their orders
  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (userInfo) {
        dispatch(listMySoldOrders());
      }
    }
  }, [dispatch, history, userInfo]);
  const soldDateHandler = () => {
    dispatch(listMySoldOrders(startDate, endDate));
  };
  return (
    <Row>
      <Col md={12}>
        <h2>MY SOLD BOOKS</h2>
        <Row>
          Choose Order Date:<span>&nbsp;&nbsp;</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <span>&nbsp;&nbsp;</span>
          To<span>&nbsp;&nbsp;</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
          <span>&nbsp;&nbsp;</span>
          <Button
            className="btn-sm"
            variant="outline-dark"
            onClick={soldDateHandler}
          >
            Search
          </Button>
        </Row>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>BOOK</th>
                <th>BUYER</th>
                <th>ORDER DATE</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    <LinkContainer to={`/product/${order.orderItem.product}`}>
                      <Alert.Link className="md" variant="light">
                        {order.orderItem.name}
                      </Alert.Link>
                    </LinkContainer>
                  </td>
                  <td>{order.buyer}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>

                  <td>
                    {order.isCompleted ? (
                      <p class="text-success">Completed</p>
                    ) : order.isExpired ? (
                      <p class="text-danger">Expired</p>
                    ) : order.isArranged ? (
                      <p class="text-info">Arranged</p>
                    ) : (
                      <p class="text-warning">Waitting Arrangement</p>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="dark">
                        ORDER DETAIL
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default MySoldOrderScreen;
