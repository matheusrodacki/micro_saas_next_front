'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchClients, DataRows } from './data';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

const ClientsTable = () => {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState<DataRows[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getClients = async () => {
      if (status === 'loading') {
        return;
      }
      if (!session?.accessToken) {
        setError('Token de autenticação não encontrado.');
        return;
      }
      try {
        const data = await fetchClients(session.accessToken);
        setClients(data);
      } catch (err) {
        setError('Não foi possível buscar os clientes.');
      }
    };

    getClients();
  }, [session, status]);

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {clients.map((item: DataRows) => (
          <TableRow key={item.client_id} className="hover:bg-muted">
            <TableCell className="  font-medium  text-card-foreground/80">
              {item.client_id}
            </TableCell>

            <TableCell>{item.client_type}</TableCell>
            <TableCell>
              {item.client_type === 'individual'
                ? item.individual?.full_name ?? 'N/A'
                : item.company?.company_name}
            </TableCell>
            <TableCell>
              <Badge
                variant="soft"
                color={
                  (item.status === 'admin' && 'default') ||
                  (item.status === 'active' && 'success') ||
                  (item.status === 'owner' && 'info') ||
                  (item.status === 'editor' && 'warning') ||
                  'default'
                }
                className=" capitalize">
                {item.status}
              </Badge>
            </TableCell>

            <TableCell className="flex justify-end">
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  color="secondary"
                  className="h-7 w-7">
                  <Icon icon="heroicons:pencil" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  color="secondary">
                  <Icon icon="heroicons:eye" className=" h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary">
                  <Icon icon="heroicons:trash" className=" h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
