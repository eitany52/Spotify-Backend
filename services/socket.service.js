import { Server } from 'socket.io'

let gIo = null

export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        socket.on('disconnect', socket => { })

        socket.on('user-watch-station', stationId => {
            socket.join('watchedStation' + stationId)
        })

        socket.on('user-left-station', stationId => {
            socket.leave('watchedStation' + stationId)
        })

        socket.on('set-user-socket', userId => {
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            delete socket.userId
        })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to(label).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        socket.emit(type, data)
    }
}

async function join({ room, userId }) {
    const socket = await _getUserSocket(userId)
    if (socket) {
        socket.join(room)
    }
}

async function leave({ room, userId }) {
    const socket = await _getUserSocket(userId)
    if (socket) {
        socket.leave(room)
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        gIo.to(room).emit(type, data)
    } else {
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}

async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
    join,
    leave
}
