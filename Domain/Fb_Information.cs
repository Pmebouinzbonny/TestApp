namespace Domain
{
    public class Fb_Information
    {
         public Guid Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }
        
        public int NumberOfInputsVariables { get; set; }

        public string  Datentyp { get; set; }
        public int Result { get; set; }
    }
}