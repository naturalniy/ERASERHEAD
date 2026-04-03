
using lynchism.DTO;
using lynchism.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace lynchism.Services
{
    public class OrderService
    {
        private readonly MyDbContext _context;

        public OrderService(MyDbContext context)
        {
            _context = context;
        }
        public async Task<List<CartItem>> GetCartItems(int clientId) => await _context.CartItems
            .Include(c => c.Product)
            .Where(x => x.ClientId == clientId)
            .ToListAsync();
        public async Task<List<Order>> GetAll() => await _context.Orders
            .Include(o => o.Products)
             .ThenInclude(oi => oi.Product)
            .Include(o => o.Client)
            .Where(o => o.Status != "Completed")
            .ToListAsync();
        public async Task<Order?> GetOrderByOrderId(int orderId) => await _context.Orders
         .Include(o => o.Products)
             .ThenInclude(oi => oi.Product)
         .Include(o => o.Client)
         .FirstOrDefaultAsync(o => o.Id == orderId);
        public async Task<Order?> GetOrder(int orderId, int clientId) => await _context.Orders
         .Include(o => o.Products)
             .ThenInclude(oi => oi.Product)
         .Include(o => o.Client)
         .FirstOrDefaultAsync(o => o.Id == orderId && o.ClientId == clientId);
        public async Task<decimal> GetSum(int clientId)
        {
            var items = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.ClientId == clientId)
                .ToListAsync();
            return items.Sum(c => c.Quantity * c.Product.Price);
        }
        public async Task<List<OrderDTO>> GetOrderByClientId(int id) => await _context.Orders
            .Include(o => o.Products)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.Client)
            .Where(o => o.ClientId == id)
            .OrderByDescending(o => o.DateOfIssuance)
            .Select(o => new OrderDTO
            {
                Id = o.Id,
                Date = o.DateOfIssuance,
                Status = o.Status,
                TotalSum = o.Sum,
                Items = o.Products.Select(p => new OrderItemDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.Product.Name,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Size = p.Size
                }).ToList()
            })
            .ToListAsync();
        public async Task<Order?> GetOrderById(int id) => await _context.Orders
            .Include(o => o.Client)
            .Include(o => o.Products)
                .ThenInclude(oi => oi.Product) 
            .FirstOrDefaultAsync(o => o.Id == id);
        public async Task<string?> GetOrderStatus(int orderId)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId);
            return order?.Status;
        }
        public async Task<Order?> CreateOrderFromCart([FromBody] CreateOrderDto orderDto, int clientId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var cartItems = await GetCartItems(clientId);
                if (!cartItems.Any()) return null;

                foreach (var item in cartItems)
                {
                    var stockEntry = await _context.ProductSizes
                        .FirstOrDefaultAsync(ps => ps.ProductId == item.ProductId && ps.Size == item.Size);

                    if (stockEntry == null || stockEntry.Quantity < item.Quantity)
                    {
                        throw new Exception($"Недостаточно товара на складе для ProductId: {item.ProductId}");
                    }

                    stockEntry.Quantity -= item.Quantity;
                }


                var order = new Order
                {
                    ClientId = clientId,
                    DateOfIssuance = DateTime.UtcNow,
                    Status = "Pending",
                    StreetAddress = orderDto.StreetAddress,
                    PaymentMethod = orderDto.PaymentMethod,
                    FirstName = orderDto.FirstName,
                    LastName = orderDto.LastName,
                    Phone = orderDto.Phone,
                    Country = orderDto.Country,
                    ZipCode = orderDto.ZipCode,
                    Sum = await GetSum(clientId),
                    Products = cartItems.Select(ci => new OrderItem
                    {
                        ProductId = ci.ProductId,
                        Quantity = ci.Quantity,
                        Size = ci.Size,
                        Price = ci.Product.Price
                    }).ToList()
                };
                _context.Orders.Add(order);
                _context.CartItems.RemoveRange(cartItems);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return order;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Ошибка при создании заказа: {ex.Message}");
                return null;
            }

        }
        public async Task<bool> DeleteOrder(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(c => c.Id == id);

            if (order == null) return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<Order?> UpdateOrderStatus(int orderId, string newStatus)
        {
            var order = await GetOrderById(orderId);
            if (order == null) return null;

            order.Status = newStatus;

            await _context.SaveChangesAsync();
            return order;
        }
        public async Task<PagedResult<OrderDTO>> GetAllOrdersPaged(int page, int pageSize)
        {
            var query = _context.Orders
                .Include(o => o.Products).ThenInclude(oi => oi.Product)
                .Include(o => o.Client)
                .OrderByDescending(o => o.DateOfIssuance);

            var totalCount = await query.CountAsync();
            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderDTO
                {
                    Id = o.Id,
                    Date = o.DateOfIssuance,
                    Status = o.Status,
                    TotalSum = o.Sum,
                    Items = o.Products.Select(p => new OrderItemDTO
                    {
                        ProductId = p.ProductId,
                        ProductName = p.Product.Name,
                        Price = p.Price,
                        Quantity = p.Quantity,
                        Size = p.Size
                    }).ToList()
                })
                .ToListAsync();

            return new PagedResult<OrderDTO> 
            { 
                Items = orders, 
                TotalCount = totalCount,
                CurrentPage = page,
                PageSize = pageSize
            };
        }
    }
}
