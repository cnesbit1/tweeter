import { AuthToken, Status } from '../../../../tweeter-shared';
import { StatusItemPresenter } from './StatusItemPresenter';
import { PAGE_SIZE } from './PagedItemPresenter';

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    console.log('=== getMoreItems called ===');
    console.log('authToken:', authToken);
    console.log('userAlias:', userAlias);
    console.log('PAGE_SIZE:', PAGE_SIZE);
    console.log('lastItem (before loadMoreStoryItems):', this.lastItem);
    const hasLastItem = this.lastItem ? 'Yes' : 'No';
    console.log(`Does lastItem exist? ${hasLastItem}`);
    const lastTimestamp = this.lastItem ? this.lastItem.timestamp : null;
    console.log('lastTimestamp:', lastTimestamp);

    return this.service
      .loadMoreStoryItems(authToken, userAlias, PAGE_SIZE, this.lastItem)
      .then(([newItems, hasMore]) => {
        // Log the response to check structure
        console.log('=== loadMoreStoryItems response ===');
        console.log('newItems:', newItems);
        console.log('newItems length:', newItems.length);
        console.log('hasMore:', hasMore);

        if (newItems.length > 0) {
          this.lastItem = newItems[newItems.length - 1];
        } else {
          this.lastItem = null; // No more items to load
        }

        console.log('lastItem (after loadMoreStoryItems):', this.lastItem);

        // Ensure the items and hasMore are returned in the correct tuple format
        return [newItems, hasMore] as [Status[], boolean]; // Ensure it's a tuple
      });
  }
  protected getItemDescription(): string {
    return 'load story';
  }
}
