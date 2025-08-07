declare module 'swagger-ui-react' {
    import { FunctionComponent } from 'react';
    interface SwaggerUIProps {
        spec?: object;
        url?: string;
        [key: string]: any;
    }
    const SwaggerUI: FunctionComponent<SwaggerUIProps>;
    export default SwaggerUI;
}
