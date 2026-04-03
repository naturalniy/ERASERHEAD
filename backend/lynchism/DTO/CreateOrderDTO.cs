namespace lynchism.DTO
{
    public class CreateOrderDto
    {
        public string Phone { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string ZipCode { get; set; } = null!;
        public string StreetAddress { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public string Country { get; set; } = null!;
    }
}