namespace lynchism.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public decimal TotalSum { get; set; }
        public DateTime Date {  get; set; }
        public string Status { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }
}
