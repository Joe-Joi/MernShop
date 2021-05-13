import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listMyOrders } from '../actions/orderActions';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

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
const MyOrderScreen = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  //check authority. only login user can check their orders
  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (userInfo) {
        dispatch(listMyOrders());
      }
    }
  }, [dispatch, history, userInfo]);

  const orderDateHandler = () => {
    dispatch(listMyOrders(startDate, endDate));
  };
  return (
    <Row>
      <Col md={12}>
        <h2>My Orders </h2>
        <Row>
          Choose Order Date:<span>&nbsp;&nbsp;</span>
          <DatePicker
            showTimeSelect
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <span>&nbsp;&nbsp;</span>
          To<span>&nbsp;&nbsp;</span>
          <DatePicker
            showTimeSelect
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
          <span>&nbsp;&nbsp;</span>
          <Button
            className="btn-sm"
            variant="outline-dark"
            onClick={orderDateHandler}
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
                <th>ORDER DATE</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.orderItem.name}</td>
                  <td>{formDate(order.createdAt)}</td>

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
                        Details
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

export default MyOrderScreen;
