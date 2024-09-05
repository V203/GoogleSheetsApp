import { Component, inject, input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IUser } from '../../models/iuser';
import { ServicesService } from '../../services/services.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    NgIf,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerComponent

  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {

  service = inject(ServicesService);
  tableUserlist = input<IUser[]>([]);
  selectedUser: any = null
  selectedIndex: any = null
  displayedColumns = ["name", "last_name", "email", "actions"];
  loading = false;

  formUpdate = new FormGroup({
    name: new FormControl<string>(this.selectedUser ? this.selectedUser.name : ""),
    last_name: new FormControl<string>(this.selectedUser ? this.selectedUser.last_name : ""),
    email: new FormControl<string>(this.selectedUser ? this.selectedUser.email : ""),
  });

  constructor( ){


  }

  fectSelctedUser(person: IUser, index: number) {
    this.selectedUser = person;
    console.log(person);
    // console.log(this.selectedUser);
    this.selectedIndex = index;
    this.formUpdate.setValue (
      {
        name: person.name,
        last_name: person.last_name,
        email : person.email
      } )
  };

  deleteUser(id: number) {
    this.loading = true
    this.service.deleteUser(id).subscribe({

      next: (res) => {

        console.log(res);
        this.service.getAllUsers();
        this.loading = false

        if (res) {

          console.log(res);

        };

      }
    })
  };

  onSubmitUpateUser() {
    this.loading = true
    
    console.log(this.selectedUser);
    let { name = "", last_name = "", email = "" } = this.formUpdate.value as { name: string, last_name: string, email: string };

    this.service.updateUser(this.selectedIndex, name, last_name, email).subscribe({
      next: (res) => {

        console.log(res);
        this.service.getAllUsers()
        this.loading = false
      },
      error: (error) => {

        console.log(error);

      }
    })

    this.selectedUser = null
    this.service.getAllUsers()

  }

}
