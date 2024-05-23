const config = require("../utils/config.dev.json");
module.exports = {
    secret: config.SECRET_KEY,
    azureStorageConfig: {
      connectionString: config.AZURE_STORAGE_CONNECTION_STRING,
      accountName: config.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: config.AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
      containerName: config.AZURE_STORAGE_CONTAINER_NAME,
      blobURL:
        "https://${config.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net",
    },
    expressPort: '9000',
  };