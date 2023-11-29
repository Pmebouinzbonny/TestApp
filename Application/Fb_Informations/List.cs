using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Fb_Information>> { } // 

        public class Handler : IRequestHandler<Query, List<Fb_Information>>
        {
            private readonly DataContext _context;

            // constructor to enter the datatbase
            public Handler(DataContext context)
            {
                _context = context;

            }


            // return a List of Informations
            public async Task<List<Fb_Information>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Fb_Informations.ToListAsync();
            }
        }
    }
}