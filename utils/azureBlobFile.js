const {
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobServiceClient,
  newPipeline,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  AccountSASPermissions,
} = require("@azure/storage-blob");

// const getStream = require("into-stream");

const uuid = require("uuid");

const config = require("./config");
const logger = require("./logger");


const { setLogLevel } = require("@azure/logger");
setLogLevel("info");

// Use StorageSharedKeyCredential with storage account and account key

const { Readable } = require('stream');

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null); // Signals the end of the stream
  return readable;
}

// Usage:
// const buffer = Buffer.from('your buffer content');
// const stream = bufferToStream(buffer);

const getBlobName = (file,ticketModule,timestamp) => {
  logger.info(`file ${file}`)
  const fileName = `${timestamp}-${file.originalname}`
  // const fileName =
  //   Date.now() + "-" + uuid.v4() + path.extname(file.originalname);
  return fileName;
};

// Define your Azure Blob Storage credentials
const accountName = "onerupeestorefesg";
const accountKey =
  "xoGHrEgYZH2/4th5AFV3qM1myWtrNvSYUDLv81jCCfoDYyHOKC09niphhGApVnxWAe5qAhy/0ABu+AStyii7mQ==";

// Create a shared key credential
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

// logger.info({sharedKeyCredential})
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
  logger.info(`buffer, blobName, containerName, file_type | ${buffer, blobName, containerName, file_type}`)
  try {
    // const blobServiceClient = BlobServiceClient.fromConnectionString('BlobEndpoint=https://onerupeestorefesg.blob.core.windows.net/;QueueEndpoint=https://onerupeestorefesg.queue.core.windows.net/;FileEndpoint=https://onerupeestorefesg.file.core.windows.net/;TableEndpoint=https://onerupeestorefesg.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2024-03-15T03:42:44Z&st=2024-03-14T19:42:44Z&spr=https&sig=7oBImTM5GmOGyvLXe1d8Z2vvqg%2BA1Npa1ndGABcyCvo%3D');

    logger.info({ buffer, blobName, containerName, file_type });
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
  logger.info("xx",blob.name);
}

    logger.info("Image uploaded to:", blobUrl);
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

    logger.info(`Blob "${blobName}" downloaded to "${downloadFilePath}"`);
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

    logger.info(`Blob "${blobName}" deleted successfully.`);
  } catch (error) {
    console.error(error.message);
  }
}

async function uploadFile(fileData, blobName, file_type) {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  logger.info({fileData,blobName});
  // Convert base64 data to a Buffer
  // const bufferData = Buffer.from(base64Data, 'base64');

  // const uploadResponse = await blockBlobClient.upload(bufferData, bufferData.length, {
  //     blobHTTPHeaders: {
  //         blobContentType: file_type // Adjust content type as per your file
  //     }
  // });

  // const response = await fetch(fileData);
  // Fetch the file content from the Blob URL
  // const response = await fetch(fileData)
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   return response.blob();
  // })
  // .then(blobData => {
  //   // Handle the blob data, for example, upload it to Azure Blob Storage
  //   logger.info('Blob data:', blobData);
  // })
  // .catch(error => {
  //   console.error('Error fetching file:', error);
  // });

  // logger.info({response});
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch the file from URL: ${url}`);
  // }

  // const fileStream = fs.createWriteStream(blobName);
  // await new Promise((resolve, reject) => {
  //   response.body.pipe(fileStream);
  //   response.body.on("error", reject);
  //   fileStream.on("finish", resolve);
  // });

  // const uploadResponse = await blockBlobClient.uploadFile(blobName);

  // logger.info(`Uploaded file "${blobName}" from URL "${uploadResponse}" successfully.`);
  await blockBlobClient.upload(fileData, fileData.length);

    logger.info(`Blob "${blobName}" uploaded to container "${CONTAINER_NAME}" successfully.`);
  logger.info({ blobName });

  // logger.info(`Uploaded file "${filePath}" successfully.`);
  return blobName;
}
async function downloadFile(blobName, downloadFilePath, containerName) {
  try {
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Download the blob to a local file
    await blockBlobClient.downloadToFile(downloadFilePath);

    logger.info(`Blob "${blobName}" downloaded to "${downloadFilePath}"`);
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

    logger.info(`Blob "${blobName}" deleted successfully.`);
  } catch (error) {
    console.error(error.message);
  }
}



async function uploadFilesToBlob(req) {
  // logger.info("sksksksk---->",req);
  const { file_data,timestamp,folder } = req
  
  ticketModule = folder;
  const  file  = file_data;
  // const containerName = bankName?.toLowerCase();
  const containerName = ticketModule?.toLowerCase();
  const directoryPath = "/";
  var promiseList = [];

  // logger.info("Arshad===>", file);
  const sharedKeyCredential = new StorageSharedKeyCredential(
    config.azureStorageConfig.accountName,
    config.azureStorageConfig.accountKey
  );

  const pipeline = newPipeline(sharedKeyCredential, {
    // httpClient: MyHTTPClient, // A customized HTTP client implementing IHttpClient interface
    retryOptions: { maxTries: 4 }, // Retry options
    userAgentOptions: { userAgentPrefix: "Blob Upload" }, // Customized telemetry string
    keepAliveOptions: {
      // Keep alive is enabled by default, disable keep alive by setting false
      enable: false,
    },
  });

  const blobServiceClient = new BlobServiceClient(
    `https://${config.azureStorageConfig.accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );



  logger.info({ config });


  // Create a container
  // const containerName = containerName ? containerName : `newcontainer${new Date().getTime()}`
  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    await containerClient.createIfNotExists();
  } catch (err) {
    logger.info("error", err);
    logger.info(
      `Creating a container fails, requestId - ${err.details.requestId}, statusCode - ${err.statusCode}, errorCode - ${err.details.errorCode}`
    );
  }

  // logger.info("===>Files",JSON.stringify(file));


  file?.forEach((file) => {
    // logger.info("===>",{ file });
    const blobName = getBlobName(file,ticketModule,timestamp);
    // const stream = getStream(file.buffer).require("into-stream");
    const stream = bufferToStream(file.buffer);
    const streamLength = file.buffer.length;
    const blobNamewithFolder = directoryPath
      ? `${directoryPath}/${blobName}`
      : `${blobName}`;
    logger.info("blobNamewithFolder", blobNamewithFolder);
    promiseList.push(
      new Promise((resolve, reject) => {
        // Create a blob
        //const blobName = "newblob" + new Date().getTime();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Parallel uploading a Readable stream with BlockBlobClient.uploadStream() in Node.js runtime
        // BlockBlobClient.uploadStream() is only available in Node.js
        try {
          blockBlobClient.uploadStream(stream, 4 * 1024 * 1024, 20, {
            // abortSignal: AbortController.timeout(30 * 60 * 1000), // Abort uploading with timeout in 30mins
            onProgress: (ev) => logger.info("progress", ev),
          });

          let startDateTime = new Date();
          startDateTime.setMinutes(startDateTime.getMinutes() - 5);

          let endDateTime = new Date();
          endDateTime.setMinutes(endDateTime.getMinutes() + 45);

          const sasOptions = {
            containerName: containerName,
            blobName: blobName,
            startsOn: startDateTime,
            expiresOn: endDateTime,
            permissions: BlobSASPermissions.parse("r"),
            protocol: SASProtocol.Https,
          };
          let blobUrl = `https://${config.azureStorageConfig.accountName}.blob.core.windows.net/${containerName}/${blobName}`;
          setTimeout(function () {
            const sasToken = generateBlobSASQueryParameters(
              sasOptions,
              sharedKeyCredential
            ).toString();
            // blobUrl += `?${sasToken}`;
            resolve({
              filename: blobName,
              originalname: file.originalname,
              size: streamLength,
              path: `${containerName}/${blobName}`,
              url: blobUrl,
            });
          }, 2500);
        } catch (err) {
          logger.info("error sssss", err);
          logger.info(
            `uploadStream failed, requestId ssssss- ${err.details.requestId}, statusCode - ${err.statusCode}, errorCode - ${err.details.errorCode}`
          );
          resolve({err});
        }
      })
    );
  });
  return Promise.all(promiseList).then((values) => {
    return values;
  });
}; 

module.exports = { downloadFile, uploadFile, deleteBlob,uploadFilesToBlob };