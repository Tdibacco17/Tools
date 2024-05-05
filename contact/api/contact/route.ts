import { template } from "@/utils/email/template";
import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

export interface FormRequestInterface {
    formValues: {
        name: string;
        lastname: string;
        phone: number;
        email: string;
        consultation: string;
    };
    radioValues: {
        comercio: string;
        logistica: string;
        gestion: string;
        administracion: string;
        turismo_profesional: string;
        vehiculos: string;
        otros: string;
        motocicletas: string;
    };
}

export async function POST(req: Request, response: Response) {
    const body = (await req.json()) as FormRequestInterface;

    const contentHtml = template(body);

    const transporter = nodemailer.createTransport({
        host: `${process.env.EMAIL_SERVICE}`,
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.EMAIL_USERNAME}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
        },
    });

    const mailOptions = {
        from: `${process.env.EMAIL_USERNAME}`,
        to: [`${process.env.EMAIL_USERNAME}`],
        subject: "Tienes un mensaje de Cerro Motor!",
        html: contentHtml,
    };

    const server = await new Promise((resolve, reject) => {
        transporter.verify(function (error: any, success: any) {
            if (success) {
                resolve(success);
            }
            reject(error);
        });
    });
    if (!server) {
        return NextResponse.json(
            { message: "Error setting up the transporter", status: 500 },
            { status: 500 }
        );
    }

    const success = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions).then((info: any, err: any) => {
            if (info.response.includes("250")) {
                resolve(true);
            }
            reject(err);
        });
    });
    if (!success) {
        return NextResponse.json(
            { message: "Error sending the email", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json({ message: "Message sent", status: 200 }, { status: 200 });
}
