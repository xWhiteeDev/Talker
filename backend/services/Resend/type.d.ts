interface IResendConfiguration {
    from: string;
    API_KEY: string;
}
interface IResend {
    send(subject: string, htmlContent: string,plainText: string, to: string): Promise<boolean>;
}

export type {IResendConfiguration, IResend};