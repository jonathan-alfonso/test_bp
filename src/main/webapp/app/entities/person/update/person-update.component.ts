import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPerson, Person } from '../person.model';
import { PersonService } from '../service/person.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

@Component({
  selector: 'jhi-person-update',
  templateUrl: './person-update.component.html',
})
export class PersonUpdateComponent implements OnInit {
  isSaving = false;

  addressesSharedCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    first_name: [],
    last_name: [],
    age: [],
    address: [],
  });

  constructor(
    protected personService: PersonService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      this.updateForm(person);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const person = this.createFromForm();
    if (person.id !== undefined) {
      this.subscribeToSaveResponse(this.personService.update(person));
    } else {
      this.subscribeToSaveResponse(this.personService.create(person));
    }
  }

  trackAddressById(_index: number, item: IAddress): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(person: IPerson): void {
    this.editForm.patchValue({
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      age: person.age,
      address: person.address,
    });

    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesSharedCollection, person.address);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));
  }

  protected createFromForm(): IPerson {
    return {
      ...new Person(),
      id: this.editForm.get(['id'])!.value,
      first_name: this.editForm.get(['first_name'])!.value,
      last_name: this.editForm.get(['last_name'])!.value,
      age: this.editForm.get(['age'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
