import io from 'socket.io-client'
const userSocket = io('http://localhost')
export default userSocket