using lynchism.DTO;
using lynchism.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
namespace lynchism.Services
{
    public class ProductService
    {
        private readonly MyDbContext _context;

        public ProductService(MyDbContext context)
        {
            _context = context;
        }
        public async Task<List<ProductSize>> GetProductSizes(int product_id) => await _context.ProductSizes
            .Where(ps => ps.ProductId == product_id)
            .ToListAsync();
        public async Task<List<Product>> GetAll() => await _context.Products
            .Include(p => p.Sizes)
            .ToListAsync();
        public async Task<Product?> GetProductById(int id) => await _context.Products
            .Include(p => p.Sizes)
            .FirstOrDefaultAsync(p => p.Id == id);
        public async Task<List<Product>> GetByCategory(string category) => await _context.Products
            .Include(p => p.Sizes)
            .Where(p => p.Category == category)
            .ToListAsync();
        public async Task<Product?> AddProduct(Product product)
        {
            if (product == null)
            {
                return null;
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }
        public async Task<Product?> UpdateProduct(ProductDTO product, int id)
        {
            Product? finded_product = await GetProductById(id);

            if (finded_product != null)
            {
                finded_product.Name = product.Name;
                finded_product.Description = product.Description;
                finded_product.Price = product.Price;
                finded_product.Category = product.Category;
                finded_product.ImageURL = product.ImageURL;


                await _context.SaveChangesAsync();
                return finded_product;
            }
            return null;
        }
        public async Task<List<ProductSize>> UpdateStock(int productId, List<ProductSize> sizes)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var dbSizes = await _context.ProductSizes
                    .Where(ps => ps.ProductId == productId)
                    .ToListAsync();

                var sizesToDelete = dbSizes
                    .Where(db => !sizes.Any(s => s.Size == db.Size))
                    .ToList();

                if (sizesToDelete.Any())
                {
                    _context.ProductSizes.RemoveRange(sizesToDelete);
                }
                foreach (var incomingSize in sizes)
                {
                    var existing = dbSizes.FirstOrDefault(db => db.Size == incomingSize.Size);

                    if (existing != null)
                    {
                        existing.Quantity = incomingSize.Quantity;
                    }
                    else
                    {
                        _context.ProductSizes.Add(new ProductSize
                        {
                            ProductId = productId,
                            Size = incomingSize.Size,
                            Quantity = incomingSize.Quantity
                        });
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return sizes;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Ошибка при обновлении склада: {ex.Message}");
                throw;
            }
        }
        public async Task<bool> DeleteProduct(int id)
        {
            Product? finded_product = await GetProductById(id);
            if (finded_product == null) return false;
            _context.Remove(finded_product);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAll()
        {
            _context.Products.RemoveRange(_context.Products);
            _context.ProductSizes.RemoveRange(_context.ProductSizes);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
