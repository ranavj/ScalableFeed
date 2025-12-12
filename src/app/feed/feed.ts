import { Component, OnInit, inject, signal } from '@angular/core'; // inject import karein
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common'; // UI loops ke liye

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

  posts = signal<any[]>([]); // Empty array se initialize
  loading = signal<boolean>(true);
  error: any;
  skip = 0;
  limit = 5; // Ek baar mein 5 posts layenge
  ngOnInit() {
    // 3. Query Run karein
    this.loadPosts()
  }

  loadPosts(){
    this.apollo
      .query({
        query: GET_FEED,
        variables: { // 👈 Variables bhejein
          skip: this.skip,
          limit: this.limit
        },
        fetchPolicy: 'network-only'
      })
      .subscribe((result: any) => {
        const newPosts = result?.data?.feed || [];
        // .update() use karke purane posts mein naye posts jode
        this.posts.update(currentPosts => [...currentPosts, ...newPosts]);
        this.loading.set(result.loading);
        this.error = result.error;
        console.log('Data aagya:', result); // Console mein check karne ke liye
      });
  }
}