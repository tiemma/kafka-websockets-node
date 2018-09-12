module.exports = function (KafkaAvro, io) {

    io.sockets.on('connection', function (socket) {

        console.log("Socket.id is " + socket.id);

        // // Promote this socket as master
        //https://stackoverflow.com/
        //questions/4647348/
        //send-message-to-specific-client-with-socket-io-and-node-js

        socket.on("consume", function (msg) {
            
            require('./node-avro-consumer')(KafkaAvro, io, msg, socket.id);
            console.log("Got message from socketID " + socket.id + " message " + msg)

        });

        // when socket disconnects, remove it from the list:
        socket.on("disconnect", function () {
            console.info(`Client gone [id=${socket.id}]`);
        });

    });
}