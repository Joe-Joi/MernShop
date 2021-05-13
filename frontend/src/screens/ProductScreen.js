import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listProductDetails } from '../actions/productActions';
import { saveOrderProductInfo } from '../actions/orderActions';

const ProductScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!product || !product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
    }
  }, [dispatch, match]);

  const requestBookHandler = () => {
    dispatch(saveOrderProductInfo(product));
    history.push('/login?redirect=shipping');
  };
  const productManageHandler = () => {
    history.push(`/product/edit/${product._id}`);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Homepage
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
            {product.status === 'requesting' ? (
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Buyer:</Col>
                        <Col>
                          <LinkContainer to={`/profile/${product.sellerEmail}`}>
                            <Alert.Link className="md" variant="light">
                              {product.sellerEmail}
                            </Alert.Link>
                          </LinkContainer>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {!userInfo || userInfo.email !== product.sellerEmail ? (
                      <>
                        <>
                          <Button
                            className="btn-block"
                            type="button"
                            disabled={product.status !== 'requesting'}
                          >
                            Contact the buyer
                          </Button>
                        </>
                      </>
                    ) : (
                      <ListGroup.Item>
                        <Button
                          onClick={productManageHandler}
                          className="btn-block"
                          type="button"
                          disabled={product.status !== 'requesting'}
                        >
                          Manage This Request
                        </Button>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            ) : (
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Seller:</Col>
                        <Col>
                          <LinkContainer to={`/profile/${product.sellerEmail}`}>
                            <Alert.Link className="md" variant="light">
                              {product.sellerEmail}
                            </Alert.Link>
                          </LinkContainer>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {!userInfo || userInfo.email !== product.sellerEmail ? (
                      <>
                        <ListGroup.Item>
                          <Button
                            className="btn-block"
                            type="button"
                            disabled={true}
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
            )}
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
