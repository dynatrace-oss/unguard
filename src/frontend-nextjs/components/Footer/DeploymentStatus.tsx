import React from 'react';
import {
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from '@heroui/react';
import { ErrorBoundary } from 'react-error-boundary';

import { useDeploymentHealth } from '@/hooks/queries/useDeploymentHealth';
import { ErrorCard } from '@/components/ErrorCard';
import { DeploymentHealthTable } from '@/components/Footer/DeploymentHealthTable';

function DeploymentStatusComponent() {
    const { deploymentHealthData, isLoading } = useDeploymentHealth();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    if (isLoading) return <Spinner />;

    return (
        <div>
            <Button
                className='underline cursor-pointer text-medium'
                color={
                    deploymentHealthData.availableDeployments === deploymentHealthData.totalDeployments
                        ? 'success'
                        : 'danger'
                }
                variant='light'
                onPress={onOpen}
            >
                {deploymentHealthData.availableDeployments == deploymentHealthData.totalDeployments
                    ? 'App is healthy'
                    : `${deploymentHealthData.availableDeployments}/${deploymentHealthData.totalDeployments} deployments available`}
            </Button>
            <Modal isOpen={isOpen} size='xl' onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='pl-10 pt-8'>
                                <h2 className='text-2xlxl font-semibold text-default-800'>App Health</h2>
                            </ModalHeader>
                            <ModalBody>
                                <DeploymentHealthTable tableData={deploymentHealthData.deploymentDetails} />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export function DeploymentStatus() {
    return (
        <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
            <DeploymentStatusComponent />
        </ErrorBoundary>
    );
}
