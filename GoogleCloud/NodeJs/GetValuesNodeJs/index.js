var azStorage = require("azure-storage")

var connString = 
"DefaultEndpointsProtocol=https;AccountName=mcostorageaccount;AccountKey=2jveh9j8dngPBttcZ3VKtNqz+eCTBiWGw4MQTLHgLGC0f8qFA9/xCjJK4MkyXVisw9GaYaGEpeHzkOMxFp63Kw==;EndpointSuffix=core.windows.net"

module.exports.GetValuesNodeJs = async function(req, res) {

    var resultReturn = "--"
    var resultCode = 500

    function endFunction () {
            res.status(resultCode).send(resultReturn)
    }

    var queueSvc = azStorage.createQueueService(connString);

    queueSvc.messageEncoder = new azStorage.QueueMessageEncoder.TextBase64QueueMessageEncoder();

    function doesQueueExistWaitable()
    {
        return new Promise( (resolve, reject) => {
            queueSvc.doesQueueExist('latestdraw', function(error, result) {
                if (result.exists) {
                    queueSvc.getMessages('latestdraw', {numOfMessages: 2, visibilityTimeout: 5 * 60}, function(error, results){
                        
                        if(!error){
                            for (var index in results){
                                resultReturn = resultReturn + results[index].messageText + "--"
                                resultCode = 200
        
                                queueSvc.deleteMessage('latestdraw', results[index].messageId,results[index].popReceipt,
                                function(error, response){
                                    if(error){
                                    resultReturn = 'Could not delete messages from queue.'
                                    resultCode = 400
                                    reject(error)
                                    }
                                })
                            }
                            resolve(true);
                        }
                        else{
                            resultReturn = 'Could not get two messages.'
                            resultCode=400
                            resolve(true)
                        }
                    })
                }
                else {
                    resultCode =  400
                    resultReturn =  "Queue does not seem to exist."
                    reject(error)
                }
            })
        })
    }

    await doesQueueExistWaitable()
    endFunction()
}