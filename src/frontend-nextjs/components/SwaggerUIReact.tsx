'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
    spec: Record<string, any>;
};

const HideAuthorizePlugin = () => ({
    components: {
        authorizeBtn: () => null,
    },
});

const HideTryItOutPlugin = () => ({
    components: {
        TryItOutButton: () => null,
    },
});

function ReactSwagger({ spec }: Props) {
    const specWithoutServers = { ...spec };
    delete specWithoutServers.servers;

    return <SwaggerUI spec={specWithoutServers} plugins={[HideAuthorizePlugin, HideTryItOutPlugin]} />;
}

export default ReactSwagger;
