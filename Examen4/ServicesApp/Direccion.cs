namespace Examen3.ServiceApp
{
    public class Direccion
    {
        public int Id { get; set;}
        public string Calle { get; set;}
        public string Provincia { get; set;}

        public int PersonaId { get; set;} // 1 a muchos, 1 persona puede tener varias direcciones agregadas
    }
}