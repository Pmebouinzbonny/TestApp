using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        public DataContext Context { get; }
        private readonly DataContext _context;

        public ActivitiesController(DataContext context)
        {
            _context = context;

        }
        [HttpGet]// api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")]// api/activities/fdfkffdfd
        public async Task<ActionResult<List<Activity>>> GetActivity()
        {
            return await _context.Activities.ToListAsync();
        }
    }
}