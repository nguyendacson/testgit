using Microsoft.AspNetCore.Mvc;

namespace HRM.Controllers
{
    public class HrManagementController : Controller
    {
        public IActionResult RecuitmentRequestNew()
        {
            return View();
        }

        public IActionResult ListEmployee()
        {
            return View();
        }

    }
}
