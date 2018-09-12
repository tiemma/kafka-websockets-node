
module.exports = function (KafkaAvro, io, topicName, socketId) {

  var kafkaAvro = new KafkaAvro({
    kafkaBroker: process.env.KAFKA_BROKER,
    schemaRegistry: process.env.SCHEMA_REGISTRY_URL,
  });

  // Query the Schema Registry for all topic-schema's
  // fetch them and evaluate them.
  kafkaAvro.init()
    .then(function () {
      console.log('Avro consumer ready to use');
      io.sockets.connected[socketId].emit('acknowledge', true);
    });

  kafkaAvro.getConsumerStream({
    'group.id': socketId,
    'socket.keepalive.enable': true,
    'enable.auto.commit': true,
  },
    { 
      'request.required.acks': 1 
    },
    {
      'topics': topicName
    })
    .then(function (stream) {
      stream.on('error', function (err) {
        if (err) console.log(err);
        // process.exit(1);
      }); 

      stream.on('data', function (rawData) {
        if (io.sockets.connected[socketId]){
          io.sockets.connected[socketId].emit('consumer', rawData['offset']);
        } else {
          console.log(`Device with socket id ${socketId} disconnected`)
          if(stream){
            stream.close();
          } else {
            console.log(`Streams are already closed`)
          }
        }
        console.log(`Emitted message from topic ${rawData['topic']} with offset ${rawData['offset']}`)
      });

      stream.on('error', function (err) {
        console.log(err);
        process.exit(1);
      });

      stream.consumer.on('event.error', function (err) {
        console.log(err);
      })
    });
}
