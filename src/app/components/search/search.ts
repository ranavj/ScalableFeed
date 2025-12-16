import { Component, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PostService } from '../../core/service/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private postService = inject(PostService);
  
  searchQuery = '';
  results = signal<any[]>([]);
  isLoading = signal(false);

  // 👇 Type karte hi search karne ke liye (Debounce)
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300), // 300ms rukne ke baad API call karo
      distinctUntilChanged(),
      switchMap((query) => {
        this.isLoading.set(true);
        return this.postService.searchPosts(query);
      })
    ).subscribe({
      next: (data) => {
        this.results.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: any) {
    const value = event.target.value;
    if (value.length > 2) {
      this.searchSubject.next(value);
    } else {
      this.results.set([]); // Agar text hata diya toh result clear
    }
  }
}
