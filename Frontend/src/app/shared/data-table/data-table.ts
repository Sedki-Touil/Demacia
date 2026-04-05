import { CommonModule } from '@angular/common';
import { Component, Input, Output , EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  imports: [FormsModule, CommonModule]
})
export class DataTable implements OnChanges {
  @Input() title: string = 'Data Table';
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() pageSize: number = 5;
  @Input() enableActions: boolean = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();

  searchText: string = '';
  selectedCity: string = '';
  filteredData: any[] = [];
  pagination = { currentPage: 1, totalPages: 1, totalItems: 0 };
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges() {
    this.filteredData = [...this.data];
    this.applyFilters();
  }

  get uniqueCities() {
    return Array.from(new Set(this.data.map(item => item.ville)));
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.data.filter(item => {
      const searchMatch = this.searchText
        ? Object.values(item).some(val => String(val).toLowerCase().includes(this.searchText.toLowerCase()))
        : true;

      const cityMatch = this.selectedCity ? item.ville === this.selectedCity : true;

      return searchMatch && cityMatch;
    });

    if (this.sortColumn) this.sortTable(this.sortColumn, false);

    this.pagination.currentPage = 1;
    this.updatePagination();
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCity = '';
    this.applyFilters();
  }

  updatePagination() {
    this.pagination.totalItems = this.filteredData.length;
    this.pagination.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    const start = (this.pagination.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredData = this.filteredData.slice(start, end);
  }

  goToPage(page: number) {
    this.pagination.currentPage = page;
    this.updatePagination();
  }

  prevPage() { if (this.pagination.currentPage > 1) this.goToPage(this.pagination.currentPage - 1); }
  nextPage() { if (this.pagination.currentPage < this.pagination.totalPages) this.goToPage(this.pagination.currentPage + 1); }

  // Tri dynamique
  sortTable(column: string, toggle: boolean = true) {
    if (toggle) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    }

    this.filteredData.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  getSortIcon(column: string) {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  onEditRow(row: any) { this.edit.emit(row); }
  onDeleteRow(row: any) { this.delete.emit(row); }
  onAddRow() { this.add.emit(); }
}
