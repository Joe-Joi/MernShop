import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
const ProductChatingCart = ({ product }) =>{
    return(
        <>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            
            <ListGroup.Item>
                <ListGroup variant='flush'>
                    <ListGroup.Item key={product._id}>
                      <Row>
                        <Col md={3}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${product._id}`}>
                            {product.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {product.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                </ListGroup>
              
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
    )
}

export default ProductChatingCart
