import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/posts';

  createPost(content: string, file: File | null) {
    const formData = new FormData();
    formData.append('content', content);
    
    if (file) {
      formData.append('file', file); // Backend mein @UploadedFile('file') match hona chahiye
    }

    return this.http.post(this.apiUrl, formData);
  }
}