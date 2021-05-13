import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import { saveOrderProductInfo } from '../actions/orderActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import axios from 'axios';
import 'socket.io-client'
const ProductScreen = ({ history, match }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userGlobalSocket = useSelector(state => state.userGlobalSocket)
  const {userSocket} = userGlobalSocket
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo} = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;
  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
    }
    if (!product || !product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview]);

  const requestBookHandler = () => {
    dispatch(saveOrderProductInfo(product));
    history.push('/login?redirect=shipping');
  };
  const productManageHandler = () => {
    history.push(`/product/edit/${product._id}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  const contactHandler = async(e) => {
    if(!userInfo){
      history.push('/login')
    }
    const product_id = product._id
    console.log(product.sellerEmail)
    var {data} = await axios.get(`/api/users/getUserInfo/${product.sellerEmail}`)
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
      history.push('/chatlist')
    }else{
      console.log(buyer_id+'     '+seller_id)
      let newchat = {
        productId: product_id, 
        sellerId: seller_id, 
        buyerId: buyer_id,
        unread:true,
        messages:[{
          srcUser: buyer_id,
          destUser:seller_id,
          msgContent:'Hi, I am interested in your book~',
          msgTime:Date.now(),
        }]
      }
      
      await userSocket.emit("createNewChat", newchat)
      history.push('/chatlist')
     
    }
  }




  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <bold>Author</bold>: {product.author}
                </ListGroup.Item>
                <ListGroup.Item>
                  <bold>Category</bold>: {product.category}
                </ListGroup.Item>
                <ListGroup.Item>
                  <bold>Condition</bold>: {product.condition}
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Seller:</Col>
                      <Col>
                        <strong>{product.sellerEmail}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {!userInfo || userInfo.email !== product.sellerEmail ? (
                    <>
                      <ListGroup.Item>
                        <Button
                          className="btn-block"
                          type="button"
                          onClick={contactHandler}
                        >
                          Contact the Seller
                        </Button>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Button
                          onClick={requestBookHandler}
                          className="btn-block"
                          type="button"
                          disabled={product.status !== 'selling'}
                        >
                          Request It
                        </Button>
                      </ListGroup.Item>
                    </>
                  ) : (
                    <ListGroup.Item>
                      <Button
                        onClick={productManageHandler}
                        className="btn-block"
                        type="button"
                        disabled={product.status !== 'selling'}
                      >
                        Manage This Book
                      </Button>
                    </ListGroup.Item>
                  )}
                  {product.status === 'sold' && (
                    <ListGroup.Item>
                      <Message variant="warning">This book is sold!</Message>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
