// base - Product.find()
// base - Product.find(email:{"pruthivrajjadhav1@gmail.com"})

// bigQ - search=coder&page=2&cataguery=shortsleeve&rating[gte]=4&price[lte]=999&price[gte]=199

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    // Here we checking if the bigQ has "search" word
    const searchWord = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });
    return this;
  }

  pager(resultperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    const skipVal = resultperPage * (currentPage - 1);

    this.base = this.base.limit(resultperPage).skip(skipVal); // limit and skip are mongoose func to set a limit on per page and skip the result which has alredy shown
    return this;
  }
}
