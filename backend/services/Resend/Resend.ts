import * as resend from 'resend';
import type {IResend, IResendConfiguration} from './type.js';
import {resendConfig} from './tempCfg.js';


class Resend implements IResend {
    private from: string;
    private apikey: string;
    private instance: resend.Resend;
    constructor(configuration: IResendConfiguration) {
        this.from = configuration.from;
        this.apikey = configuration.API_KEY;
        this.instance = new resend.Resend(this.apikey);
    }
    async send(subject: string, htmlContent: string, plainText: string, to: string): Promise<boolean> {
        if (typeof htmlContent !== 'string' || htmlContent.trim().length === 0 || typeof to !== 'string' || to.trim().length === 0) {
            throw new Error('Content or to argument invalid');
        }
        const {error} = await this.instance.emails.send({
            from: this.from,
            to: to,
            subject: subject,
            html: htmlContent,
            text: plainText
        });
        if (error) {
            throw new Error(error.message);
        }
        return true;
    }
}

export const Emailer = new Resend(resendConfig);