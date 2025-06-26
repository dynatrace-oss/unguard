import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import React from 'react';

import { DeploymentDetails } from '@/hooks/queries/useDeploymentHealth';

export interface DeploymentHealthTableProps {
    tableData: DeploymentDetails[];
}

export function DeploymentHealthTable(props: DeploymentHealthTableProps) {
    return (
        <Table
            aria-label='Deployment Health Table'
            classNames={{
                base: 'overflow-scroll',
                table: 'min-h-[400px]',
            }}
        >
            <TableHeader>
                <TableColumn key='microservice' className='text-default-800 text-medium'>
                    Microservice
                </TableColumn>
                <TableColumn key='status' className='text-default-800 text-medium'>
                    Status
                </TableColumn>
                <TableColumn key='availableReplicas' className='text-default-800 text-medium'>
                    Available Replicas
                </TableColumn>
            </TableHeader>
            <TableBody items={props.tableData}>
                {(item) => (
                    <TableRow key={item.microservice}>
                        {(columnKey) => (
                            <TableCell
                                className={
                                    columnKey === 'status' ? (item.isHealthy ? 'text-success' : 'text-danger') : ''
                                }
                            >
                                {getKeyValue(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
