import React, { useState, useEffect} from 'react'
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  Tab,
  Nav,
  ListGroup,
  Card
} from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Link, Image } from 'react-router-bootstrap'
import { useDispatch, useSelector, } from 'react-redux'
import Message from '../components/Message'
import { getChatList, setSelectedChat, updateChatList } from '../actions/userChatActions'
import { JsonWebTokenError } from 'jsonwebtoken'
import Loader from '../components/Loader'
import ProductChatingCart from '../components/ProductChatingCart'
import 'socket.io-client'
import store from '../store'
const ChatListScreen = ({ history }) => {
  const dispatch = useDispatch()
  //dispatch(getChatList)
  const userChatList = useSelector((state) => state.userChatList)
  const selectedChat = useSelector((state) => state.selectedChat)
  const { selectedChatId } = selectedChat
  const { loading, error, chatlist } = userChatList
  //let socket = useSelector((state) => state.io)
  //console.log("????????"+chatlist)
  const userGlobalSocket = useSelector(state => state.userGlobalSocket)
  const {userSocket} = userGlobalSocket
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo} = userLogin
  const [messageContent, setMessageContent] = useState('')

  
  useEffect(() => {
    if (userInfo) {
      //dispatch(updateChatList([]))
      console.log(userInfo._id)
      dispatch(getChatList(userInfo._id))
      dispatch(setSelectedChat(0))
      if(!userSocket.connected){
        history.push('/logout')
        history.push('/login')
      }
      userSocket.on("private-message",(chatId,message)=>{
        console.log("收到消息啦！！！")
        console.log(chatId)
        let currentChatlist = store.getState().userChatList.chatlist
        console.log(JSON.stringify(currentChatlist))
        const chat = currentChatlist.filter(function (chat) {
          return chat._id == chatId
        })[0]
        // console.log(state.userChatList.chatlist)
        // console.log(state.userChatList.chatlist[0])
        // console.log(JSON.stringify(chatlist))
        chat.messages.push(message)
        for(var item in currentChatlist){
          if(item._id==chat._id){
            currentChatlist[item]=chat
          }
        }
        dispatch(updateChatList(currentChatlist))
        dispatch(setSelectedChat(chatId))
      })
      
      //setChats(chatlist)
      //console.log("after:"+selectedChat)
    } else {
      history.push('/login')
    }
  }, [dispatch])

  const selectChatHandler = (e) => {
    e.preventDefault()
    //console.log(e.target.value)
    //localStorage.setItem('selectedChat', e.target.id)
    dispatch(setSelectedChat(e.target.className.toString().split(' ')[0]))
  }

  const sendMessageHandler = (e) => {
    e.preventDefault()
    //setMessageContent({})
    console.log(messageContent)
    //console.log(selectedChatId)
    const chat = chatlist.filter(function (chat) {
      return chat._id === selectedChatId
    })[0]
    //const { buyerId, sellerId, messages } = chat
    //console.log(buyerId)
    //console.log(sellerId)
    //console.log(messages)
    //console.log(userInfo)
    //console.log("nnd"+chat)
    let dest = (userInfo._id==chat.seller._id)?chat.buyer:chat.seller
      
    
    let message = {
      srcUser:userInfo,
      destUser:dest,
      msgContent:messageContent,
      msgTime:Date.now(),
    }

    let message2server = {
      srcUser:userInfo._id,
      destUser:dest._id,
      msgContent:messageContent,
      msgTime:Date.now(),
    }
    if(!userSocket.connected){
      console.log('!!!!!')
    }
    
    userSocket.emit("private-message",chat._id,message)
    chat.messages.push(message)
    for(var item in chatlist){
      if(item._id==chat._id){
        chatlist[item]=chat
      }
    }
    setMessageContent('')
    //console.log(chatlist)
    document.getElementById("inlineFormInputName").value=''
    dispatch(updateChatList(chatlist))


  }

  //const selectedChat = useSelector((state) => state.selectedChat)
  if (loading) {
    return <Loader />
  }

  return (
    <>
    
    {!error?(
      <>
      <Tab.Container id='left-tabs-example' defaultActiveKey='first' fixed>
        <Row>
          <Col sm={3}>
            {
            chatlist.map((chat) => (
                <Nav variant='pills' className='flex-column'>
                  <Nav.Item>
                    <Nav.Link
                      className={chat._id}
                      eventKey={chat._id}
                      onClick={selectChatHandler}
                    >
                      {chat.seller.name + '\'s ' + chat.product.name}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              ))}
          </Col>
          <Col sm={9}>
            {chatlist.map((chat) => (
              <>
                <Tab.Content>
                  <Tab.Pane eventKey={chat._id}>
                  <ProductChatingCart product={chat.product}/>
                    <ListGroup variant='flush'>
                      {chat.messages.map((message) => (
                        <>
                          <ListGroup.Item>
                            <Row>
                              From {message.srcUser.name}, at {message.msgTime}
                            </Row>
                            <Row> {message.msgContent}</Row>
                          </ListGroup.Item>
                        </>
                      ))}
                    </ListGroup>
                  </Tab.Pane>
                </Tab.Content>
              </>
            ))}
          </Col>
        </Row>
      </Tab.Container>
      <Form onSubmit={sendMessageHandler}>
        <Col sm={3}></Col>
        <Form.Row className='align-items-center'>
          <Col className='my-1'>
            <Form.Control
              id='inlineFormInputName'
              placeholder='Jane Doe'
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </Col>
          <Col xs='auto' className='my-1'>
            <Button type='submit'>Send</Button>
          </Col>
        </Form.Row>
      </Form>
      </>
    ):(<></>)}
      
    </>
    )
}

export default ChatListScreen