import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/posts';

  // 👇 Update Arguments: Ab yeh object accept karega
  createPost(postData: { title: string, content: string }, file: File | null) {
    
    const formData = new FormData();
    
    // 1. Title Append karein (Backend mein required hai)
    formData.append('title', postData.title);
    
    // 2. Content Append karein
    formData.append('content', postData.content);
    
    // 3. File Append karein (Agar user ne select ki hai)
    if (file) {
      formData.append('file', file); 
    }

    return this.http.post(this.apiUrl, formData);
  }

  searchPosts(query: string) {
    // Backend API: http://localhost/posts/search?q=apple
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}