const dashboardBusiness = require("../businessLogic/dashboardBusiness");
const adminBusiness = require("../../api/businesslogic/adminBusiness");

module.exports.getDashboardCount = (req, res) => {
  dashboardBusiness.getDashboardCount(req).then((result) => {
    res.json(result);
  });
};

module.exports.getConstantValue = (req, res) => {
  dashboardBusiness.getConstantValue(req).then((result) => {
    res.json(result);
  });
};
module.exports.addBankConfig = (req, res) => {
  dashboardBusiness.addBankConfig(req).then((result) => {
    res.json(result);
  });
};
module.exports.updateBankConfig = (req, res) => {
  dashboardBusiness.updateBankConfig(req).then((result) => {
    res.json(result);
  });
};

module.exports.getBankConfig = (req, res) => {
  dashboardBusiness.updateBankConfig(req).then((result) => {
    res.json(result);
  });
};
module.exports.getBankConfig = (req, res) => {
  dashboardBusiness.getBankConfig(req).then((result) => {
    res.json(result);
  });
};

module.exports.addBannerFile = (req, res) => {
  dashboardBusiness.addBannerFile(req).then((result) => {
    res.json(result);
  });
};
module.exports.addBrandDetails = (req, res) => {
  dashboardBusiness.addBrands(req).then((result) => {
    res.json(result);
  });
};

module.exports.deleteBannerFile = (req, res) => {
  dashboardBusiness.deleteBannerFile(req).then((result) => {
    res.json(result);
  });
};

module.exports.getBannerFile = (req, res) => {
  dashboardBusiness.getBannerFile(req).then((result) => {
    res.json(result);
  });
};
module.exports.addComercialConfig = (req, res) => {
  dashboardBusiness.addComercialConfig(req).then((result) => {
    res.json(result);
  });
};


module.exports.updateComercialConfig = (req, res) => {
  dashboardBusiness.updateComercialConfig(req).then((result) => {
    res.json(result);
  });
};

module.exports.getAllCommercialConfig = (req, res) => {
  dashboardBusiness.getAllCommercialConfig(req).then((result) => {
    res.json(result);
  });
};


// Method to get brands
module.exports.getBrands = (req, res) => {
  dashboardBusiness.getBrands(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to get deals
module.exports.getDeals = (req, res) => {
  dashboardBusiness.getDeals(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to get categories
module.exports.getCategoryDetails = (req, res) => {
  dashboardBusiness.getCategories(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};
module.exports.getTransactionDetails = (req, res) => {
  dashboardBusiness.getTransaction(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};
 

module.exports.getDetalsDetails = (req, res) => {
  dashboardBusiness.getDetalsDetails(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to add brands
module.exports.addBrands = (req, res) => {
  dashboardBusiness.addBrands(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to add deals
module.exports.addDeals = (req, res) => {
  adminBusiness.addOffer(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.updateDeals = (req, res) => {
  console.log({req});
  adminBusiness.updateOffer(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.getDealsById = (req, res) => {
  dashboardBusiness.getDealsById(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.deleteDealsById = (req, res) => {
  dashboardBusiness.deleteDealsById(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to add categories
module.exports.addCategories = (req, res) => {
  dashboardBusiness.addCategories(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to update brands
module.exports.updateBrands = (req, res) => {
  dashboardBusiness.updateBrands(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.getBrandsById = (req, res) => {
  dashboardBusiness.getBrandById(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.deleteBrandsById = (req, res) => {
  dashboardBusiness.deleteBrandsById(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to update categories
module.exports.updateCategories = (req, res) => {
  dashboardBusiness.updateCategories(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to update banners
module.exports.updateBanners = (req, res) => {
  dashboardBusiness.updateBanners(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};
// Method to update banners
module.exports.searchDeals = (req, res) => {
  dashboardBusiness.searchDeals(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};
// Method to update banners
module.exports.searchCategory = (req, res) => {
  dashboardBusiness.searchCategory(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

module.exports.getBrandName = (req, res) => {
  dashboardBusiness.getBrandName(req).then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({
      status: "500",
      data: [],
      error: error.message,
      message: "Internal server error",
    });
  });
};

module.exports.filterByBrand = (req, res) => {
  dashboardBusiness.filterByBrand(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};

// Method to update banners
module.exports.searchTransactions = (req, res) => {
  dashboardBusiness.searchTransactions(req)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        status: "500",
        data: [],
        error: error.message,
        message: "Internal server error",
      });
    });
};
