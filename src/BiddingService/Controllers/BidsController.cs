using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);
        if (auction == null)
        {
            return NotFound();
        }

        if (auction.Seller == User.Identity.Name)
        {
            return BadRequest("Seller cannot bid on their own auction");
        }

        //if (auction.Finished)
        //{
        //    return BadRequest("Auction is already finished");
        //}

        //if (amount < auction.ReservePrice)
        //{
        //    return BadRequest("Bid amount is below reserve price");
        //}

        var bid = new Bid
        {
            AuctionId = auctionId,
            Bidder = User.Identity.Name,
            Amount = amount,
        };

        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }
        else
        {
            var highBid = await DB.Find<Bid>()
                .Match(b => b.AuctionId == auctionId)
                .Sort(b => b.Descending(x => x.Amount))
                .ExecuteFirstAsync();

            if (highBid == null || highBid != null && amount > highBid.Amount )
            {
                bid.BidStatus = amount > auction.ReservePrice
                    ? BidStatus.Accepted
                    : BidStatus.AcceptedBelowReserve;
            }

            if (highBid != null && amount <= highBid.Amount )
            {
                bid.BidStatus = BidStatus.TooLow;
            }
        }



        await bid.SaveAsync();
        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDto>(bid));
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsForAuction(string auctionId)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);
        if (auction == null)
        {
            return NotFound();
        }

        var bids = await DB.Find<Bid>()
            .Match(b => b.AuctionId == auctionId)
            .Sort(b => b.Descending(x => x.BidTime))
            .ExecuteAsync();

        return bids.Select(_mapper.Map<BidDto>).ToList();
    }
}
