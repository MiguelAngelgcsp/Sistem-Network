import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/models';
import { RolDialogComponent } from './rol-dialog.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatTooltipModule, MatChipsModule, MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <a mat-button routerLink="/admin"><mat-icon>arrow_back</mat-icon></a>
          <h1><mat-icon>group</mat-icon> Gestión de Usuarios</h1>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="full-width" style="margin-bottom:8px">
            <mat-label>Buscar usuario</mat-label>
            <input matInput [formControl]="buscarCtrl" placeholder="Nombre, email...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let u">
                <strong>{{ u.nombre }} {{ u.apellido }}</strong>
                <br><small style="color:#888">{{ u.email }}</small>
              </td>
            </ng-container>

            <ng-container matColumnDef="rol">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Rol</th>
              <td mat-cell *matCellDef="let u">
                <span class="badge-rol {{ u.rol }}">{{ u.rol }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="programa">
              <th mat-header-cell *matHeaderCellDef>Programa</th>
              <td mat-cell *matCellDef="let u">{{ u.programa || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let u">
                <mat-chip [class]="u.activo ? 'chip-activo' : 'chip-inactivo'">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let u">
                <button mat-icon-button color="primary" matTooltip="Cambiar rol" (click)="cambiarRol(u)">
                  <mat-icon>manage_accounts</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="Eliminar usuario" (click)="eliminar(u)">
                  <mat-icon>person_remove</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;" class="table-row"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="cols.length" style="text-align:center;padding:32px;color:#999">
                No se encontraron usuarios.
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; margin-bottom: 20px; }
    .page-header h1 { display: flex; align-items: center; gap: 8px; font-size: 24px; color: #3f51b5; }
    .table-row:hover { background: #f5f5f5; }
    .chip-activo   { background: #c8e6c9 !important; color: #2e7d32 !important; }
    .chip-inactivo { background: #ffcdd2 !important; color: #c62828 !important; }
  `]
})
export class UsuariosComponent implements OnInit {
  dataSource = new MatTableDataSource<Usuario>([]);
  cols = ['nombre', 'rol', 'programa', 'activo', 'acciones'];
  buscarCtrl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: UsuariosService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.buscarCtrl.valueChanges.subscribe(v => {
      this.dataSource.filter = (v || '').trim().toLowerCase();
    });
  }

  cargar(): void {
    this.service.listar().subscribe(res => {
      if (res.exito) {
        this.dataSource.data = res.usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (u, f) =>
          `${u.nombre} ${u.apellido} ${u.email} ${u.rol}`.toLowerCase().includes(f);
      }
    });
  }

  cambiarRol(u: Usuario): void {
    const ref = this.dialog.open(RolDialogComponent, { width: '340px', data: u });
    ref.afterClosed().subscribe(result => {
      if (result) this.cargar();
    });
  }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario ${u.nombre} ${u.apellido}?`)) return;
    this.service.eliminar(u._id).subscribe({
      next: res => {
        if (res.exito) {
          this.snack.open('Usuario eliminado', '', { duration: 2500 });
          this.cargar();
        }
      },
      error: err => this.snack.open(err.error?.mensaje || 'Error', 'Cerrar', { duration: 4000, panelClass: 'error' })
    });
  }
}
