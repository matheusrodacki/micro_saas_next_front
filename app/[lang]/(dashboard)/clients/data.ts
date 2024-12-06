export interface DataRows {
  client_id: number;
  client_type: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  individual: {
    client_id: number;
    full_name: string;
    social_security_number: string;
    date_of_birth: string;
  } | null;
  company: {
    client_id: number;
    company_name: string;
    tax_id_number: string;
    contact_person: string;
  } | null;
}

export async function fetchClients(token: string) {
  try {
    const response = await fetch('https://api.mrrodz.com/clients', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}
