import React, { useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listMySoldOrders } from '../actions/orderActions';

const MySoldOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

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

  return (
    <Row>
      <Col md={12}>
        <h2>My Sold</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>BOOK</th>
                <th>ORDER DATE</th>
                <th>Completed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.orderItem.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>

                  <td>
                    {order.isCompleted ? (
                      order.completedAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
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

export default MySoldOrderScreen;
