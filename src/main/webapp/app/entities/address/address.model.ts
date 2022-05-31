export interface IAddress {
  id?: number;
  street?: string | null;
  zip?: string | null;
  city?: string | null;
}

export class Address implements IAddress {
  constructor(public id?: number, public street?: string | null, public zip?: string | null, public city?: string | null) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
