import React, { useState,useDispatch} from 'react';
import { Form, Button } from 'react-bootstrap';
const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');
  //const [prefix, setPrefix] = useState('')
  const submitHandler = (e) => {
    e.preventDefault();
    var status = document.getElementById('market').value.split(' ')[0];
    var prefix = document.getElementById('prefix').value;
    console.log(status+' with '+keyword.trim())
    if(status=='requesting'&&keyword.trim()==''){
      history.push('/requesting')
    }
    if (keyword.trim()) {
      console.log('client key word'+prefix+'_'+keyword)
      var keyword2server = prefix+'_'+keyword
      //dispatch(listProducts(prefix+'_'+keyword, '', market.split(' ')[0]));
      history.push(`/search/${status}&${keyword2server}`);
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
