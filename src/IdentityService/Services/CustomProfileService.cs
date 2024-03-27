using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace IdentityService.Services;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        if (user == null)
        {
            throw new ArgumentException("User is null in ProfileDataRequestContext");
        }
        var existingClaims = await _userManager.GetClaimsAsync(user);

        if(user.UserName is null)
        {
            throw new ArgumentException("User name is null in ProfileDataRequestContext");
        }

        var claims = new List<Claim>
        {
            new Claim("username", user.UserName)
        };

        context.IssuedClaims.AddRange(claims);
        var existing = existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name);
        if (existing != null)
        {
            context.IssuedClaims.Add(existing);
        }
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
        return Task.CompletedTask;
    }
}
