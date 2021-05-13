import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder, saveOrderProductInfo } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  //include info about the prodcut and Address&Time
  const { error, success, order } = useSelector((state) => state.orderCreate);

  const { shippingAddress, product } = useSelector((state) => state.orderInfo);

  if (!shippingAddress.address) {
    history.push('/shipping');
  }
  useEffect(() => {
    // if request a book successfully, the redirect to the order detail page.
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      dispatch({ type: PRODUCT_DETAILS_RESET });
      //mark the product as sold avoid repeating order
      dispatch(saveOrderProductInfo(product));
    }
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItem: product,
        shippingAddress: shippingAddress,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>EXPECTED EXCHANGE ADDRESS&TIME</h2>
              <p>
                <strong>Address:</strong>
                {shippingAddress.address} {shippingAddress.postalCode},{' '}
              </p>
              <p>
                <strong>Time&Date:</strong>
                {shippingAddress.dateTime}{' '}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Book Info</h2>
              {!product ? (
                <Message>No book requested</Message>
              ) : (
                <ListGroup variant="flush">
                  {
                    <ListGroup.Item>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${product.product}`}>
                            {product.name}
                          </Link>
                        </Col>
                        <Col md={4}>{product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  }
                </ListGroup>
              )}
            </ListGroup.Item>

            {error && (
              <ListGroup.Item>
                <Message variant="danger">{error}</Message>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <Button
                type="button"
                disabled={!product || product.status !== 'selling'}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
