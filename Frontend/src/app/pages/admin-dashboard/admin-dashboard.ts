import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { Header } from "../../components/header/header";
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Icons } from '../../shared/icons';
import { Sidebar } from "../../components/sidebar/sidebar";
import { DataTable } from "../../shared/data-table/data-table";

interface Employee {
  id?: number;
  name: string;
  adresse: string;
  ville: string;
  phone: string;
  email: string;
  password: string;
  createdAt?: Date;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Header,
    Sidebar,
    DataTable
],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private storageKey = 'employees_data';
  icons = Icons;

  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Search and filter
  searchText = '';
  selectedCity = '';
  uniqueCities: string[] = [];

  // Pagination
  pagination: PaginationInfo = {
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0
  };

  // Sorting
  sortColumn: keyof Employee = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Data
  public originalData: Employee[] = [];
  filteredData: Employee[] = [];

  // Modal state
  showModal = false;
  editMode = false;
  private editId: number | null = null;

  // Form with validation
  form: Partial<Employee> = {};
  formErrors: { [key: string]: string } = {};

  // Loading state
  isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.isLoading = true;

    // Try to load from localStorage first
    const savedData = localStorage.getItem(this.storageKey);

    if (savedData) {
      // Parse saved data and ensure dates are properly restored
      this.originalData = JSON.parse(savedData, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      });
      this.isLoading = false;
    } else {
      // Initialize with default data if no saved data exists
      this.originalData = [
        {
          id: 1,
          name: 'Mohamed Ali',
          adresse: 'Rue Djerba',
          ville: 'Mednine',
          phone: '+216 96 721 654',
          email: 'mohamed.ali@example.com',
          password: '********',
          createdAt: new Date()
        }
      ];
    }

    // Save to localStorage immediately
    this.saveToLocalStorage();
    this.updateUniqueCities();
    this.applyFilters();
    this.isLoading = false;
  }

  private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pagination.currentPage = 1;
      this.applyFilters();
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.originalData));
  }

  private updateUniqueCities(): void {
    this.uniqueCities = [...new Set(this.originalData.map(emp => emp.ville))];
  }

  applyFilters(): void {
    let filtered = [...this.originalData];

    // Apply search filter
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchLower) ||
        emp.adresse.toLowerCase().includes(searchLower) ||
        emp.ville.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply city filter
    if (this.selectedCity) {
      filtered = filtered.filter(emp => emp.ville === this.selectedCity);
    }

    // Apply sorting
    filtered = this.sortData(filtered);

    // Update pagination
    this.pagination.totalItems = filtered.length;
    this.pagination.totalPages = Math.ceil(filtered.length / this.pagination.pageSize);

    // Ensure current page is valid
    if (this.pagination.currentPage > this.pagination.totalPages) {
      this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
    }

    // Apply pagination
    const start = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    this.filteredData = filtered.slice(start, end);
  }

  private sortData(data: Employee[]): Employee[] {
  return data.sort((a, b) => {
    const aVal = a[this.sortColumn];
    const bVal = b[this.sortColumn];

    // Convert to strings for comparison (simple approach)
    const aString = String(aVal ?? '').toLowerCase();
    const bString = String(bVal ?? '').toLowerCase();

    if (this.sortDirection === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });
}

  sortTable(column: keyof Employee): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: keyof Employee): string {
    if (this.sortColumn !== column) return '↑↓';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Pagination methods
  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.pagination.currentPage++;
      this.applyFilters();
    }
  }

  prevPage(): void {
    if (this.pagination.currentPage > 1) {
      this.pagination.currentPage--;
      this.applyFilters();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, this.pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.pagination.totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Generate new ID
  private generateNewId(): number {
    if (this.originalData.length === 0) return 1;
    return Math.max(...this.originalData.map(emp => emp.id || 0)) + 1;
  }

  // Modal methods
  openAdd(): void {
    this.editMode = false;
    this.editId = null;
    this.form = {
      name: '',
      adresse: '',
      ville: '',
      phone: '',
      email: '',
      password: ''
    };
    this.formErrors = {};
    this.showModal = true;
  }

  openEdit(employee: Employee): void {
    this.editMode = true;
    this.editId = employee.id || null;
    this.form = { ...employee };
    this.formErrors = {};
    this.showModal = true;
  }

  validateForm(): boolean {
    this.formErrors = {};

    if (!this.form.name?.trim()) {
      this.formErrors['name'] = 'Name is required';
    }

    if (!this.form.email?.trim()) {
      this.formErrors['email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.formErrors['email'] = 'Invalid email format';
    }

    if (!this.form.phone?.trim()) {
      this.formErrors['phone'] = 'Phone number is required';
    }

    if (!this.editMode && !this.form.password?.trim()) {
      this.formErrors['password'] = 'Password is required';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  save(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Simulate API call with timeout
    setTimeout(() => {
      if (this.editMode && this.editId !== null) {
        // Update existing employee
        const index = this.originalData.findIndex(emp => emp.id === this.editId);
        if (index !== -1) {
          this.originalData[index] = {
            ...this.originalData[index],
            ...this.form,
            id: this.editId
          };
        }
      } else {
        // Add new employee
        const newEmployee: Employee = {
          ...this.form as Employee,
          id: this.generateNewId(),
          createdAt: new Date()
        };
        this.originalData.push(newEmployee);
      }

      // Save to localStorage
      this.saveToLocalStorage();

      // Update UI
      this.updateUniqueCities();
      this.applyFilters();
      this.close();
      this.isLoading = false;
    }, 300);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.originalData = this.originalData.filter(emp => emp.id !== id);

        // Save to localStorage
        this.saveToLocalStorage();

        // Update UI
        this.updateUniqueCities();
        this.applyFilters();
        this.isLoading = false;
      }, 300);
    }
  }

  close(): void {
    this.showModal = false;
    this.form = {};
    this.formErrors = {};
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }


  clearFilters(): void {
    this.searchText = '';
    this.selectedCity = '';
    this.pagination.currentPage = 1;
    this.sortColumn = 'name';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  get paginationInfo(): string {
    if (this.pagination.totalItems === 0) {
      return 'No entries to display';
    }
    const start = ((this.pagination.currentPage - 1) * this.pagination.pageSize) + 1;
    const end = Math.min(this.pagination.currentPage * this.pagination.pageSize, this.pagination.totalItems);
    return `Showing ${start} to ${end} of ${this.pagination.totalItems} entries`;
  }

  // Reset data to default (useful for testing)
  resetToDefault(): void {
    if (confirm('Reset to default data? This will delete all your changes.')) {
      this.originalData = [
        {
          id: 1,
          name: 'Mohamed Ali',
          adresse: 'Rue Djerba',
          ville: 'Mednine',
          phone: '+216 96 721 654',
          email: 'mohamed.ali@example.com',
          password: '********',
          createdAt: new Date()
        }
      ];
      this.saveToLocalStorage();
      this.updateUniqueCities();
      this.applyFilters();
    }
  }
}
