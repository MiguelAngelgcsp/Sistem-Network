import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/models';

@Component({
  selector: 'app-rol-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title><mat-icon>manage_accounts</mat-icon> Cambiar Rol</h2>
    <mat-dialog-content>
      <p>Usuario: <strong>{{ data.nombre }} {{ data.apellido }}</strong></p>
      <mat-form-field appearance="outline" class="full-width" style="margin-top:12px">
        <mat-label>Nuevo Rol</mat-label>
        <mat-select [formControl]="rolCtrl">
          <mat-option value="estudiante">Estudiante</mat-option>
          <mat-option value="editor">Editor</mat-option>
          <mat-option value="administrador">Administrador</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="guardando">
        <mat-icon>save</mat-icon> Asignar
      </button>
    </mat-dialog-actions>
  `
})
export class RolDialogComponent {
  rolCtrl: FormControl;
  guardando = false;

  constructor(
    private service: UsuariosService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<RolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    this.rolCtrl = new FormControl(data.rol, Validators.required);
  }

  guardar(): void {
    this.guardando = true;
    this.service.asignarRol(this.data._id, this.rolCtrl.value).subscribe({
      next: res => {
        this.guardando = false;
        this.snack.open(res.mensaje || 'Rol actualizado', '', { duration: 2500, panelClass: 'success' });
        this.dialogRef.close(true);
      },
      error: err => {
        this.guardando = false;
        this.snack.open(err.error?.mensaje || 'Error', 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }
}
