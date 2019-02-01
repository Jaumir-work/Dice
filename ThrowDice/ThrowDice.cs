using System;
using Microsoft.Azure.WebJobs;
using Microsoft.WindowsAzure.Storage.Queue;
using Microsoft.Extensions.Logging;

namespace Dice
{
    public static class Dice_ThrowDice
    {
        [FunctionName("ThrowDice")]
        public static void ThrowDice([TimerTrigger("0 */3 * * * *")]TimerInfo myTimer,
             [Queue("latestdraw", Connection = "AzureWebJobsStorage")] CloudQueue myQueue,
             ILogger log)
        {
            Random rnd = new Random();

            var newDraw = rnd.Next(1, 7).ToString();
            myQueue.AddMessageAsync(new CloudQueueMessage(newDraw));

            newDraw = rnd.Next(1, 7).ToString();
            myQueue.AddMessageAsync(new CloudQueueMessage(newDraw));

            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }
    }
}

