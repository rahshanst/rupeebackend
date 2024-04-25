const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const fs = require("fs");
const { log } = require("winston");

// Define your Azure Blob Storage credentials
const accountName = "onerupeestorefesg";
const accountKey =
  "xoGHrEgYZH2/4th5AFV3qM1myWtrNvSYUDLv81jCCfoDYyHOKC09niphhGApVnxWAe5qAhy/0ABu+AStyii7mQ==";

// Create a shared key credential
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

// console.log({sharedKeyCredential})
// Create a blob service client
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// DefaultEndpointsProtocol = https;
// AccountName = ticketbookingadminstage;
// AccountKey = icHHTelyZRDD80MzfglkcJ1zCHhjqEpOzLX9A7Wo8 + BPGZ2U + lIPSaqDnOkosL4bZkOujDw25FYN + AStUU5Qeg ==;
// EndpointSuffix = core.windows.net

async function uploadFile(buffer, blobName, containerName, file_type) {
  try {
    // const blobServiceClient = BlobServiceClient.fromConnectionString('BlobEndpoint=https://onerupeestorefesg.blob.core.windows.net/;QueueEndpoint=https://onerupeestorefesg.queue.core.windows.net/;FileEndpoint=https://onerupeestorefesg.file.core.windows.net/;TableEndpoint=https://onerupeestorefesg.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2024-03-15T03:42:44Z&st=2024-03-14T19:42:44Z&spr=https&sig=7oBImTM5GmOGyvLXe1d8Z2vvqg%2BA1Npa1ndGABcyCvo%3D');

    console.log({ buffer, blobName, containerName, file_type });
    // sharedBlobService.createContainerIfNotExists('mycontainer', function(error, result, response){if(!error){}});
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container if it does not exist
    await containerClient.createIfNotExists();

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload data to the blob
    await blockBlobClient.upload(buffer, buffer.length, { blobHTTPHeaders: { blobContentType: file_type } });


    // Get URL for the saved image
    const blobUrl = blockBlobClient.url;
    // Construct the blob service client with SAS token
const blobServiceClientWithSAS = new BlobServiceClient(`https://onerupeestorefesg.blob.core.windows.net/category?sp=r&st=2024-03-14T19:45:12Z&se=2024-03-15T03:45:12Z&sv=2022-11-02&sr=c&sig=dER5F506MCdqZa9vy%2F6i63Vv2%2FU95qNAcrk%2FZGBoqO8%3D`);
const containerClientSAS = blobServiceClientWithSAS.getContainerClient(containerName);

// Access the container

// List blobs in the container
for await (const blob of containerClient.listBlobsFlat()) {
  console.log("xx",blob.name);
}

    console.log("Image uploaded to:", blobUrl);
    return blobUrl;
  } catch (error) {
    console.error(error.message);
  }
}

async function downloadFile(blobName, downloadFilePath, containerName) {
  try {
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Download the blob to a local file
    await blockBlobClient.downloadToFile(downloadFilePath);

    console.log(`Blob "${blobName}" downloaded to "${downloadFilePath}"`);
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteBlob(blobName, containerName) {
  try {
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    await blockBlobClient.delete();

    console.log(`Blob "${blobName}" deleted successfully.`);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { downloadFile, uploadFile, deleteBlob };
