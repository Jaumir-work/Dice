using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Dice
{
    public static class Dice_GetValues
    {
        [FunctionName("GetValues")]
        public static IActionResult GetValues(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [Queue("latestdraw", Connection = "AzureWebJobsStorage")] CloudQueue queue,
            ILogger log)
        {
            string lastValue = null;

            log.LogInformation("C# HTTP trigger function processed a request.");

            try
            {
                var lastMessage = queue.GetMessageAsync().Result;
                lastValue = lastMessage.InsertionTime + " lll " + lastMessage.AsString;

                queue.DeleteMessageAsync(lastMessage).Wait();

                lastMessage = queue.GetMessageAsync().Result;
                lastValue = lastValue + " - " + lastMessage.InsertionTime + " lll " + lastMessage.AsString;

                queue.DeleteMessageAsync(lastMessage).Wait();
            }
            catch { }

            return lastValue != null
                ? (ActionResult)new OkObjectResult(lastValue)
                : new BadRequestObjectResult("Could not get values from the Queue");
        }
    }
}
