import AWS from "aws-sdk";
interface ContactDetails {
  baseUrl: string;
  email: string;
  htmlMessage: string;
  id: string;
  name: string;
  textMessage: string;
  title: string;
}
export const sendEmail = async ({
  baseUrl,
  email,
  htmlMessage,
  id,
  name,
  textMessage,
  title,
}: ContactDetails): Promise<void> => {
  const ses = new AWS.SES({ region: "us-west-2" });
  await ses
    .sendEmail(
      sendEmailParams({
        baseUrl,
        email,
        htmlMessage,
        id,
        name,
        textMessage,
        title,
      })
    )
    .promise();
};

const sendEmailParams = ({
  baseUrl,
  email,
  htmlMessage,
  id,
  name,
  textMessage,
  title,
}: ContactDetails) => {
  return {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: getHtmlContent({ baseUrl, id, name, htmlMessage }),
        },
        Text: {
          Charset: "UTF-8",
          Data: getTextContent({ baseUrl, id, name, textMessage }),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: title,
      },
    },
    Source: "no-reply@proved.xyz",
  };
};

function getHtmlContent({
  baseUrl,
  id,
  name,
  htmlMessage,
}: {
  baseUrl: string;
  id: string;
  name: string;
  htmlMessage: string;
}) {
  return `
    <html>
      <head>
        <style>
        p { font-size:14px; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <p>Hi ${name},</p>
        ${htmlMessage}
        <p> </p>
        <p>Cheers,</p>
        <p>Proved Team</p>
        <p></p>
        <p style="font-size:10px;color:gray">We hope you found this message to be useful. If you don't want to receive these emails from Proved in the future, please <a class="ulink" href="${baseUrl}/unsubscribe?id=${id}" target="_blank">unsubscribe</a>.</p>
      </body>
    </html>
  `;
}

function getTextContent({
  baseUrl,
  id,
  name,
  textMessage,
}: {
  baseUrl: string;
  id: string;
  name: string;
  textMessage: string;
}) {
  return `Hi ${name},

${textMessage}

Cheers,
Proved Team

We hope you found this message to be useful. If you don't want to receive these emails from Proved in the future, please unsubscribe from ${baseUrl}/unsubscribe?id=${id}

`;
}
