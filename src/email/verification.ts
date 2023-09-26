


export const emailVerificationTemplate = (verificationKey: string): string => {
    const template = `  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <body style="
    background: rgba(251, 167, 251, 0.09);
    font-family: 'Lato', sans-serif;">
    
        <div style=" max-width: 600px;
        border-radius: 10px;
        height: 400px;
        border: 1px solid rgba(0, 0, 0, 0.121);
        margin: auto;
        background: white;
        flex-direction: column;">
            <h1 style=" text-align: center;
            font-size: 20px;
            color: rgb(26, 26, 26);
            margin-top: 40px;">Thanks for creating your account</h1>
            <div style="
             width: 100%;
            display: flex;">
                <img style="   
                max-width: 100px;
                margin-top: 30px;
                margin: auto;" src="https://cdn-icons-png.flaticon.com/512/9840/9840614.png" alt="email_vector">
            </div>
            <div class="">
                <p style=" text-align: center;">we can't wait seeing you interacting with our chatbot 😌</p>
            </div>
            <p style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:3000/auth/verify/${verificationKey}" style="
                    width: 200px;
                    margin: auto;
                    text-decoration: none;        
                    color: aliceblue;
                    width: 200px;
                    background-color: #4CAF50;
                    text-align: center; 
                    padding: 10px; 
                    border-radius: 5px;">
                    click her to verify
                </a>
            </p>
        </div>
    </body>
    </html>`;

    return template;
}
