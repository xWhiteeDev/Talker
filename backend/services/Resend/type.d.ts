interface IResendConfiguration {
    from: string | null;
    API_KEY: string | null;
}
interface IResend {
    send(subject: string, htmlContent: string,plainText: string, to: string): Promise<boolean>;
}

export type {IResendConfiguration, IResend};