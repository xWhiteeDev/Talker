import * as resend from 'resend';
import type {IResend, IResendConfiguration} from './type.js';
import {config} from 'dotenv';

config();

const resendConfig: IResendConfiguration = {
    from: process.env['TALKER_RESEND_FROM'] ?? null,
    API_KEY: process.env['TALKER_RESEND_API_KEY'] ?? null
};


class Resend implements IResend {
    private from: string | null;
    private apikey: string | null;
    private instance: resend.Resend | undefined;
    constructor(configuration: IResendConfiguration) {
        this.from = configuration.from;
        this.apikey = configuration.API_KEY;
        if (!this.from || !this.apikey) {
            console.error('[Resend] Resend will not work without key env options.');
            return;
        };
        this.instance = new resend.Resend(this.apikey);
    }
    async send(subject: string, htmlContent: string, plainText: string, to: string): Promise<boolean> {
        if (!this.instance || !this.from) return false
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