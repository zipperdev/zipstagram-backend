import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.NODEMAILER_ADDRESS, 
        pass: process.env.NODEMAILER_KEY
    }
});

export const sendMail = (email, title, data) => {
    const options = {
        from: process.env.NODEMAILER_ADDRESS, 
        to: email, 
        subject: title, 
        html: data
    };
    transporter.sendMail(options);
};