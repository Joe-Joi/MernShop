import io from 'socket.io-client'
const userSocket = io('http://localhost:5000')
export default userSocket