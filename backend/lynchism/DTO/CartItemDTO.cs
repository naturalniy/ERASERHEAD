namespace lynchism.DTO
{
    public class CartItemDTO
    {
        public int Id { get; set; } 
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; }
        public string Size { get; set; } = null!;
        public int Quantity { get; set; }
        public string ImageURL { get; set; } = null!;
    }
}