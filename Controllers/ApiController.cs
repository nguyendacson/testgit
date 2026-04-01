using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/proxy")]
    public class ApiController : Controller
    {
        [HttpPost("execute")]
        public async Task<IActionResult> Execute([FromBody] object payload)
        {
            var rawPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            using var client = new HttpClient();

            var res = await client.PostAsJsonAsync(
                "http://api.adtec.com/api/database/execute",
                payload
            );

            var result = await res.Content.ReadAsStringAsync();
            return Content(result, "application/json");
        }
    }
}
