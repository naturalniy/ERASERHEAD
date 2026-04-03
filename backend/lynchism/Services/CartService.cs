using lynchism.Models;
using lynchism.DTO;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace lynchism.Services
{
    public class CartService
    {
        private readonly MyDbContext _context;

        public CartService(MyDbContext context)
        {
            _context = context;
        }
       
        public async Task<List<CartItemDTO>> GetCartByClientId(int id)
        {
             return await _context.CartItems
               .Where(c => c.ClientId == id)
               .Select(c => new CartItemDTO
               {
                   Id = c.Id,
                   ProductId = c.ProductId,
                   ProductName = c.Product.Name,
                   Price = c.Product.Price,
                   Size = c.Size,
                   Quantity  = c.Quantity,
                   ImageURL = c.Product.ImageURL
               })
               .ToListAsync();
        }
        public async Task<int> GetItemCount(int clientId) => await _context.CartItems
            .Where(ci => ci.ClientId == clientId)
            .CountAsync();
        public async Task<decimal> GetSum(int clientId) => await _context.CartItems
            .Where(c => c.ClientId == clientId)
            .SumAsync(c => c.Quantity * c.Product.Price);
        public async Task<List<CartItemDTO>> AddToCart(CartItem item)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var stock = await _context.ProductSizes
                    .FirstOrDefaultAsync(ps => ps.ProductId == item.ProductId && ps.Size == item.Size);

                if (stock == null || stock.Quantity < item.Quantity)
                {
                    return null;
                }
                var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.ClientId == item.ClientId
                                  && c.ProductId == item.ProductId
                                  && c.Size == item.Size);

                int newTotalQuantity = (existingItem?.Quantity ?? 0) + item.Quantity;

                if (newTotalQuantity > stock.Quantity)
                {
                    return null;
                }
                if (existingItem != null)
                {
                    existingItem.Quantity = newTotalQuantity;
                }
                else
                {
                    _context.CartItems.Add(item);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetCartByClientId(item.ClientId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return null;
            }
        }
        public async Task<bool> DeleteFromCart(int id)
        {
            
            CartItem? finded_cartItems = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id);
            if (finded_cartItems != null)
            {
                _context.Remove(finded_cartItems);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<CartItem?> ChangeProductQuantity(int cartId, int quantity)
        {
            var cartItem = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == cartId);
            if (cartItem == null) return null;
            var productSize = await _context.ProductSizes
                .FirstOrDefaultAsync(ps => ps.ProductId == cartItem.ProductId && ps.Size == cartItem.Size);

            if (productSize != null && productSize.Quantity >= quantity)
            {
                cartItem.Quantity = quantity;
                await _context.SaveChangesAsync();
                return cartItem;
            }
            return null;
        }
    }
}
