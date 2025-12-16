import { Component, OnInit, inject, signal } from '@angular/core'; // inject import karein
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common'; // UI loops ke liye
import { SocketService } from '../core/service/socket.service';

// 1. GraphQL Query Define karein
const GET_FEED = gql`
    query GetFeed ($skip: Int!, $limit: Int!) { # 👈 Variables accept karein
      feed(skip: $skip, limit: $limit){
        _id
        content
        likes
        author {
          username
          avatarUrl
        }
      }
    }
  `;

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule], // CommonModule zaroori hai
  templateUrl: './feed.html',
  styleUrl: './feed.css'
})
export class Feed implements OnInit {
  // 2. Apollo Inject karein
  private apollo = inject(Apollo);
  private socketService = inject(SocketService);
  posts = signal<any[]>([]); // Empty array se initialize
  loading = signal<boolean>(true);
  error: any;
  skip = 0;
  limit = 5; // Ek baar mein 5 posts layenge
  ngOnInit() {
    // 3. Query Run karein
    console.log('🔌 Connecting to WebSocket...');

    // 🎧 Listen for 'post-ready' event
    this.socketService.listen('post-ready').subscribe((newPost) => {
      console.log('🔔 Notification Received:', newPost);

      // (Kyunki humein pata hai yeh post Current User ne hi kiya hai)
      if (!newPost.author) {
        newPost.author = {
          username: 'Me', // Ya LocalStorage se user ka naam nikal lo
          avatarUrl: null
        };
      }
      // List ke TOP par naya post add karo
      this.posts.update(currentPosts => [newPost, ...currentPosts]);

      // Optional: Sound play kar sakte hain yahan
    });
    this.loadPosts();
  }

  loadPosts() {
    this.apollo
      .query({
        query: GET_FEED,
        variables: {
          skip: this.skip,  // Pehli baar 0, agli baar 5, phir 10...
          limit: this.limit
        },
        fetchPolicy: 'network-only'
      })
      .subscribe((result: any) => {
        const newPosts = result?.data?.feed || [];
        
        if (newPosts.length > 0) {
          // 1. Posts array update karein
          this.posts.update(currentPosts => [...currentPosts, ...newPosts]);

          // 👇 2. YEH LINE MISSING THI (Next batch ke liye tayari)
          this.skip += this.limit; 
        }

        this.loading.set(result.loading);
        this.error = result.error;
        console.log('Data loaded. Next skip:', this.skip);
      });
  }
}