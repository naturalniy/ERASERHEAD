using lynchism.DTO;
using lynchism.Models;
using lynchism.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace lynchism.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientController : Controller
    {
        private readonly ClientService _clientService;
        private readonly TokenService _tokenService;

        public ClientController(ClientService clientService, TokenService tokenService)
        {
            _clientService = clientService;
            _tokenService = tokenService;
        }
        [HttpGet("clients")]
        public async Task<ActionResult<List<Client>>> GetClients()
        {
            var clients = await _clientService.GetAll(); 
            return Ok(clients);
        }
        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult> GetClientById(int id)
        {
            Client? client = await _clientService.GetClientById(id);
            if (client == null) return BadRequest("Client was not finded");
            return Ok(client);
        }
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult> GetMe()
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out int id))
            {
                return Unauthorized("Не удалось идентифицировать пользователя.");
            }
            var user = await _clientService.GetClientById(id);
            if (user == null)
            {
                return NotFound("Пользователь не найден.");
            }
            return Ok(user);
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO client)
        {
            if (client == null) return BadRequest("Client is null");
            var newClient = await _clientService.RegisterCLient(client);
            if (newClient == null) return BadRequest("This email already used");

            var newToken =  _tokenService.GenerateToken(newClient);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            newClient.RefreshToken = newRefreshToken;
            newClient.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            if (!await _clientService.UpdateUserTokens(newClient))
            {
                return BadRequest("Error when UpdateUserTokens");
            }
            return Ok(new TokensDTO { AccessToken = newToken, RefreshToken = newRefreshToken });
        }
        [HttpPost("login")]
        public async Task<ActionResult> LoginClient(ClientLoginDTO credentials)
        {
            var client = await _clientService.ValidateUser(credentials);
            if (client == null) return Unauthorized();

            var newToken = _tokenService.GenerateToken(client);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            client.RefreshToken = newRefreshToken;
            client.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            if (!await _clientService.UpdateUserTokens(client))
            {
                return BadRequest("Error when UpdateUserTokens");
            }

            return Ok(new TokensDTO { AccessToken = newToken, RefreshToken = newRefreshToken });
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (await _clientService.DeleteClient(id)) return Ok();
            else return BadRequest("Client was not delete");

        }
        [HttpPost("refresh")]
        public async Task<ActionResult> RefreshToken(TokensDTO tokensDTO)
        {
            var client = await _clientService.IsRefreshTokenOk(tokensDTO.RefreshToken);
            if (client == null || client.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid refresh token");
            }

            var principal = _tokenService.GetPrincipalFromExpiredToken(tokensDTO.AccessToken);
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != client.Id.ToString())
            {
                return Unauthorized("User mismatch or bad refresh token");
            }

            var newToken = _tokenService.GenerateToken(client);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            client.RefreshToken = newRefreshToken;
            client.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            if (!await _clientService.UpdateUserTokens(client))
            {
                return BadRequest("Error when UpdateUserTokens");
            }

            return Ok(new TokensDTO { AccessToken = newToken, RefreshToken = newRefreshToken });
        }
    }
}
