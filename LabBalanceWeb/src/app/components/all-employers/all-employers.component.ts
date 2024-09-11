import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { EmployeeService } from "../../services/employee/employee.service";
import { FormControl } from '@angular/forms'; // Add this for reactive forms
import { debounceTime } from 'rxjs/operators'; // Add debounceTime to optimize search

@Component({
  selector: 'app-all-employers',
  templateUrl: './all-employers.component.html',
  styleUrls: ['./all-employers.component.css']
})
export class AllEmployersComponent implements OnInit {
  isActive = false;
  employees: any;
  searchControl: FormControl = new FormControl(); // Use FormControl for search input

  constructor(private employeeService: EmployeeService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.getAllEmployees(); // Fetch all employees when the component is initialized

    // Listen for changes in the search input field
    this.searchControl.valueChanges
      .pipe(debounceTime(300)) // Wait 300ms after typing stops
      .subscribe(query => {
        if (query && query.trim() !== '') {
          this.searchEmployees(query); // Perform search when query exists
        } else {
          this.getAllEmployees(); // Fetch all employees when the search field is cleared
        }
      });
  }

  getAllEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(res => {
      this.employees = res;
    });
  }

  // Search employees by name
  searchEmployees(query: string): void {
    this.employeeService.searchEmployees(query).subscribe(
      data => this.employees = data,
      error => console.error('Error searching employees:', error)
    );
  }

  // Method to handle displaying images, including placeholders
  updateImg(img: string | null | undefined): string {
    return img && img.trim() !== ''
      ? `data:image/jpeg;base64,${img}`
      : 'assets/Greydefault.jpg'; // Return the default placeholder image
  }

  // Click on the search icon to toggle the search bar
  @HostListener('click', ['$event'])
  onIconClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isIcon = targetElement.classList.contains('search-icon');
    const isInput = targetElement.classList.contains('search-input');

    if (isIcon || isInput) {
      this.isActive = !this.isActive;
      event.stopPropagation(); // Prevent click event from propagating
    }
  }

  // Click anywhere outside the search container to close it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isActive = false;
    }
  }
}
