import axios from "axios";
import { emailVerificationTemplate } from "src/email/verification";

export class Email {
    static sendVerificationEmail = async (email: string, verificationKey: string) => {
        try {
            const request = await axios.post("https://api.brevo.com/v3/smtp/email", {
                sender: {
                    "name": "",
                    "email": ""
                },
                to: [
                    {
                        email: "",
                        name: ""
                    }
                ],
                subject: "Hello world",
                htmlContent: emailVerificationTemplate(verificationKey),
            }, {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    'content-type': 'application/json',
                    accept: 'application/json'
                }
            });
            return request.data;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
}

