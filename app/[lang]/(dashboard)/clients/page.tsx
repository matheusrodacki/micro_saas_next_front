'use client';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ClientsTable from './clientsTable';
const ClientsPage = () => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Menu</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Clients</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientsPage;
