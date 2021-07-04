import AWS from "aws-sdk";
import keygen from "keygenerator";

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET
    }
});

const Bucket = "zipstagram-uploads";
const bucketInstance = new AWS.S3();

export const uploadToS3 = async (file, userId, folderName) => {
    const { createReadStream } = await file;
    const readStream = createReadStream();
    const objectName = `${folderName}/${userId}-${Date.now()}-${keygen.number()}`;
    const { Location } = await bucketInstance.upload({
        Bucket,
        Key: objectName,
        ACL: "public-read",
        Body: readStream
    }).promise();
    return Location;
};

export const removeToS3 = async (fileUrl, folderName) => {
    const filePath = fileUrl.split(`/${folderName}/`)[1];
    await bucketInstance.deleteObject({
        Bucket: `${Bucket}/${folderName}`,
        Key: filePath
    }).promise();
};