import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';

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
const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>BOOK</th>
              <th>BUYER</th>
              <th>SELLER</th>
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
                <td>{order.seller}</td>
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
                      ORDER DETAIL
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
