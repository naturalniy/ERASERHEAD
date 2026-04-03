using lynchism.Models;
using lynchism.Services;
using lynchism.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace lynchism.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController: Controller
    {
        private readonly OrderService _orderService;
        public OrderController(OrderService orderService) {
            _orderService = orderService;
        }

        [Authorize]
        [HttpGet("getOrders")]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out int id))
            {
                return Unauthorized("Не удалось идентифицировать пользователя.");
            }
            List<OrderDTO> finded_orders = await _orderService.GetOrderByClientId(id);
            if (finded_orders == null || !finded_orders.Any())
                return NotFound("You dont have orders yet");
            return Ok(finded_orders);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getAllOrders")]
        public async Task<ActionResult<PagedResult<OrderDTO>>> GetAllOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var allOrders = await _orderService.GetAllOrdersPaged(page, pageSize);
            if (allOrders == null || !allOrders.Items.Any())
            {
                return NotFound("В системе пока нет ни одного заказа.");
            }
            return Ok(allOrders);
        }
        [Authorize]
        [HttpGet("getOrder/{orderId}")]
        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out int id))
            {
                return Unauthorized("Не удалось идентифицировать пользователя.");
            }
            Order? finded_order = await _orderService.GetOrder(orderId,id);
            if (finded_order == null)
                return NotFound("");
            return Ok(finded_order);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getOrderById/{orderId}")]
        public async Task<ActionResult<Order>> GetOrderById(int orderId)
        {
            Order? finded_order = await _orderService.GetOrderByOrderId(orderId);
            if (finded_order == null)
                return NotFound("");
            return Ok(finded_order);
        }
        [HttpPost("create_order")]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out int id))
            {
                return Unauthorized("Не удалось идентифицировать пользователя.");
            }
            Order? currentOrder = await _orderService.CreateOrderFromCart(orderDto, id);
            if (currentOrder != null) return currentOrder;
            return BadRequest("Error with attempt to create order");
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("update_status")]
        public async Task<ActionResult> UpdateStatus(int orderId)
        {
            string? currentStatus = await _orderService.GetOrderStatus(orderId);
            if (currentStatus == null) return BadRequest("Order wasnt found");
            if (currentStatus == "Pending") return Ok(await _orderService.UpdateOrderStatus(orderId,"Shipped"));
            return Ok(await _orderService.UpdateOrderStatus(orderId, "Completed"));
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete_order")]
        public async Task<ActionResult> DeleteOrder(int orderId)
        {
            bool result = await _orderService.DeleteOrder(orderId);
            if (!result) return BadRequest("Error with delete order");
            return Ok($"Order with id[{orderId}] has been deleted");
        }
    }
}
