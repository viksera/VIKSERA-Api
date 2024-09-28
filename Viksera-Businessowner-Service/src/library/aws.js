const { PutObjectCommand, S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

class AWS {

    s3Client = new S3Client({
        endpoint: process.env.AWS_ENDPOINT ,
        forcePathStyle: true, // Required for LocalStack
        region: process.env.AWS_REGION, 
        credentials: {
            accessKeyId: process.env.AWS_ACCESSKEY_ID, 
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    /**
     * Upload Object to AWS S3
     * @param {string} bucketName 
     * @param {string} Key 
     * @param {string} filePath 
     */
    async uploadToS3(bucketName, key, filePath) {
        key = `banners/${key}`;
        console.log({
            endpoint: process.env.AWS_ENDPOINT ,
            forcePathStyle: true, // Required for LocalStack
            region: process.env.AWS_REGION, 
            credentials: {
                accessKeyId: process.env.AWS_ACCESSKEY_ID, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        })
        try {
            const fileName = key;

            const fileContent = fs.readFileSync(filePath);

            const uploadParams = {
                Bucket: bucketName,    // S3 bucket name
                Key: fileName,         // The key (file name) to save the image as
                Body: fileContent,     // The file's binary data
                ContentType: 'image/png', // MIME type 
                ACL: 'public-read', 
            };

            const command = new PutObjectCommand(uploadParams);
            const data = await this.s3Client.send(command);
            const url = `http://localhost:4566/${bucketName}/${fileName}`;
            console.log(`Image uploaded successfully. ETag: ${data.ETag} , ${data}`);
            return url;

        } catch (error) {
            console.error('Error uploading image TO AWS S3:', error);
            return false;
        }           
    }

    /**
     * 
     * @param {string} objectKey Object key to be deleted from S3
     * @returns 
     */
    async deleteFromS3(objectKey) {
        try {
            const key = `banners/${objectKey}`;
            const params = { Bucket: process.env.AWS_BUCKET, Key: key };
            const deleteObjectCommand = new DeleteObjectCommand(params);
            const data = await this.s3Client.send(deleteObjectCommand);
            console.log("Success. Object deleted From S3 ", params, data);
            return data; 
        } catch (error) {
            console.log("error delete objecting from S3" , error);
            return false;
            
        }
    }

}

module.exports = new AWS();

