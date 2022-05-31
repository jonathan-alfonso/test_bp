import { IAddress } from 'app/entities/address/address.model';

export interface IPerson {
  id?: number;
  first_name?: string | null;
  last_name?: string | null;
  age?: number | null;
  address?: IAddress | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public first_name?: string | null,
    public last_name?: string | null,
    public age?: number | null,
    public address?: IAddress | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
