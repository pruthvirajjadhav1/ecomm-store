// User.find({ price: { gtr: 20 } });

// https://5l497n-8000.csb.app/api/v1/product?search=coder&page=2&cataguery=shortsleeve&rating[gte]=4

// This URL query is converted into this
/* 
{
  search: 'coder',
  page: '2',
  cataguery: 'shortsleeve',
  rating: { gte: '4' }
} 
*/
