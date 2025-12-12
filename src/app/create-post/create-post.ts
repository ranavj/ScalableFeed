import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Template-driven form (simple form ke liye)
import { Router } from '@angular/router';
import { PostService } from '../core/service/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css'
})
export class CreatePost {
  private postService = inject(PostService);
  private router = inject(Router);

  // Signals
  content = signal('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isLoading = signal(false);

  // File Select Handler
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);

      // Preview create karna (Browser memory mein)
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // Submit Handler
  onSubmit() {
    if (!this.content()) return;

    this.isLoading.set(true);
    
    this.postService.createPost(this.content(), this.selectedFile())
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']); // Success par Home bhejo
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
          alert('Failed to post. Check console.');
        }
      });
  }
}