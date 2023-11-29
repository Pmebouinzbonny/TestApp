using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class Fb_InformationsController : BaseApiController
    {
        public DataContext Context { get; }
        private readonly DataContext _context;

        public Fb_InformationsController(DataContext context)
        {
            _context = context;

        }

        [HttpGet]// api/informations
        public async Task<ActionResult<List<Fb_Information>>> GetFb_Informations()
        {
            return await _context.Fb_Informations.ToListAsync();
        }

        [HttpGet("{id}")]// api/information/fdfkffdfd
        public async Task<ActionResult<Fb_Information>> GetFb_Information(Guid id)
        {
            return await _context.Fb_Informations.FindAsync(id);
        }

    }
}