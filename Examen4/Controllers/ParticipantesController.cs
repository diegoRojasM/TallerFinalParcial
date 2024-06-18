using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Examen3.ServiceApp;

namespace Examen3.Controllers
{
    [ApiController]
    [Route("participantes")]
    public class ParticipantesController : Controller
    {
        private readonly AppDbContext dbContext;

        public ParticipantesController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("delete/list")]
        public IActionResult DeleteList([FromBody] List<int> ids)
        {
            try
            {
                List<Participante> participantes = ids.Select(id => new Participante() { Id = id }).ToList();
                dbContext.RemoveRange(participantes);
                dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

    }
}