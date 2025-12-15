import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; // 👈 Reactive Imports
import { Router } from '@angular/router';
import { PostService } from '../core/service/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 FormsModule hataya, ReactiveFormsModule lagaya
  templateUrl: './create-post.html',
  styleUrl: './create-post.css'
})
export class CreatePost {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);

  // 📝 Reactive Form Group
  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]], // Title Add kiya
    content: ['', [Validators.required, Validators.minLength(5)]]
  });

  // 🚦 UI Signals (State ke liye Signals best hain)
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  isLoading = signal(false);

  // 📂 File Select Handler (Same logic)
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);

      // Preview generate karna
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // 🚀 Submit Handler
  onSubmit() {
    if (this.postForm.invalid) return; // Agar form invalid hai toh ruk jao

    this.isLoading.set(true);

    // Form ki values nikalna
    const { title, content } = this.postForm.value;

    // Service call (Title aur Content bhejna)
    // Note: Ensure karein ki service ab object accept kare ya arguments match karein
    const postData = { title, content };

    this.postService.createPost(postData, this.selectedFile())
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.postForm.reset(); // Form clear
          this.selectedFile.set(null);
          this.previewUrl.set(null);
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
          alert('Failed to post. Check console.');
        }
      });
  }
}