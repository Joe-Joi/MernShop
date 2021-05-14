import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');
  //const [prefix, setPrefix] = useState('')
  const submitHandler = (e) => {
    e.preventDefault();
    var prefix = document.getElementById('prefix').value;
    if (keyword.trim()) {
      history.push(`/search/${prefix + '_' + keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        size="sm"
        as="select"
        id="market"
        className="mr-sm-2 ml-sm-2"
      >
        <option>selling market</option>
        <option>requesting market</option>
      </Form.Control>
      <Form.Control size="sm" as="select" id="prefix">
        <option>title</option>
        <option>author</option>
        <option>category</option>
      </Form.Control>

      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Type to search"
        className="mr-sm-3 ml-sm-4"
        id="searchBox"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
