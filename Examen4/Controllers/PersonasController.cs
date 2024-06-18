using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Examen3.ServiceApp;

namespace Examen3.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("personas")]

    public class PersonasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Personas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Persona>>> GetPersonas()
        {
            return await _context.Personas.ToListAsync();
            // return new List<Persona>()
            // {
            //     new Persona(){Id = 1,Nombre = "Luciana Espinoza", FechaNacimiento = new DateTime(1823,1,2)},
            //     new Persona(){Id = 2,Nombre = "Diego Rojas", FechaNacimiento = new DateTime(1925,4,9)}
            // };

        }

        // GET: api/Personas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Persona>> GetPersona(int id, bool incluirDirecciones = false)
        {
            Persona persona;

            if (incluirDirecciones)
            {
                persona = await _context.Personas
                                        .Include(x => x.Direcciones)
                                        .FirstOrDefaultAsync(x => x.Id == id);
            }
            else
            {
                persona = await _context.Personas.FindAsync(id);
            }

            if (persona == null)
            {
                return NotFound();
            }

            return persona;
        }
        private async Task CrearOEditarDirecciones(List<Direccion> direcciones)
        {
            // Separa las direcciones en dos listas: las que necesitan ser creadas y las que necesitan ser editadas
            List<Direccion> direccionesACrear = direcciones.Where(x => x.Id == 0).ToList();
            List<Direccion> direccionesAEditar = direcciones.Where(x => x.Id != 0).ToList();

            if (direccionesACrear.Any())
            {
                await _context.AddRangeAsync(direccionesACrear);
            }
            if (direccionesAEditar.Any())
            {
                _context.UpdateRange(direccionesAEditar);
            }
        }

        // PUT: api/Personas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersona(int id, Persona persona)
        {
            if (id != persona.Id)
            {
                return BadRequest();
            }

            _context.Entry(persona).State = EntityState.Modified;

            try
            {
                // Aquí llamamos al método para crear o editar direcciones
                await CrearOEditarDirecciones(persona.Direcciones);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // POST: api/Personas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Persona>> PostPersona(Persona persona)
        {
            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersona", new { id = persona.Id }, persona);
        }

        // DELETE: api/Personas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersona(int id)
        {
            var persona = await _context.Personas.FindAsync(id);
            if (persona == null)
            {
                return NotFound();
            }

            _context.Personas.Remove(persona);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonaExists(int id)
        {
            return _context.Personas.Any(e => e.Id == id);
        }
    }
}
