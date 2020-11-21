import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedItem } from '../models/feed-item.model';
import { FeedProviderService } from '../services/feed.provider.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit, OnDestroy {
  @Input() feedItems: FeedItem[];
  subscriptions: Subscription[] = [];
  constructor(
    private feed: FeedProviderService,
    private auth: AuthService) { }

  async ngOnInit() {
    this.subscriptions.push(
      this.feed.currentFeed$.subscribe((items) => {
        this.feedItems = items;
      }));

    this.subscriptions.push(
      this.auth.currentUser$.subscribe(async (user) => {
        if (!user) { this.feedItems = []; }
        else { await this.feed.getFeed(); }
      }));

    await this.feed.getFeed();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
