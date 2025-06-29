import  nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // For environment variables
dotenv.config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    // For other services or custom SMTP, you might use:
    // host: 'smtp.example.com',
    // port: 587, // or 465 for SSL
    // secure: false, // true for 465, false for other ports (like 587)
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password or email password from .env
    },
});


//html is he content of the email
//to is the recipient email address
//subject is the subject of the email
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `REDDIT <${process.env.EMAIL_USER}>`,
            to,       // Recipient email
            subject,  // Email subject
            html,     // HTML content of the email
        });
        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return false;
    }
};

export default sendEmail;