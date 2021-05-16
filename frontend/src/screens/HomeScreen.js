import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';
import userSocket from '../socketMidle'
const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const status = match.params.status
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    console.log("print user socket at home screen"+userSocket.id)
    //HomeScreen only shows books on selling
    console.log('client homescreen match: '+JSON.stringify(match))
    console.log('client homescreen status: '+status)
    dispatch(listProducts(keyword, pageNumber, status?status:'selling'));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <>
        <Link to="/" className="btn btn-dark my-2">
          Selling market
        </Link>{' '}
        <Link to="/requesting" className="btn btn-dark my-2">
          Requesting market
        </Link>
      </>
      <Meta />

      {/* {!keyword && <ProductCarousel />} */}
      {!keyword}
      <h1>{status?status:'selling'} books</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
            location="home"
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
