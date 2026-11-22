import { Card, Form } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';

import { listProductsOptions } from '../client/inventory/@tanstack/react-query.gen';
import { listHouseholdsOptions } from '../client/identity/@tanstack/react-query.gen';

export const Component = () => {
  const [activeHouseholdId, setActiveHouseholdId] = useState<string>();
  const {
    data: households,
    isPending: isHouseholdPending,
    error: householdError
  } = useQuery(listHouseholdsOptions());
  const { data: products, error } = useQuery({
    ...listProductsOptions({
      path: { householdId: activeHouseholdId! }
    }),
    enabled: Boolean(activeHouseholdId)
  });
  const handleActiveHouseholdChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => setActiveHouseholdId(e.target.value),
    []
  );

  if (isHouseholdPending) return <p>Loading…</p>;
  if (error || householdError)
    return (
      <p>
        Couldn&apos;t load inventory ({error?.status ?? householdError?.status})
      </p>
    );

  return (
    <Fragment>
      <title>Pantry - Inventory</title>
      <Card body>
        <Form.Select onChange={handleActiveHouseholdChange}>
          <option selected value="">
            Select One
          </option>
          {households?.map((household) => (
            <option key={household.id} value={household.id}>
              {household.name} ({household.memberCount} members)
            </option>
          ))}
        </Form.Select>
      </Card>
      <Card body>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Low Stock</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                  {(product.quantity as number) <
                  (product.lowStockThreshold as number)
                    ? 'Yes'
                    : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Fragment>
  );
};
