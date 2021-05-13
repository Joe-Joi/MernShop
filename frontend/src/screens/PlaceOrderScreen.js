import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder, saveOrderProductInfo } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import axios from 'axios'
const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  //include info about the prodcut and Address&Time
  const { error, success, order } = useSelector((state) => state.orderCreate);

  const { shippingAddress, product } = useSelector((state) => state.orderInfo);
  const userLogin = useSelector((state)=>state.userLogin)
  const {userInfo} = userLogin
  const userGlobalSocket = useSelector(state => state.userGlobalSocket)
  const {userSocket} = userGlobalSocket
  if (!shippingAddress.address) {
    history.push('/shipping');
  }
  useEffect(() => {
    // if request a book successfully, the redirect to the order detail page.
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: ORDER_CREATE_RESET });
      //mark the product as sold avoid repeating order
      product.status = 'sold';
      dispatch(saveOrderProductInfo(product));
    }
  }, [history, success]);

  const placeOrderHandler = async() => {
    if(!userInfo){
      history.push('/login')
    }
    const product_id = product.product
    console.log('product_id'+product_id)
    console.log(product.seller)
    var {data} = await axios.get(`/api/users/getUserInfo/${product.seller}`)
    console.log("data:"+JSON.stringify(data))
    const seller_id = data._id
    //console.log(JSON.stringify(seller))
    const buyer_id = userInfo._id
    console.log(buyer_id+'     '+seller_id)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    var chat = await axios.post(
      '/api/chatlist/chat/',
      { product_id, seller_id, buyer_id },
      config
    );
    chat = chat.data
    console.log(JSON.stringify(chat))
    if(chat!="none"){
      console.log('notify the seller that I have bought')
      let message = {
        srcUser:buyer_id,
        destUser:seller_id,
        msgContent:'I have bought your book~',
        msgTime:Date.now(),
      }
      
      userSocket.emit("private-message",chat._id,message)
      //history.push('/chatlist')
    }else{
      console.log('new notify the seller that I have bought')
      console.log(buyer_id+'     '+seller_id)
      let newchat = {
        productId: product_id, 
        sellerId: seller_id, 
        buyerId: buyer_id,
        unread:true,
        messages:[{
          srcUser: buyer_id,
          destUser:seller_id,
          msgContent:'I have bought your book~',
          msgTime:Date.now(),
        }]
      }
      
      await userSocket.emit("createNewChat", newchat)
      //history.push('/chatlist')
     
    }
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
                disabled={!product || product.status != 'selling'}
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
