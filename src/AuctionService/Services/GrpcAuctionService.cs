using AuctionService.Data;
using Grpc.Core;

namespace AuctionService.Services;

public class GrpcAuctionService(AuctionDbContext dbContext) : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbContext _dbContext = dbContext;

    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        Console.WriteLine("GrpcAuction called with id: " + request.Id);
        
        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id)) ?? throw new RpcException(new Status(StatusCode.NotFound, "Auction not found"));
        
        var response = new GrpcAuctionResponse
        {
            //Status = GrpcAuctionResponse.Types.Status.Success,
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice.ToString(),
                Seller = auction.Seller,
            }
        };

        return response;
    }
}
