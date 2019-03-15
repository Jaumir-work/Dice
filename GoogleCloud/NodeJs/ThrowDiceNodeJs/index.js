var azStorage = require("azure-storage")

var connString = 
"DefaultEndpointsProtocol=https;AccountName=mcostorageaccount;AccountKey=2jveh9j8dngPBttcZ3VKtNqz+eCTBiWGw4MQTLHgLGC0f8qFA9/xCjJK4MkyXVisw9GaYaGEpeHzkOMxFp63Kw==;EndpointSuffix=core.windows.net"

module.exports.ThrowDiceNodeJs = async function (req, res) {

    var resultReturn = "Added --"
    var resultCode = 500

    function endFunction () {
            res.status(resultCode).send(resultReturn)
    }

    var timeStamp = new Date().toISOString();
    var queueSvc = azStorage.createQueueService(connString);

    queueSvc.messageEncoder = new azStorage.QueueMessageEncoder.TextBase64QueueMessageEncoder();

    function addMessagestWaitable()
    {
        return new Promise( (resolve, reject) => {
            queueSvc.doesQueueExist('latestdraw', function(error, result) {
                if (result.exists) {

                    var newDraw1 = (Math.floor(Math.random() * 7 )).toString()
                    var newDraw2 = (Math.floor(Math.random() * 7 )).toString()

                    queueSvc.createMessage('latestdraw', newDraw1, function(error, results){
                        if(!error){
                            resultReturn = resultReturn + newDraw1
                            resultCode = 201
                            resolve(true);}
                        else{reject(error)}
                    })
                    queueSvc.createMessage('latestdraw', newDraw2, function(error, results){
                        if(!error){
                            resultReturn = resultReturn + " -- " + newDraw2
                            resultCode = 202
                            resolve(true);}
                        else{reject(error)}
                    })
                }
                else {
                    reject(error)
                }
            })
        })
    }

    console.log('JavaScript function running!', timeStamp);

    await addMessagestWaitable()

    console.log('JavaScript function finished', timeStamp);

    endFunction()
};