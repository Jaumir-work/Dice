var azStorage = require("azure-storage")
process.env["AZURE_STORAGE_CONNECTION_STRING"] = process.env["AzureWebJobsStorage"]

module.exports = async function (context, myTimer) {

    var timeStamp = new Date().toISOString();
    var queueSvc = azStorage.createQueueService();

    queueSvc.messageEncoder = new azStorage.QueueMessageEncoder.TextBase64QueueMessageEncoder();

    function addMessagestWaitable()
    {
        return new Promise( (resolve, reject) => {
            queueSvc.doesQueueExist('latestdraw', function(error, result) {
                if (result.exists) {

                    var newDraw1 = (Math.floor(Math.random() * 7 )).toString()
                    var newDraw2 = (Math.floor(Math.random() * 7 )).toString()

                    queueSvc.createMessage('latestdraw', newDraw1, function(error, results){
                        if(!error){resolve(true);}
                        else{reject(error)}
                    })
                    queueSvc.createMessage('latestdraw', newDraw2, function(error, results){
                        if(!error){resolve(true);}
                        else{reject(error)}
                    })
                }
                else {
                    reject(error)
                }
            })
        })
    }

    context.log('JavaScript timer trigger function running!', timeStamp);

    await addMessagestWaitable()

    context.log('JavaScript timer trigger function finished', timeStamp);

};