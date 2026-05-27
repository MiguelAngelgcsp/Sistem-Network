import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoriasService } from '../../../core/services/categorias.service';
import { AuthService } from '../../../core/services/auth.service';
import { Categoria } from '../../../core/models/models';
import { CategoriaFormDialogComponent } from './categoria-form-dialog.component';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSnackBarModule,
    MatTooltipModule, MatSortModule, MatChipsModule, MatSlideToggleModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1><mat-icon>category</mat-icon> Categorías</h1>
          <p class="subtitle">Gestión de categorías de noticias</p>
        </div>
        @if (auth.isEditor()) {
          <button mat-raised-button color="primary" (click)="abrirFormulario()">
            <mat-icon>add</mat-icon> Nueva Categoría
          </button>
        }
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px">
            <mat-label>Buscar categoría</mat-label>
            <input matInput (keyup)="filtrar($event)" placeholder="Nombre...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <!-- Color -->
            <ng-container matColumnDef="color">
              <th mat-header-cell *matHeaderCellDef>Color</th>
              <td mat-cell *matCellDef="let c">
                <span class="color-preview" [style.background]="c.color || '#999'"></span>
              </td>
            </ng-container>

            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let c"><strong>{{ c.nombre }}</strong></td>
            </ng-container>

            <!-- Descripción -->
            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let c">{{ c.descripcion || '—' }}</td>
            </ng-container>

            <!-- Estado -->
            <ng-container matColumnDef="activa">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let c">
                <mat-chip [class]="c.activa ? 'chip-activa' : 'chip-inactiva'">
                  {{ c.activa ? 'Activa' : 'Inactiva' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button color="primary"
                        matTooltip="Editar"
                        [disabled]="!auth.isAdmin()"
                        (click)="abrirFormulario(c)">
                  <mat-icon>edit</mat-icon>
                </button>
                @if (auth.isAdmin()) {
                  <button mat-icon-button color="warn"
                          matTooltip="Eliminar"
                          (click)="eliminar(c)">
                    <mat-icon>delete</mat-icon>
                  </button>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;" class="table-row"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="cols.length" style="text-align:center;padding:32px;color:#999">
                No hay categorías.
              </td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .page-header h1 { display: flex; align-items: center; gap: 8px; font-size: 26px; color: #3f51b5; }
    .subtitle { color: #888; font-size: 14px; margin-top: 4px; }
    .color-preview { display: inline-block; width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(0,0,0,.15); }
    .table-row:hover { background: #f5f5f5; }
    .chip-activa  { background: #c8e6c9 !important; color: #2e7d32 !important; }
    .chip-inactiva { background: #ffcdd2 !important; color: #c62828 !important; }
  `]
})
export class ListaCategoriasComponent implements OnInit {
  dataSource = new MatTableDataSource<Categoria>([]);
  cols = ['color', 'nombre', 'descripcion', 'activa', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public auth: AuthService,
    private service: CategoriasService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe(res => {
      if (res.exito) {
        this.dataSource.data = res.categorias;
        this.dataSource.sort = this.sort;
      }
    });
  }

  filtrar(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  abrirFormulario(cat?: Categoria): void {
    const ref = this.dialog.open(CategoriaFormDialogComponent, {
      width: '460px',
      data: cat || null
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.cargar();
    });
  }

  eliminar(cat: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    this.service.eliminar(cat._id).subscribe({
      next: res => {
        if (res.exito) {
          this.snack.open('Categoría eliminada', '', { duration: 2500 });
          this.cargar();
        }
      },
      error: err => this.snack.open(err.error?.mensaje || 'Error', 'Cerrar', { duration: 4000, panelClass: 'error' })
    });
  }
}
